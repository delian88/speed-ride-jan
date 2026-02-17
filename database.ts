
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Production-Grade Hybrid Data Engine
 */

const SALT_ROUNDS = 10;
const PRODUCTION_DB_URL = 'postgresql://neondb_owner:npg_JNlD0ieCuW1z@ep-crimson-frog-aimk0mkg-pooler.c-4.us-east-1.aws.neon.tech/speedride?sslmode=require&channel_binding=require';

let sqlInstance: any = null;
let isMock = false;
let connectionError: string | null = null;

const mockDb = {
  users: [] as any[],
  rides: [] as any[],
  transactions: [] as any[],
  invoices: [] as any[],
  settings: { baseFare: 1200, pricePerKm: 450, commission: 15, maintenanceMode: false }
};

const loadMock = async () => {
  const saved = localStorage.getItem('speedride_local_db');
  if (saved) {
    const data = JSON.parse(saved);
    mockDb.users = data.users || [];
    mockDb.rides = data.rides || [];
    mockDb.transactions = data.transactions || [];
    mockDb.invoices = data.invoices || [];
    mockDb.settings = data.settings || mockDb.settings;
  } else {
    const adminHash = await bcrypt.hash('admin123', SALT_ROUNDS);
    mockDb.users = [
      { id: 'admin_01', name: 'System Admin', email: 'admin', phone: '08000000000', password: adminHash, role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?u=admin', is_verified: true, balance: 0, rating: 5.0 }
    ];
    saveMock();
  }
};

const saveMock = () => {
  localStorage.setItem('speedride_local_db', JSON.stringify(mockDb));
};

const getSql = () => {
  const url = process.env.DATABASE_URL || PRODUCTION_DB_URL;
  if (!url) {
    if (!isMock) { isMock = true; loadMock(); }
    return null;
  }
  try {
    if (!sqlInstance) sqlInstance = neon(url);
    return sqlInstance;
  } catch (e) {
    connectionError = "Connection string parsing failed.";
    isMock = true;
    loadMock();
    return null;
  }
};

const mapUser = (u: any): User | Driver => {
  if (!u) return u;
  const { password, ...safeUser } = u;
  return {
    ...safeUser,
    isOnline: u.is_online,
    isVerified: u.is_verified,
    balance: parseFloat(u.balance || 0),
    rating: parseFloat(u.rating || 5),
    vehicleType: u.vehicle_type,
    vehicleModel: u.vehicle_model,
    plateNumber: u.plate_number,
    licenseDoc: u.license_doc,
    ninDoc: u.nin_doc,
    createdAt: u.created_at
  } as any;
};

const mapRide = (r: any): RideRequest => {
  if (!r) return r;
  return {
    ...r,
    riderId: r.rider_id,
    driverId: r.driver_id,
    vehicleType: r.vehicle_type,
    createdAt: r.created_at,
    fare: parseFloat(r.fare || 0),
    distance: parseFloat(r.distance || 0)
  };
};

export const db = {
  isLocal: () => isMock,
  getConnectionStatus: () => ({
    type: isMock ? 'SANDBOX' : 'PRODUCTION',
    provider: isMock ? 'LocalStorage' : 'Neon PostgreSQL',
    error: connectionError,
    encryption: 'BCRYPT_256'
  }),
  
  init: async () => {
    const sql = getSql();
    if (!sql) return;
    
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY, 
          name TEXT NOT NULL, 
          email TEXT UNIQUE NOT NULL, 
          phone TEXT NOT NULL, 
          password TEXT NOT NULL, 
          role TEXT NOT NULL, 
          avatar TEXT, 
          rating DECIMAL(3,2) DEFAULT 5.0, 
          balance DECIMAL(15,2) DEFAULT 0.0, 
          is_online BOOLEAN DEFAULT FALSE, 
          is_verified BOOLEAN DEFAULT FALSE, 
          vehicle_type TEXT, 
          vehicle_model TEXT, 
          plate_number TEXT, 
          license_doc TEXT, 
          nin_doc TEXT, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      
      await sql`
        CREATE TABLE IF NOT EXISTS rides (
          id TEXT PRIMARY KEY, 
          rider_id TEXT REFERENCES users(id), 
          driver_id TEXT REFERENCES users(id), 
          pickup TEXT NOT NULL, 
          dropoff TEXT NOT NULL, 
          fare DECIMAL(12,2) NOT NULL, 
          distance DECIMAL(8,2) NOT NULL, 
          status TEXT NOT NULL, 
          vehicle_type TEXT NOT NULL, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

      await sql`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          user_id TEXT REFERENCES users(id),
          ride_id TEXT REFERENCES rides(id),
          amount DECIMAL(15,2) NOT NULL,
          type TEXT NOT NULL, 
          category TEXT NOT NULL, 
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id),
          invoice_no TEXT NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          status TEXT NOT NULL, 
          redirect_link TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      
      await sql`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB)`;
      
      const count = await sql`SELECT count(*) FROM users`;
      if (parseInt(count[0].count) === 0) {
        const hashedAdmin = await bcrypt.hash('admin123', SALT_ROUNDS);
        await sql`INSERT INTO users (id, name, email, phone, password, role, is_verified) VALUES ('admin_01', 'Admin', 'admin', '080', ${hashedAdmin}, 'ADMIN', true)`;
        await sql`INSERT INTO settings (key, value) VALUES ('global_config', '{"baseFare": 1200, "pricePerKm": 450, "commission": 15}'::jsonb)`;
      }
      isMock = false;
    } catch (e: any) {
      connectionError = e.message;
      isMock = true;
      await loadMock();
    }
  },

  auth: {
    login: async (email: string, passwordInput: string) => {
      const sql = getSql();
      if (isMock) {
        const u = mockDb.users.find(x => x.email.toLowerCase() === email.toLowerCase());
        if (!u) throw new Error("Account not found.");
        const isMatch = await bcrypt.compare(passwordInput, u.password);
        if (!isMatch) throw new Error("Invalid password.");
        return { ...mapUser(u), token: 'mock_token_' + Math.random() };
      }
      const res = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
      if (!res[0]) throw new Error("Account not found.");
      const isMatch = await bcrypt.compare(passwordInput, res[0].password);
      if (!isMatch) throw new Error("Invalid password.");
      return { ...mapUser(res[0]), token: 'pg_token_' + Math.random() };
    }
  },

  users: {
    getAll: async () => {
      if (isMock) return mockDb.users.map(mapUser);
      const sql = getSql();
      const res = await sql`SELECT * FROM users ORDER BY created_at DESC`;
      return res.map(mapUser);
    },
    getById: async (id: string) => {
      if (isMock) return mapUser(mockDb.users.find(u => u.id === id));
      const sql = getSql();
      const res = await sql`SELECT * FROM users WHERE id = ${id}`;
      return mapUser(res[0]);
    },
    getByEmail: async (email: string) => {
      if (isMock) return mapUser(mockDb.users.find(u => u.email === email));
      const sql = getSql();
      const res = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
      return mapUser(res[0]);
    },
    update: async (id: string, updates: any) => {
      if (isMock) {
        const idx = mockDb.users.findIndex(u => u.id === id);
        if (idx > -1) {
          const u = mockDb.users[idx];
          mockDb.users[idx] = { 
            ...u, 
            ...updates,
            is_online: updates.isOnline !== undefined ? updates.isOnline : u.is_online,
            is_verified: updates.isVerified !== undefined ? updates.isVerified : u.is_verified,
            balance: updates.balance !== undefined ? updates.balance : u.balance
          };
          saveMock();
        }
        return mapUser(mockDb.users[idx]);
      }
      const sql = getSql();
      const currentRes = await sql`SELECT * FROM users WHERE id = ${id}`;
      const current = currentRes[0];
      if (!current) throw new Error("User not found");
      const next = { ...mapUser(current), ...updates };
      await sql`
        UPDATE users SET 
          name=${next.name}, 
          phone=${next.phone}, 
          is_online=${next.isOnline || false}, 
          is_verified=${next.isVerified || false}, 
          balance=${next.balance},
          rating=${next.rating}
        WHERE id=${id}`;
      return next;
    },
    updatePassword: async (email: string, newPasswordInput: string) => {
      const hashedPassword = await bcrypt.hash(newPasswordInput, SALT_ROUNDS);
      if (isMock) {
        const idx = mockDb.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (idx === -1) return false;
        mockDb.users[idx].password = hashedPassword;
        saveMock();
        return true;
      }
      const sql = getSql();
      await sql`UPDATE users SET password = ${hashedPassword} WHERE LOWER(email) = LOWER(${email})`;
      return true;
    },
    create: async (data: any) => {
      const id = 'u_' + Math.random().toString(36).substr(2, 9);
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      if (isMock) {
        const newUser = { ...data, id, password: hashedPassword, balance: 0, rating: 5.0, is_online: data.isOnline || false, is_verified: data.isVerified || false };
        mockDb.users.push(newUser);
        saveMock();
        return { ...mapUser(newUser), token: 'mock_t' };
      }
      const sql = getSql();
      await sql`
        INSERT INTO users (
          id, name, email, phone, password, role, avatar, balance, 
          vehicle_type, vehicle_model, plate_number, is_online, is_verified, license_doc, nin_doc
        ) VALUES (
          ${id}, ${data.name}, ${data.email}, ${data.phone}, ${hashedPassword}, ${data.role}, 
          ${data.avatar}, 0.0, ${data.vehicleType || null}, ${data.vehicleModel || null}, 
          ${data.plateNumber || null}, ${data.isOnline || false}, ${data.isVerified || false}, 
          ${data.licenseDoc || null}, ${data.ninDoc || null}
        )`;
      return { ...mapUser({ ...data, id, balance: 0 }), token: 'pg_t' };
    },
    fundWallet: async (userId: string, amount: number) => {
      if (isMock) {
        const user = mockDb.users.find(u => u.id === userId);
        if (user) {
          user.balance += amount;
          mockDb.transactions.push({ user_id: userId, amount, type: 'CREDIT', category: 'TOPUP', description: 'Wallet Funding', created_at: new Date().toISOString() });
          saveMock();
          return mapUser(user);
        }
        throw new Error("User not found");
      }
      const sql = getSql();
      await sql`UPDATE users SET balance = balance + ${amount} WHERE id = ${userId}`;
      await sql`INSERT INTO transactions (user_id, amount, type, category, description) VALUES (${userId}, ${amount}, 'CREDIT', 'TOPUP', 'Wallet Funding')`;
      const res = await sql`SELECT * FROM users WHERE id = ${userId}`;
      return mapUser(res[0]);
    }
  },

  invoices: {
    create: async (userId: string, data: any) => {
      const id = 'inv_' + Math.random().toString(36).substr(2, 9);
      if (isMock) {
        const newInv = { ...data, id, user_id: userId, created_at: new Date().toISOString() };
        mockDb.invoices.push(newInv);
        saveMock();
        return newInv;
      }
      const sql = getSql();
      await sql`INSERT INTO invoices (id, user_id, invoice_no, amount, status, redirect_link) VALUES (${id}, ${userId}, ${data.invoice_no}, ${data.amount}, ${data.status}, ${data.redirect_link})`;
      return { ...data, id, user_id: userId };
    },
    getByUser: async (userId: string) => {
      if (isMock) {
        return mockDb.invoices.filter(i => i.user_id === userId).reverse();
      }
      const sql = getSql();
      return await sql`SELECT * FROM invoices WHERE user_id = ${userId} ORDER BY created_at DESC`;
    },
    updateStatus: async (invoiceNo: string, status: string) => {
      if (isMock) {
        const inv = mockDb.invoices.find(i => i.invoice_no === invoiceNo);
        if (inv) {
          inv.status = status;
          saveMock();
        }
        return inv;
      }
      const sql = getSql();
      await sql`UPDATE invoices SET status = ${status} WHERE invoice_no = ${invoiceNo}`;
      const res = await sql`SELECT * FROM invoices WHERE invoice_no = ${invoiceNo}`;
      return res[0];
    }
  },

  rides: {
    create: async (ride: any) => {
      const id = 'r_' + Math.random().toString(36).substr(2, 9);
      const fare = parseFloat(ride.fare);
      if (isMock) {
        const newRide = { ...ride, id, status: RideStatus.REQUESTED, created_at: new Date().toISOString(), rider_id: ride.riderId, vehicle_type: ride.vehicleType };
        const rider = mockDb.users.find(u => u.id === ride.riderId);
        if (!rider || rider.balance < fare) throw new Error("Insufficient Balance");
        mockDb.rides.push(newRide);
        rider.balance -= fare;
        mockDb.transactions.push({ user_id: rider.id, ride_id: id, amount: fare, type: 'DEBIT', category: 'FARE', description: `Ride Booking: ${id}`, created_at: new Date().toISOString() });
        saveMock();
        return mapRide(newRide);
      }
      const sql = getSql();
      const userRes = await sql`SELECT balance FROM users WHERE id = ${ride.riderId}`;
      if (!userRes[0] || parseFloat(userRes[0].balance) < fare) throw new Error("Insufficient Balance");
      
      await sql`INSERT INTO rides (id, rider_id, pickup, dropoff, fare, distance, status, vehicle_type) VALUES (${id}, ${ride.riderId}, ${ride.pickup}, ${ride.dropoff}, ${fare}, ${ride.distance}, ${RideStatus.REQUESTED}, ${ride.vehicleType})`;
      await sql`UPDATE users SET balance = balance - ${fare} WHERE id = ${ride.riderId}`;
      await sql`INSERT INTO transactions (user_id, ride_id, amount, type, category, description) VALUES (${ride.riderId}, ${id}, ${fare}, 'DEBIT', 'FARE', ${`Ride Booking: ${id}`})`;
      return mapRide({ ...ride, id, status: RideStatus.REQUESTED });
    },
    getAll: async () => {
      if (isMock) return mockDb.rides.map(mapRide);
      const sql = getSql();
      const res = await sql`SELECT * FROM rides ORDER BY created_at DESC`;
      return res.map(mapRide);
    },
    getByUser: async (uid: string) => {
      if (isMock) return mockDb.rides.filter(r => r.rider_id === uid || r.driver_id === uid).map(mapRide);
      const sql = getSql();
      const res = await sql`SELECT * FROM rides WHERE rider_id = ${uid} OR driver_id = ${uid} ORDER BY created_at DESC`;
      return res.map(mapRide);
    },
    getAvailableForDriver: async (vt: string) => {
      if (isMock) return mockDb.rides.filter(r => r.status === RideStatus.REQUESTED && r.vehicle_type === vt).map(mapRide);
      const sql = getSql();
      const res = await sql`SELECT * FROM rides WHERE status = ${RideStatus.REQUESTED} AND vehicle_type = ${vt}`;
      return res.map(mapRide);
    },
    updateStatus: async (rid: string, status: string, did?: string) => {
      const sql = getSql();
      const settings = await db.settings.get();
      const commissionRate = settings.commission || 15;

      if (isMock) {
        const ride = mockDb.rides.find(r => r.id === rid);
        if (ride) {
          ride.status = status;
          if (did) ride.driver_id = did;
          if (status === RideStatus.COMPLETED && ride.driver_id) {
            const fare = parseFloat(ride.fare);
            const commission = fare * (commissionRate / 100);
            const driverEarning = fare - commission;
            const driver = mockDb.users.find(u => u.id === ride.driver_id);
            if (driver) {
              driver.balance += driverEarning;
              mockDb.transactions.push({ user_id: driver.id, ride_id: rid, amount: driverEarning, type: 'CREDIT', category: 'FARE', description: `Ride Completion: ${rid}`, created_at: new Date().toISOString() });
            }
          }
          saveMock();
        }
        return mapRide(ride);
      }

      if (did) await sql`UPDATE rides SET status=${status}, driver_id=${did} WHERE id=${rid}`;
      else await sql`UPDATE rides SET status=${status} WHERE id=${rid}`;
      
      if (status === RideStatus.COMPLETED) {
        const rideRes = await sql`SELECT * FROM rides WHERE id = ${rid}`;
        const r = rideRes[0];
        if (r && r.driver_id) {
          const fare = parseFloat(r.fare);
          const commission = fare * (commissionRate / 100);
          const driverEarning = fare - commission;
          
          await sql`UPDATE users SET balance = balance + ${driverEarning} WHERE id = ${r.driver_id}`;
          await sql`INSERT INTO transactions (user_id, ride_id, amount, type, category, description) VALUES (${r.driver_id}, ${rid}, ${driverEarning}, 'CREDIT', 'FARE', ${`Ride Earning: ${rid}`})`;
          await sql`INSERT INTO transactions (user_id, ride_id, amount, type, category, description) VALUES ('admin_01', ${rid}, ${commission}, 'CREDIT', 'COMMISSION', ${`Platform Fee: ${rid}`})`;
        }
      }
      const final = await sql`SELECT * FROM rides WHERE id = ${rid}`;
      return mapRide(final[0]);
    }
  },

  transactions: {
    getForUser: async (uid: string) => {
      if (isMock) return mockDb.transactions.filter(t => t.user_id === uid).reverse();
      const sql = getSql();
      return await sql`SELECT * FROM transactions WHERE user_id = ${uid} ORDER BY created_at DESC`;
    }
  },

  settings: {
    get: async () => {
      if (isMock) return mockDb.settings;
      const sql = getSql();
      const res = await sql`SELECT value FROM settings WHERE key = 'global_config'`;
      return res[0]?.value || mockDb.settings;
    },
    update: async (v: any) => {
      if (isMock) { mockDb.settings = v; saveMock(); return v; }
      const sql = getSql();
      await sql`INSERT INTO settings (key, value) VALUES ('global_config', ${JSON.stringify(v)}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
      return v;
    }
  }
};

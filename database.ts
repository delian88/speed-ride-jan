
import { neon } from '@neondatabase/serverless';
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Production-Grade Hybrid Data Engine
 * Infrastructure: PostgreSQL (Neon) with persistent LocalStorage Fallback
 */

// User provided production string
const PRODUCTION_DB_URL = 'postgresql://neondb_owner:npg_JNlD0ieCuW1z@ep-crimson-frog-aimk0mkg-pooler.c-4.us-east-1.aws.neon.tech/speedride?sslmode=require&channel_binding=require';

let sqlInstance: any = null;
let isMock = false;
let connectionError: string | null = null;

// --- Mock Engine (LocalStorage) ---
const mockDb = {
  users: [] as any[],
  rides: [] as any[],
  settings: { baseFare: 1200, pricePerKm: 450, commission: 15, maintenanceMode: false }
};

const loadMock = () => {
  const saved = localStorage.getItem('speedride_local_db');
  if (saved) {
    const data = JSON.parse(saved);
    mockDb.users = data.users || [];
    mockDb.rides = data.rides || [];
    mockDb.settings = data.settings || mockDb.settings;
  } else {
    // Initial Seed for Mock
    mockDb.users = [
      { id: 'admin_01', name: 'System Admin', email: 'admin', phone: '08000000000', password: 'admin123', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?u=admin', is_verified: true, balance: 0, rating: 5.0 },
      { id: 'd1', name: 'Sarah Miller', email: 'driver@speedride.com', phone: '+234 812 345 6789', password: 'password', role: 'DRIVER', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9, balance: 124050.50, vehicle_type: 'PREMIUM', vehicle_model: 'Tesla Model 3', plate_number: 'SR-777', is_online: true, is_verified: true }
    ];
    saveMock();
  }
};

const saveMock = () => {
  localStorage.setItem('speedride_local_db', JSON.stringify(mockDb));
};

// --- Postgres Logic ---
const getSql = () => {
  // Use environment variable if present, otherwise fallback to the provided production string
  const url = process.env.DATABASE_URL || PRODUCTION_DB_URL;
  
  if (!url) {
    if (!isMock) {
      isMock = true;
      loadMock();
    }
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
  return {
    ...u,
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
    error: connectionError
  }),
  
  init: async () => {
    const sql = getSql();
    if (!sql) return;
    
    try {
      // Create tables following the production schema.sql structure
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
      
      await sql`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value JSONB)`;
      
      const count = await sql`SELECT count(*) FROM users`;
      if (parseInt(count[0].count) === 0) {
        // Seed default admin if table is empty
        await sql`INSERT INTO users (id, name, email, phone, password, role, is_verified) VALUES ('admin_01', 'Admin', 'admin', '080', 'admin123', 'ADMIN', true)`;
        await sql`INSERT INTO settings (key, value) VALUES ('global_config', '{"baseFare": 1200, "pricePerKm": 450, "commission": 15}'::jsonb)`;
      }
      isMock = false;
      console.log("SPEEDRIDE: Cloud Neural Core Online.");
    } catch (e: any) {
      console.error("Postgres initialization failed. Reverting to Sandbox.", e);
      connectionError = e.message;
      isMock = true;
      loadMock();
    }
  },

  auth: {
    login: async (email: string, password: string) => {
      if (isMock) {
        const u = mockDb.users.find(x => x.email.toLowerCase() === email.toLowerCase());
        if (!u) throw new Error("Account not found.");
        if (u.password !== password) throw new Error("Invalid password.");
        return { ...mapUser(u), token: 'mock_token_' + Math.random() };
      }
      const sql = getSql();
      const res = await sql`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`;
      if (!res[0]) throw new Error("Account not found.");
      if (res[0].password !== password) throw new Error("Invalid password.");
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
      const current = await db.users.getById(id);
      const next = { ...current, ...updates };
      await sql`
        UPDATE users SET 
          name=${next.name}, 
          phone=${next.phone}, 
          is_online=${next.isOnline || false}, 
          is_verified=${next.isVerified || false}, 
          balance=${next.balance},
          rating=${next.rating}
        WHERE id=${id}`;
      return next as any;
    },
    updatePassword: async (email: string, password: string) => {
      if (isMock) {
        const u = mockDb.users.find(x => x.email.toLowerCase() === email.toLowerCase());
        if (!u) return false;
        u.password = password;
        saveMock();
        return true;
      }
      const sql = getSql();
      await sql`UPDATE users SET password = ${password} WHERE LOWER(email) = LOWER(${email})`;
      return true;
    },
    create: async (data: any) => {
      const id = 'u_' + Math.random().toString(36).substr(2, 9);
      const newUser = { 
        ...data, 
        id, 
        balance: data.role === 'RIDER' ? 5000 : 0, 
        rating: 5.0,
        is_online: data.isOnline || false,
        is_verified: data.isVerified || false
      };
      if (isMock) {
        mockDb.users.push({
          ...newUser,
          is_online: newUser.isOnline,
          is_verified: newUser.isVerified
        });
        saveMock();
        return { ...mapUser(newUser), token: 'mock_t' };
      }
      const sql = getSql();
      await sql`
        INSERT INTO users (
          id, name, email, phone, password, role, avatar, balance, 
          vehicle_type, vehicle_model, plate_number, is_online, is_verified, license_doc, nin_doc
        ) VALUES (
          ${id}, ${data.name}, ${data.email}, ${data.phone}, ${data.password}, ${data.role}, 
          ${data.avatar}, ${newUser.balance}, ${data.vehicleType || null}, ${data.vehicleModel || null}, 
          ${data.plateNumber || null}, ${newUser.is_online}, ${newUser.is_verified}, 
          ${data.licenseDoc || null}, ${data.ninDoc || null}
        )`;
      return { ...mapUser(newUser), token: 'pg_t' };
    }
  },

  rides: {
    create: async (ride: any) => {
      const id = 'r_' + Math.random().toString(36).substr(2, 9);
      const newRide = { 
        ...ride, 
        id, 
        status: RideStatus.REQUESTED, 
        created_at: new Date().toISOString(),
        rider_id: ride.riderId,
        vehicle_type: ride.vehicleType
      };
      if (isMock) {
        mockDb.rides.push(newRide);
        const rider = mockDb.users.find(u => u.id === ride.riderId);
        if (rider) rider.balance -= ride.fare;
        saveMock();
        return mapRide(newRide);
      }
      const sql = getSql();
      await sql`INSERT INTO rides (id, rider_id, pickup, dropoff, fare, distance, status, vehicle_type) VALUES (${id}, ${ride.riderId}, ${ride.pickup}, ${ride.dropoff}, ${ride.fare}, ${ride.distance}, ${newRide.status}, ${ride.vehicleType})`;
      await sql`UPDATE users SET balance = balance - ${ride.fare} WHERE id = ${ride.riderId}`;
      return mapRide(newRide);
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
      if (isMock) {
        const ride = mockDb.rides.find(r => r.id === rid);
        if (ride) {
          ride.status = status;
          if (did) ride.driver_id = did;
          if (status === RideStatus.COMPLETED && ride.driver_id) {
            const driver = mockDb.users.find(u => u.id === ride.driver_id);
            if (driver) driver.balance += (ride.fare * 0.8);
          }
          saveMock();
        }
        return mapRide(ride);
      }
      const sql = getSql();
      if (did) await sql`UPDATE rides SET status=${status}, driver_id=${did} WHERE id=${rid}`;
      else await sql`UPDATE rides SET status=${status} WHERE id=${rid}`;
      
      if (status === RideStatus.COMPLETED) {
        const rideRes = await sql`SELECT * FROM rides WHERE id = ${rid}`;
        const r = rideRes[0];
        if (r && r.driver_id) await sql`UPDATE users SET balance = balance + ${parseFloat(r.fare) * 0.8} WHERE id = ${r.driver_id}`;
      }
      const final = await sql`SELECT * FROM rides WHERE id = ${rid}`;
      return mapRide(final[0]);
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
      await sql`UPDATE settings SET value = ${JSON.stringify(v)}::jsonb WHERE key = 'global_config'`;
      return v;
    }
  }
};

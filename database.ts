
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Neural Data Engine
 * Persistent PostgreSQL Simulation - Version 4 (Verified)
 */

const DB_KEY = 'speedride_db_v4_prod';

interface SpeedRideDB {
  users: (User | Driver)[];
  rides: RideRequest[];
  settings: {
    baseFare: number;
    pricePerKm: number;
    commission: number;
    maintenanceMode: boolean;
  };
}

const INITIAL_DATA: SpeedRideDB = {
  users: [
    {
      id: 'admin_01',
      name: 'System Admin',
      email: 'admin',
      phone: '08000000000',
      role: 'ADMIN',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      rating: 5.0,
      balance: 0,
      isVerified: true,
      password: 'admin123'
    } as any,
    {
      id: 'admin_khalid',
      name: 'Khalid Admin',
      email: 'khalid@gmail.com',
      phone: '08123456789',
      role: 'ADMIN',
      avatar: 'https://i.pravatar.cc/150?u=khalid',
      rating: 5.0,
      balance: 0,
      isVerified: true,
      password: 'khalid123'
    } as any,
    {
      id: 'd1',
      name: 'Sarah Miller',
      email: 'driver@speedride.com',
      phone: '+234 812 345 6789',
      role: 'DRIVER',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      rating: 4.9,
      balance: 124050.50,
      vehicleType: VehicleType.PREMIUM,
      vehicleModel: 'Tesla Model 3',
      plateNumber: 'SR-777',
      isOnline: true,
      isVerified: true,
      password: 'password'
    } as any,
  ],
  rides: [],
  settings: {
    baseFare: 1200,
    pricePerKm: 450,
    commission: 15,
    maintenanceMode: false,
  }
};

const getDB = (): SpeedRideDB => {
  const data = localStorage.getItem(DB_KEY);
  let db: SpeedRideDB;
  
  if (!data) {
    db = INITIAL_DATA;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } else {
    db = JSON.parse(data);
  }
  
  // Strict seeding: Ensure both admins are always present with correct roles/passwords
  const syncAdmin = (email: string, defaults: any) => {
    const idx = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      db.users.push(defaults);
    } else {
      (db.users[idx] as any).password = defaults.password;
      db.users[idx].role = 'ADMIN';
    }
  };

  syncAdmin('admin', INITIAL_DATA.users[0]);
  syncAdmin('khalid@gmail.com', INITIAL_DATA.users[1]);

  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};

const saveDB = (db: SpeedRideDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  auth: {
    login: async (email: string, password: string, role: string) => {
      await delay(800);
      const currentDb = getDB();
      
      const user = currentDb.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.role === role
      );

      if (!user) {
        // Helpful debugging for users who forget to switch role tabs
        const anyUser = currentDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (anyUser) {
          throw new Error(`Account found, but it is registered as ${anyUser.role}. Please select the correct role tab.`);
        }
        throw new Error(`Account not found in the ${role} database.`);
      }

      if ((user as any).password !== password) {
        throw new Error("Invalid secret key. Access denied.");
      }
      
      return { ...user, token: `sr_jwt_${Math.random().toString(36).substr(2)}` };
    }
  },

  settings: {
    get: async () => {
      await delay(200);
      return getDB().settings;
    },
    update: async (updates: any) => {
      await delay(400);
      const currentDb = getDB();
      currentDb.settings = { ...currentDb.settings, ...updates };
      saveDB(currentDb);
      return currentDb.settings;
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      await delay(300);
      return getDB().users;
    },
    getById: async (id: string): Promise<User | Driver> => {
      await delay(200);
      const user = getDB().users.find(u => u.id === id);
      if (!user) throw new Error("User disconnected");
      return user;
    },
    getByEmail: async (email: string): Promise<User | undefined> => {
      await delay(200);
      return getDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    updatePassword: async (email: string, password: string): Promise<boolean> => {
      await delay(500);
      const currentDb = getDB();
      const userIndex = currentDb.users.findIndex(u => u.email === email);
      if (userIndex === -1) return false;
      (currentDb.users[userIndex] as any).password = password;
      saveDB(currentDb);
      return true;
    },
    create: async (userData: any): Promise<User | Driver> => {
      await delay(800);
      const currentDb = getDB();
      const newUser = {
        ...userData,
        id: `u_${Math.random().toString(36).substr(2, 9)}`,
        rating: 5.0,
        balance: userData.role === 'RIDER' ? 5000 : 0,
        token: `sr_jwt_${Math.random().toString(36).substr(2)}`
      };
      currentDb.users.push(newUser);
      saveDB(currentDb);
      return newUser;
    },
    update: async (id: string, updates: Partial<User | Driver>): Promise<User | Driver> => {
      await delay(300);
      const currentDb = getDB();
      const index = currentDb.users.findIndex(u => u.id === id);
      if (index === -1) throw new Error("User not found");
      currentDb.users[index] = { ...currentDb.users[index], ...updates };
      saveDB(currentDb);
      return currentDb.users[index];
    }
  },

  rides: {
    create: async (ride: Partial<RideRequest>): Promise<RideRequest> => {
      await delay(1000);
      const currentDb = getDB();
      const newRide: RideRequest = {
        id: `r_${Math.random().toString(36).substr(2, 9)}`,
        status: RideStatus.REQUESTED,
        createdAt: new Date().toISOString(),
        ...ride
      } as RideRequest;
      currentDb.rides.push(newRide);
      saveDB(currentDb);
      return newRide;
    },
    getAll: async (): Promise<RideRequest[]> => {
      await delay(300);
      return getDB().rides;
    },
    getByUser: async (userId: string): Promise<RideRequest[]> => {
      await delay(300);
      return getDB().rides.filter(r => r.riderId === userId || r.driverId === userId);
    },
    updateStatus: async (rideId: string, status: RideStatus, driverId?: string): Promise<void> => {
      await delay(400);
      const currentDb = getDB();
      const index = currentDb.rides.findIndex(r => r.id === rideId);
      if (index !== -1) {
        currentDb.rides[index].status = status;
        if (driverId) currentDb.rides[index].driverId = driverId;
        if (status === RideStatus.COMPLETED) {
          const ride = currentDb.rides[index];
          const riderIndex = currentDb.users.findIndex(u => u.id === ride.riderId);
          const driverIndex = currentDb.users.findIndex(u => u.id === ride.driverId);
          if (riderIndex !== -1) currentDb.users[riderIndex].balance -= ride.fare;
          if (driverIndex !== -1) currentDb.users[driverIndex].balance += (ride.fare * 0.8);
        }
        saveDB(currentDb);
      }
    },
    getAvailableForDriver: async (vehicleType: VehicleType): Promise<RideRequest[]> => {
      await delay(400);
      return getDB().rides.filter(r => r.status === RideStatus.REQUESTED && r.vehicleType === vehicleType);
    }
  }
};

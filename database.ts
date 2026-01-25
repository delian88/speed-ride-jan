
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Neural Data Engine
 * This module simulates a production PostgreSQL environment using the schema.sql as a blueprint.
 * It provides a persistent, role-aware data layer that behaves like a real API.
 */

const DB_KEY = 'speedride_db_v2';

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
      name: 'SpeedAdmin',
      email: 'admin',
      phone: '08000000000',
      role: 'ADMIN',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      rating: 5.0,
      balance: 0,
      isVerified: true,
      // We store the password in a real-world password_hash field conceptually, 
      // but for this simulator, we'll keep it as a hidden property.
      password: 'admin123'
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
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

const saveDB = (db: SpeedRideDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Simulate API Latency
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  auth: {
    login: async (email: string, password: string, role: string) => {
      await delay();
      const currentDb = getDB();
      const user = currentDb.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        (u as any).password === password && 
        u.role === role
      );

      if (!user) throw new Error("Invalid credentials or role mismatch.");
      
      // Return user with a mock JWT token
      return { ...user, token: `sr_jwt_${Math.random().toString(36).substr(2)}` };
    }
  },

  settings: {
    get: async () => {
      await delay(400);
      return getDB().settings;
    },
    update: async (updates: any) => {
      await delay(600);
      const currentDb = getDB();
      currentDb.settings = { ...currentDb.settings, ...updates };
      saveDB(currentDb);
      return currentDb.settings;
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      await delay(500);
      return getDB().users;
    },
    getById: async (id: string): Promise<User | Driver> => {
      await delay(300);
      const user = getDB().users.find(u => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    },
    getByEmail: async (email: string): Promise<User | undefined> => {
      await delay(300);
      return getDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    updatePassword: async (email: string, password: string): Promise<boolean> => {
      await delay(800);
      const currentDb = getDB();
      const userIndex = currentDb.users.findIndex(u => u.email === email);
      if (userIndex === -1) return false;
      (currentDb.users[userIndex] as any).password = password;
      saveDB(currentDb);
      return true;
    },
    create: async (userData: any): Promise<User | Driver> => {
      await delay(1200);
      const currentDb = getDB();
      const newUser = {
        ...userData,
        id: `u_${Math.random().toString(36).substr(2, 9)}`,
        rating: 5.0,
        balance: userData.role === 'RIDER' ? 5000 : 0, // Starting bonus
        token: `sr_jwt_${Math.random().toString(36).substr(2)}`
      };
      currentDb.users.push(newUser);
      saveDB(currentDb);
      return newUser;
    },
    update: async (id: string, updates: Partial<User | Driver>): Promise<User | Driver> => {
      await delay(400);
      const currentDb = getDB();
      const index = currentDb.users.findIndex(u => u.id === id);
      if (index === -1) throw new Error("User node not found");
      currentDb.users[index] = { ...currentDb.users[index], ...updates };
      saveDB(currentDb);
      return currentDb.users[index];
    }
  },

  rides: {
    create: async (ride: Partial<RideRequest>): Promise<RideRequest> => {
      await delay(1500);
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
      await delay(400);
      return getDB().rides;
    },
    getByUser: async (userId: string): Promise<RideRequest[]> => {
      await delay(400);
      return getDB().rides.filter(r => r.riderId === userId || r.driverId === userId);
    },
    updateStatus: async (rideId: string, status: RideStatus, driverId?: string): Promise<void> => {
      await delay(600);
      const currentDb = getDB();
      const index = currentDb.rides.findIndex(r => r.id === rideId);
      if (index !== -1) {
        currentDb.rides[index].status = status;
        if (driverId) currentDb.rides[index].driverId = driverId;
        
        // Handle financial logic on completion
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
      await delay(500);
      return getDB().rides.filter(r => r.status === RideStatus.REQUESTED && r.vehicleType === vehicleType);
    }
  }
};

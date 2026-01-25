
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Neural Data Engine
 * Persistent PostgreSQL Simulation
 */

const DB_KEY = 'speedride_db_final_v1';

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
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  const parsed = JSON.parse(data);
  
  // Safety check: ensure both admins exist in current storage
  const hasDefaultAdmin = parsed.users.some((u: any) => u.email === 'admin' && u.role === 'ADMIN');
  if (!hasDefaultAdmin) {
    parsed.users.push(INITIAL_DATA.users[0]);
  }

  const hasKhalidAdmin = parsed.users.some((u: any) => u.email === 'khalid@gmail.com' && u.role === 'ADMIN');
  if (!hasKhalidAdmin) {
    parsed.users.push(INITIAL_DATA.users[1]);
  }

  if (!hasDefaultAdmin || !hasKhalidAdmin) {
    localStorage.setItem(DB_KEY, JSON.stringify(parsed));
  }
  
  return parsed;
};

const saveDB = (db: SpeedRideDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  auth: {
    login: async (email: string, password: string, role: string) => {
      await delay(1000); // Realistic network lag
      const currentDb = getDB();
      
      const user = currentDb.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.role === role
      );

      if (!user) {
        throw new Error(`Account not found for ${role} role.`);
      }

      if ((user as any).password !== password) {
        throw new Error("Invalid secret key. Access denied.");
      }
      
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
      if (!user) throw new Error("User node disconnected");
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
        balance: userData.role === 'RIDER' ? 5000 : 0,
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

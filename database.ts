
import { User, Driver, RideRequest, RideStatus, VehicleType, UserRole } from './types';

// This class simulates a real database interaction with persistence in LocalStorage
class MockDatabase {
  private prefix = 'speedride_db_';

  private get(table: string): any[] {
    try {
      const data = localStorage.getItem(this.prefix + table);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(`Database read error for ${table}:`, e);
      return [];
    }
  }

  private set(table: string, data: any[] | any): void {
    try {
      localStorage.setItem(this.prefix + table, JSON.stringify(data));
    } catch (e) {
      console.error(`Database write error for ${table}:`, e);
    }
  }

  // Settings
  settings = {
    get: async (): Promise<{ pricePerKm: number }> => {
      await this.delay(100);
      try {
        const data = localStorage.getItem(this.prefix + 'settings');
        return data ? JSON.parse(data) : { pricePerKm: 350 };
      } catch {
        return { pricePerKm: 350 };
      }
    },
    update: async (updates: { pricePerKm: number }): Promise<void> => {
      await this.delay(200);
      this.set('settings', updates);
    }
  };

  // Users Table
  users = {
    getAll: async (): Promise<User[]> => {
      await this.delay();
      return this.get('users');
    },
    getById: async (id: string): Promise<User | undefined> => {
      await this.delay();
      return this.get('users').find(u => u.id === id);
    },
    getByEmail: async (email: string): Promise<User | undefined> => {
      await this.delay();
      return this.get('users').find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    create: async (userData: Partial<User | Driver>): Promise<User | Driver> => {
      await this.delay();
      const users = this.get('users');
      const newUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        rating: 5.0,
        balance: 2500, // Starting bonus
        ...userData
      } as any;
      users.push(newUser);
      this.set('users', users);
      return newUser;
    },
    update: async (id: string, updates: Partial<User | Driver>): Promise<User | Driver> => {
      await this.delay();
      const users = this.get('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) throw new Error("User not found");
      users[idx] = { ...users[idx], ...updates };
      this.set('users', users);
      return users[idx];
    },
    updatePassword: async (email: string, newPassword: string): Promise<boolean> => {
      await this.delay();
      const users = this.get('users');
      const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx === -1) return false;
      users[idx].password = newPassword; 
      this.set('users', users);
      return true;
    }
  };

  // Rides Table
  rides = {
    create: async (ride: Partial<RideRequest>): Promise<RideRequest> => {
      await this.delay();
      const rides = this.get('rides');
      const newRide = {
        id: 'r_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        status: RideStatus.REQUESTED,
        ...ride
      } as RideRequest;
      rides.push(newRide);
      this.set('rides', rides);
      return newRide;
    },
    getAll: async (): Promise<RideRequest[]> => {
      await this.delay();
      return this.get('rides');
    },
    getByUser: async (userId: string): Promise<RideRequest[]> => {
      await this.delay();
      return this.get('rides').filter((r: RideRequest) => r.riderId === userId || r.driverId === userId);
    },
    updateStatus: async (rideId: string, status: RideStatus): Promise<void> => {
      await this.delay();
      const rides = this.get('rides');
      const idx = rides.findIndex((r: RideRequest) => r.id === rideId);
      if (idx !== -1) {
        rides[idx].status = status;
        this.set('rides', rides);
      }
    }
  };

  private delay(ms: number = 200) {
    return new Promise(res => setTimeout(res, ms));
  }

  init() {
    const users = this.get('users');
    if (users.length === 0) {
      const seedUsers = [
        {
          id: 'u1',
          name: 'Demo Rider',
          email: 'rider@speedride.com',
          password: 'password123',
          phone: '+234 801 234 5678',
          role: 'RIDER',
          avatar: 'https://i.pravatar.cc/150?u=rider',
          rating: 4.8,
          balance: 25000
        },
        {
          id: 'd1',
          name: 'Adebayo Tunde',
          email: 'driver@speedride.com',
          password: 'password123',
          phone: '+234 802 345 6789',
          role: 'DRIVER',
          avatar: 'https://i.pravatar.cc/150?u=driver',
          rating: 4.9,
          balance: 150000,
          vehicleType: VehicleType.PREMIUM,
          vehicleModel: 'Tesla Model 3 (2026)',
          plateNumber: 'LAG-777-2026',
          isOnline: true,
          isVerified: true
        },
        {
          id: 'a1',
          name: 'Super Admin',
          email: 'admin@speedride.com',
          password: 'password123',
          phone: '+234 803 000 0000',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?u=admin',
          rating: 5.0,
          balance: 0
        }
      ];
      this.set('users', seedUsers);
    }
    
    if (!localStorage.getItem(this.prefix + 'settings')) {
      this.set('settings', { pricePerKm: 350 });
    }
  }
}

export const db = new MockDatabase();
db.init();


import { User, Driver, RideRequest, RideStatus, VehicleType, UserRole } from './types';

// This class simulates a real database interaction with persistence in LocalStorage
class MockDatabase {
  private prefix = 'speedride_db_';

  private get(table: string): any[] {
    const data = localStorage.getItem(this.prefix + table);
    return data ? JSON.parse(data) : [];
  }

  private set(table: string, data: any[]): void {
    localStorage.setItem(this.prefix + table, JSON.stringify(data));
  }

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
    create: async (userData: Partial<User | Driver>): Promise<User | Driver> => {
      await this.delay();
      const users = this.get('users');
      const newUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        rating: 5.0,
        balance: 0,
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

  private delay(ms: number = 800) {
    return new Promise(res => setTimeout(res, ms));
  }

  // Initialize with seed data if empty
  init() {
    if (this.get('users').length === 0) {
      const seedUsers = [
        {
          id: 'u1',
          name: 'Demo Rider',
          email: 'rider@speedride.com',
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
          phone: '+234 802 345 6789',
          role: 'DRIVER',
          avatar: 'https://i.pravatar.cc/150?u=driver',
          rating: 4.9,
          balance: 150000,
          vehicleType: VehicleType.PREMIUM,
          vehicleModel: 'Lexus ES 350',
          plateNumber: 'LAG-777-SR',
          isOnline: true,
          isVerified: true
        },
        {
          id: 'a1',
          name: 'Super Admin',
          email: 'admin@speedride.com',
          phone: '+234 803 000 0000',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?u=admin',
          rating: 5.0,
          balance: 0
        }
      ];
      this.set('users', seedUsers);
    }
  }
}

export const db = new MockDatabase();
db.init();

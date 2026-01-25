
import { User, Driver, RideRequest, RideStatus, VehicleType, UserRole } from './types';

class MockDatabase {
  private prefix = 'speedride_db_v2_';

  private get(table: string): any[] {
    try {
      const data = localStorage.getItem(this.prefix + table);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  private set(table: string, data: any[] | any): void {
    localStorage.setItem(this.prefix + table, JSON.stringify(data));
  }

  settings = {
    get: async () => {
      const data = localStorage.getItem(this.prefix + 'settings');
      return data ? JSON.parse(data) : { 
        pricePerKm: 450, 
        baseFare: 1200, 
        commission: 20, 
        maintenanceMode: false
      };
    },
    update: async (updates: any) => {
      const current = await this.settings.get();
      this.set('settings', { ...current, ...updates });
    }
  };

  users = {
    getAll: async (): Promise<User[]> => {
      return this.get('users');
    },
    getById: async (id: string): Promise<User | undefined> => {
      return this.get('users').find(u => u.id === id);
    },
    getByEmail: async (email: string): Promise<User | undefined> => {
      const searchEmail = email.trim().toLowerCase();
      return this.get('users').find(u => u.email.toLowerCase() === searchEmail);
    },
    // Fix: Adding missing updatePassword method for auth recovery flow
    updatePassword: async (email: string, password: string): Promise<boolean> => {
      const users = this.get('users');
      const searchEmail = email.trim().toLowerCase();
      const idx = users.findIndex(u => u.email.toLowerCase() === searchEmail);
      if (idx === -1) return false;
      users[idx].password = password;
      this.set('users', users);
      return true;
    },
    create: async (userData: Partial<User | Driver>): Promise<User | Driver> => {
      const users = this.get('users');
      const newUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        rating: 5.0,
        balance: 5000, 
        createdAt: new Date().toISOString(),
        ...userData
      } as any;
      users.push(newUser);
      this.set('users', users);
      return newUser;
    },
    update: async (id: string, updates: Partial<User | Driver>): Promise<User | Driver> => {
      const users = this.get('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) throw new Error("User not found");
      users[idx] = { ...users[idx], ...updates };
      this.set('users', users);
      return users[idx];
    },
    getOnlineDrivers: async (type?: VehicleType): Promise<Driver[]> => {
      const users = this.get('users');
      return users.filter(u => u.role === 'DRIVER' && u.isOnline && (!type || u.vehicleType === type));
    }
  };

  rides = {
    create: async (ride: Partial<RideRequest>): Promise<RideRequest> => {
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
      return this.get('rides');
    },
    getByUser: async (userId: string): Promise<RideRequest[]> => {
      return this.get('rides').filter((r: RideRequest) => r.riderId === userId || r.driverId === userId);
    },
    getAvailableForDriver: async (vehicleType: VehicleType): Promise<RideRequest[]> => {
      return this.get('rides').filter((r: RideRequest) => r.status === RideStatus.REQUESTED && r.vehicleType === vehicleType);
    },
    updateStatus: async (rideId: string, status: RideStatus, driverId?: string): Promise<void> => {
      const rides = this.get('rides');
      const idx = rides.findIndex((r: RideRequest) => r.id === rideId);
      if (idx !== -1) {
        rides[idx].status = status;
        if (driverId) rides[idx].driverId = driverId;
        this.set('rides', rides);

        // Transaction logic if completed
        if (status === RideStatus.COMPLETED) {
          const ride = rides[idx];
          const users = this.get('users');
          const dIdx = users.findIndex(u => u.id === ride.driverId);
          const rIdx = users.findIndex(u => u.id === ride.riderId);
          if (dIdx !== -1) users[dIdx].balance += (ride.fare * 0.8); // 80% to driver
          if (rIdx !== -1) users[rIdx].balance -= ride.fare;
          this.set('users', users);
        }
      }
    }
  };

  private delay(ms: number = 200) {
    return new Promise(res => setTimeout(res, ms));
  }

  init() {
    let users = this.get('users');
    if (users.length === 0) {
      const masterAdmins = [
        {
          id: 'admin_1',
          name: 'Super Admin',
          email: 'admin',
          password: 'admin123',
          phone: '+234 803 000 0000',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?u=admin',
          balance: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'admin_2',
          name: 'Khalid',
          email: 'khalid@gmail.com',
          password: 'khalid123',
          phone: '+234 810 555 1234',
          role: 'ADMIN',
          avatar: 'https://i.pravatar.cc/150?u=khalid',
          balance: 0,
          createdAt: new Date().toISOString()
        }
      ];
      this.set('users', masterAdmins);
    }
  }
}

export const db = new MockDatabase();
db.init();


import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

// Initial Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@speedride.com',
  phone: '+1 234 567 890',
  role: 'RIDER',
  avatar: 'https://picsum.photos/seed/alex/200',
  rating: 4.8,
  balance: 15500.25
};

const MOCK_DRIVER: Driver = {
  id: 'd1',
  name: 'Sarah Miller',
  email: 'driver@speedride.com',
  phone: '+1 987 654 321',
  role: 'DRIVER',
  avatar: 'https://picsum.photos/seed/sarah/200',
  rating: 4.9,
  balance: 124050.50,
  vehicleType: VehicleType.LUXURY,
  vehicleModel: 'Tesla Model 3',
  plateNumber: 'SR-777',
  isOnline: true,
  isVerified: true
};

const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Super Admin',
  email: 'admin',
  phone: '+1 111 222 333',
  role: 'ADMIN',
  avatar: 'https://picsum.photos/seed/admin/200',
  rating: 5.0,
  balance: 0
};

export const getInitialState = () => {
  const saved = localStorage.getItem('speedride_state');
  if (saved) return JSON.parse(saved);
  
  return {
    currentUser: null as User | Driver | null,
    rides: [] as RideRequest[],
    allDrivers: [MOCK_DRIVER],
    allUsers: [MOCK_USER, MOCK_DRIVER, MOCK_ADMIN],
    isAuthenticated: false
  };
};

export const saveState = (state: any) => {
  localStorage.setItem('speedride_state', JSON.stringify(state));
};

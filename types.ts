
export type UserRole = 'RIDER' | 'DRIVER' | 'ADMIN';

export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum VehicleType {
  ECONOMY = 'ECONOMY',
  PREMIUM = 'PREMIUM',
  XL = 'XL',
  BIKE = 'BIKE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  rating: number;
  balance: number;
}

export interface Driver extends User {
  vehicleType: VehicleType;
  vehicleModel: string;
  plateNumber: string;
  isOnline: boolean;
  isVerified: boolean;
  licenseDoc?: string; // Base64 representation
  ninDoc?: string;     // Base64 representation
}

export interface RideRequest {
  id: string;
  riderId: string;
  driverId?: string;
  pickup: string;
  dropoff: string;
  distance: number; // in km
  fare: number;
  status: RideStatus;
  vehicleType: VehicleType;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

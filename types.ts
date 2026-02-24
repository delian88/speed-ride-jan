
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
  BUS = 'BUS',
  TRUCK = 'TRUCK',
  ECONOMY = 'ECONOMY',
  COMFORT = 'COMFORT',
  LUXURY = 'LUXURY',
  TRICYCLE = 'TRICYCLE'
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
  // Added to align with database columns and support updates
  isOnline?: boolean;
  isVerified?: boolean;
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

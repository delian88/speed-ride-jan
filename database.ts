
import { User, Driver, RideRequest, RideStatus, VehicleType } from './types';

/**
 * SPEEDRIDE 2026 | Production Database Connector
 * This module connects the frontend to the SpeedRide Neural API.
 * It assumes a backend implementing the PostgreSQL schema provided in schema.sql.
 */

const API_BASE = '/api';

const getHeaders = () => {
  const session = localStorage.getItem('speedride_session');
  const token = session ? JSON.parse(session).token : '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network Protocol Error' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const db = {
  settings: {
    get: async () => {
      return fetch(`${API_BASE}/settings`, { headers: getHeaders() }).then(handleResponse);
    },
    update: async (updates: any) => {
      return fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      }).then(handleResponse);
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      return fetch(`${API_BASE}/users`, { headers: getHeaders() }).then(handleResponse);
    },
    getById: async (id: string): Promise<User> => {
      return fetch(`${API_BASE}/users/${id}`, { headers: getHeaders() }).then(handleResponse);
    },
    getByEmail: async (email: string): Promise<User | undefined> => {
      // In a real API, we search by query parameter
      const users = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`, { 
        headers: getHeaders() 
      }).then(handleResponse);
      return users[0];
    },
    updatePassword: async (email: string, password: string): Promise<boolean> => {
      return fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      }).then(res => res.ok);
    },
    create: async (userData: any): Promise<User | Driver> => {
      return fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(handleResponse);
    },
    update: async (id: string, updates: Partial<User | Driver>): Promise<User | Driver> => {
      return fetch(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      }).then(handleResponse);
    },
    getOnlineDrivers: async (type?: VehicleType): Promise<Driver[]> => {
      let url = `${API_BASE}/users?role=DRIVER&isOnline=true`;
      if (type) url += `&vehicleType=${type}`;
      return fetch(url, { headers: getHeaders() }).then(handleResponse);
    }
  },

  rides: {
    create: async (ride: Partial<RideRequest>): Promise<RideRequest> => {
      return fetch(`${API_BASE}/rides`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ride)
      }).then(handleResponse);
    },
    getAll: async (): Promise<RideRequest[]> => {
      return fetch(`${API_BASE}/rides`, { headers: getHeaders() }).then(handleResponse);
    },
    getByUser: async (userId: string): Promise<RideRequest[]> => {
      return fetch(`${API_BASE}/rides?userId=${userId}`, { headers: getHeaders() }).then(handleResponse);
    },
    getAvailableForDriver: async (vehicleType: VehicleType): Promise<RideRequest[]> => {
      return fetch(`${API_BASE}/rides?status=REQUESTED&vehicleType=${vehicleType}`, { 
        headers: getHeaders() 
      }).then(handleResponse);
    },
    updateStatus: async (rideId: string, status: RideStatus, driverId?: string): Promise<void> => {
      return fetch(`${API_BASE}/rides/${rideId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, driverId })
      }).then(handleResponse);
    }
  }
};

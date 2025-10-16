/**
 * Mock API Layer
 * All backend functionality has been removed. This provides client-side mocks.
 */

import usersData from './data/users.json';
import startupsData from './data/startups.json';

// Simulated delay for realistic UX
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Auth
export const mockAuth = {
  async signIn(email: string, password: string) {
    await delay();
    return { user: usersData[0], session: { access_token: 'mock-token' } };
  },
  async signUp(email: string, password: string) {
    await delay();
    return { user: usersData[0], session: { access_token: 'mock-token' } };
  },
  async signOut() {
    await delay();
    return { error: null };
  },
  async getSession() {
    return { data: { session: { access_token: 'mock-token', user: usersData[0] } }, error: null };
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // No-op subscription
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

// Mock Startups API
export const mockStartupsAPI = {
  async getAll() {
    await delay();
    return startupsData;
  },
  async getById(id: string) {
    await delay();
    return startupsData.find(s => s.id === id) || null;
  },
  async create(data: any) {
    await delay();
    const newStartup = { id: `s_${Date.now()}`, ...data };
    startupsData.push(newStartup);
    return newStartup;
  },
  async update(id: string, data: any) {
    await delay();
    const index = startupsData.findIndex(s => s.id === id);
    if (index >= 0) {
      startupsData[index] = { ...startupsData[index], ...data };
      return startupsData[index];
    }
    return null;
  },
  async delete(id: string) {
    await delay();
    const index = startupsData.findIndex(s => s.id === id);
    if (index >= 0) {
      startupsData.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Mock User API
export const mockUsersAPI = {
  async getCurrent() {
    await delay();
    return usersData[0];
  },
  async updateProfile(data: any) {
    await delay();
    return { ...usersData[0], ...data };
  }
};

// No-op analytics
export const mockAnalytics = {
  track: (event: string, properties?: any) => {
    console.info('[Mock Analytics]', event, properties);
  },
  identify: (userId: string, traits?: any) => {
    console.info('[Mock Analytics] Identify', userId, traits);
  },
  page: (name?: string, properties?: any) => {
    console.info('[Mock Analytics] Page', name, properties);
  }
};

// No-op telemetry
export const mockTelemetry = {
  captureException: (error: Error) => {
    console.error('[Mock Telemetry]', error);
  },
  captureMessage: (message: string) => {
    console.info('[Mock Telemetry]', message);
  }
};


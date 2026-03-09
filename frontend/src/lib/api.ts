import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Auth
export const login = (walletAddress: string, role: string, businessName?: string) =>
    api.post('/login', { walletAddress, role, businessName });

// Hunts
export const getHunts = () => api.get('/hunts');
export const getHunt = (id: string) => api.get(`/hunts/${id}`);
export const createHunt = (data: any) => api.post('/hunts', data);
export const fundHunt = (data: any) => api.post('/hunts/fund', data);
export const withdrawHunt = (huntId: string, txHash: string) => api.post(`/hunts/${huntId}/withdraw`, { txHash });

// QR Scan
export const scanQR = (huntId: string, qrSecret: string, walletAddress: string) =>
    api.post('/scan', { huntId, qrSecret, walletAddress });

// Participants
export const getParticipants = (huntId: string) => api.get(`/hunts/${huntId}/participants`);

// Tasks
export const completeTask = (huntId: string, walletAddress: string) =>
    api.post('/task-complete', { huntId, walletAddress });

// Rewards
export const claimMainReward = (huntId: string, walletAddress: string) =>
    api.post('/reward/main', { huntId, walletAddress });

// Profile
export const getProfile = (walletAddress: string) => api.get(`/profile/${walletAddress}`);

export default api;

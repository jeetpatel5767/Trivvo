import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HuntCardProps {
    hunt: {
        hunt_id: string;
        title: string;
        business_name: string;
        arrival_reward: number;
        main_reward: number;
        status: string;
        location_name?: string;
        description?: string;
    };
}

export function HuntCard({ hunt }: HuntCardProps) {
    const navigate = useNavigate();
    const totalReward = Number(hunt.arrival_reward) + Number(hunt.main_reward);

    return (
        <div className="card" onClick={() => navigate(`/hunt/${hunt.hunt_id}`)} style={{ cursor: 'pointer' }}>
            <div className="flex justify-between items-center mb-2">
                <span className={`badge ${hunt.status === 'active' ? 'badge-active' : hunt.status === 'pending' ? 'badge-pending' : 'badge-ended'}`}>
                    {hunt.status}
                </span>
                <span className="badge badge-reward">
                    {totalReward} USDC
                </span>
            </div>
            <h3 style={{ marginBottom: '4px' }}>{hunt.title}</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{hunt.business_name}</p>
            {hunt.location_name && (
                <div className="flex items-center gap-1" style={{ marginTop: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <small>{hunt.location_name}</small>
                </div>
            )}
            <div className="flex justify-between items-center" style={{ marginTop: '12px' }}>
                <div>
                    <small>Arrival: <span style={{ color: 'var(--primary-light)' }}>{hunt.arrival_reward} USDC</span></small>
                </div>
                <div>
                    <small>Main: <span style={{ color: 'var(--success)' }}>{hunt.main_reward} USDC</span></small>
                </div>
            </div>
        </div>
    );
}

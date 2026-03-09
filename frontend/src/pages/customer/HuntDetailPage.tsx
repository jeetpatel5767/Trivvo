import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHunt } from '../../lib/api';
import { BottomNav } from '../../components/BottomNav';

// Demo hunt used as fallback
const DEMO_HUNTS: Record<string, any> = {
    'demo-1': {
        hunt_id: 'demo-1', title: 'Coffee Quest at Brew Lab', business_name: 'Brew Lab Café',
        arrival_reward: 0.5, main_reward: 5, status: 'active', location_name: 'Downtown',
        location_lat: 40.7128, location_lng: -74.006,
        description: 'Visit Brew Lab and discover their secret menu! Find hidden items, complete challenges, and earn USDC rewards.',
        tasks: ['Find the hidden menu board', 'Order a special item', 'Take a photo with the barista'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
    'demo-2': {
        hunt_id: 'demo-2', title: 'Sneaker Hunt Challenge', business_name: 'Urban Kicks',
        arrival_reward: 1, main_reward: 10, status: 'active', location_name: 'Fashion District',
        location_lat: 40.7193, location_lng: -73.998,
        description: 'Find our limited edition sneaker display, answer 3 trivia questions about sneaker history, and win big USDC rewards!',
        tasks: ['Find the golden sneaker display', 'Answer 3 trivia questions', 'Share on social media'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
    'demo-3': {
        hunt_id: 'demo-3', title: 'Art Gallery Adventure', business_name: 'Modern Art Space',
        arrival_reward: 0.75, main_reward: 7.5, status: 'active', location_name: 'Arts Quarter',
        location_lat: 40.7306, location_lng: -73.9866,
        description: 'Explore contemporary art and earn rewards! Visit exhibits, take photos, and write reviews.',
        tasks: ['Visit 3 exhibits', 'Take photos', 'Write a short review'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
};

export default function HuntDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hunt, setHunt] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHunt() {
            try {
                const res = await getHunt(id!);
                setHunt(res.data.hunt);
            } catch {
                // Fallback to demo data
                setHunt(DEMO_HUNTS[id!] || DEMO_HUNTS['demo-1']);
            } finally {
                setLoading(false);
            }
        }
        fetchHunt();
    }, [id]);

    if (loading) {
        return (
            <div className="page" style={{ padding: '24px' }}>
                <div className="card skeleton" style={{ height: '200px', marginBottom: '16px' }} />
                <div className="card skeleton" style={{ height: '100px', marginBottom: '16px' }} />
                <div className="card skeleton" style={{ height: '150px' }} />
            </div>
        );
    }

    if (!hunt) {
        return (
            <div className="page" style={{ padding: '24px', textAlign: 'center' }}>
                <h2>Hunt not found</h2>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/hunts')}>Back to Hunts</button>
            </div>
        );
    }

    const totalReward = Number(hunt.arrival_reward) + Number(hunt.main_reward);

    return (
        <div className="page">
            {/* Header */}
            <div style={{ padding: '16px 0' }}>
                <button onClick={() => navigate('/hunts')} className="btn btn-secondary btn-sm mb-3">← Back</button>
                <div className="flex justify-between items-center">
                    <div>
                        <span className={`badge badge-${hunt.status}`} style={{ marginBottom: '8px', display: 'inline-block' }}>{hunt.status}</span>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{hunt.title}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{hunt.business_name}</p>
                    </div>
                </div>
            </div>

            {/* Reward Breakdown */}
            <div className="card-glass mb-3 animate-scale-in">
                <h3 className="mb-3" style={{ fontSize: '0.95rem' }}>💰 Reward Breakdown</h3>
                <div className="flex justify-between items-center gap-3" style={{
                    background: 'rgba(124, 58, 237, 0.1)', borderRadius: '12px', padding: '16px',
                }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>{hunt.arrival_reward}</div>
                        <small>Arrival USDC</small>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)' }} />
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{hunt.main_reward}</div>
                        <small>Main USDC</small>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)' }} />
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{totalReward}</div>
                        <small>Total USDC</small>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="card mb-3 animate-slide-up">
                <h3 className="mb-2">📝 Description</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{hunt.description}</p>
            </div>

            {/* Location */}
            <div className="card mb-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="mb-2">📍 Location</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{hunt.location_name || 'Location available after scan'}</p>
            </div>

            {/* Tasks - Locked until QR scan */}
            <div className="card mb-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3" style={{ padding: '8px 0' }}>
                    <div style={{ fontSize: '2rem' }}>🔒</div>
                    <div>
                        <h3 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Tasks Locked</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Scan the QR code at the location to unlock {
                                hunt.tasks ? (typeof hunt.tasks === 'string' ? JSON.parse(hunt.tasks) : hunt.tasks).length : 0
                            } tasks and start earning rewards
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {hunt.status === 'active' ? (
                <div className="flex flex-col gap-2 mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/scan', { state: { hunt } })}>
                        📱 Scan QR at Location
                    </button>
                    <button className="btn btn-secondary btn-full" onClick={() => navigate('/map')}>
                        🗺️ Navigate to Location
                    </button>
                </div>
            ) : (
                <div className="card mb-4 text-center animate-slide-up" style={{ animationDelay: '0.3s', padding: '24px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {hunt.status === 'upcoming'
                            ? '⏳ This hunt has not started yet. Check back soon!'
                            : '🛑 This hunt has expired and is no longer active.'}
                    </p>
                </div>
            )}

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}

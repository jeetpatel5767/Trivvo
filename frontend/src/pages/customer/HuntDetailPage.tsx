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
                setHunt(DEMO_HUNTS[id!] || DEMO_HUNTS['demo-1']);
            } finally {
                setLoading(false);
            }
        }
        fetchHunt();
    }, [id]);

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--nb-bg)', minHeight: '100vh', padding: '24px' }}>
                <div style={{ height: '200px', backgroundColor: '#E5E7EB', borderRadius: 'var(--nb-radius-lg)', border: 'var(--nb-border)', opacity: 0.5, marginBottom: '24px' }} />
                <div style={{ height: '100px', backgroundColor: '#E5E7EB', borderRadius: 'var(--nb-radius-lg)', border: 'var(--nb-border)', opacity: 0.5, marginBottom: '24px' }} />
                <div style={{ height: '150px', backgroundColor: '#E5E7EB', borderRadius: 'var(--nb-radius-lg)', border: 'var(--nb-border)', opacity: 0.5 }} />
            </div>
        );
    }

    if (!hunt) {
        return (
            <div style={{ backgroundColor: 'var(--nb-bg)', minHeight: '100vh', padding: '24px', textAlign: 'center', color: '#000' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px' }}>HUNT NOT FOUND</h1>
                <button
                    onClick={() => navigate('/hunts')}
                    style={{
                        backgroundColor: 'var(--nb-yellow)',
                        border: 'var(--nb-border)',
                        boxShadow: '4px 4px 0px #000',
                        borderRadius: 'var(--nb-radius)',
                        padding: '12px 24px',
                        fontSize: '18px',
                        fontWeight: 900,
                        cursor: 'pointer'
                    }}
                >
                    BACK TO HUNTS
                </button>
            </div>
        );
    }

    const totalReward = Number(hunt.arrival_reward) + Number(hunt.main_reward);

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            padding: '24px',
            paddingBottom: '100px',
            fontFamily: "'Inter', sans-serif",
            color: '#000000'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: '4px 4px 0px #000',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}
                >
                    ←
                </button>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    margin: 0,
                    letterSpacing: '-1px'
                }}>
                    HUNT DETAILS
                </h1>
                <div style={{ width: '48px' }} />
            </div>

            {/* Main Hunt Board */}
            <div style={{
                backgroundColor: '#FFFFFF',
                border: 'var(--nb-border)',
                boxShadow: '8px 8px 0px #000',
                borderRadius: 'var(--nb-radius-lg)',
                padding: '24px',
                marginBottom: '32px'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <span style={{
                        backgroundColor: hunt.status === 'active' ? 'var(--nb-mint)' : '#FCA5A5',
                        border: '2px solid #000',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        marginBottom: '12px'
                    }}>
                        {hunt.status}
                    </span>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1',
                        letterSpacing: '-1.5px'
                    }}>
                        {hunt.title}
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#6B7280',
                        marginTop: '8px',
                        textTransform: 'uppercase'
                    }}>
                        {hunt.business_name}
                    </p>
                </div>

                {/* Reward Section */}
                <div style={{
                    backgroundColor: 'var(--nb-pink)',
                    border: '3px solid #000',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Quest Rewards</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontSize: '24px', fontWeight: 900 }}>{totalReward}</span>
                            <span style={{ fontSize: '14px', fontWeight: 800, marginLeft: '4px' }}>USDC</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '10px', fontWeight: 700, margin: 0 }}>ARRIVAL: {hunt.arrival_reward} USDC</p>
                            <p style={{ fontSize: '10px', fontWeight: 700, margin: 0 }}>MAIN: {hunt.main_reward} USDC</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Description</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', fontWeight: 600, color: '#374151', margin: 0 }}>
                        {hunt.description}
                    </p>
                </div>

                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Location</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📍</span>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{hunt.location_name || 'Downtown Area'}</span>
                    </div>
                </div>
            </div>

            {/* Task Card (Locked/Unlocked) */}
            <div style={{
                backgroundColor: '#FFFFFF',
                border: 'var(--nb-border)',
                boxShadow: 'var(--nb-shadow)',
                borderRadius: 'var(--nb-radius-lg)',
                padding: '24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--nb-yellow)',
                    border: '3px solid #000',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '32px'
                }}>
                    🔒
                </div>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Tasks Locked</h3>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginTop: '4px', margin: 0 }}>
                        Scan QR at location to unlock tasks and start earning.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            {hunt.status === 'active' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/scan', { state: { hunt } })}
                        style={{
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '20px',
                            fontSize: '20px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <span>📷</span> SCAN QR TO START
                    </button>
                    <button
                        onClick={() => navigate('/map')}
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        🗺️ VIEW ON MAP
                    </button>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#FEE2E2',
                    border: 'var(--nb-border)',
                    borderRadius: 'var(--nb-radius-lg)',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '16px', fontWeight: 900, color: '#991B1B', margin: 0 }}>
                        {hunt.status === 'upcoming'
                            ? '⏳ HUNT NOT STARTED YET'
                            : '🛑 HUNT EXPIRED'}
                    </p>
                </div>
            )}

            <BottomNav />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHunts } from '../../lib/api';
import { HuntCard } from '../../components/HuntCard';
import { BottomNav } from '../../components/BottomNav';

// Demo data used as fallback when backend is unavailable
const DEMO_HUNTS = [
    {
        hunt_id: 'demo-1', title: 'Coffee Quest at Brew Lab', business_name: 'Brew Lab Café',
        arrival_reward: 0.5, main_reward: 5, status: 'active', location_name: 'Downtown',
        location_lat: 40.7128, location_lng: -74.006, description: 'Visit Brew Lab and discover their secret menu!',
        tasks: ['Find the hidden menu board', 'Order a special item', 'Take a photo with the barista'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
    {
        hunt_id: 'demo-2', title: 'Sneaker Hunt Challenge', business_name: 'Urban Kicks',
        arrival_reward: 1, main_reward: 10, status: 'active', location_name: 'Fashion District',
        location_lat: 40.7193, location_lng: -73.998, description: 'Find our limited edition sneaker display!',
        tasks: ['Find the golden sneaker display', 'Answer 3 trivia questions', 'Share on social media'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
    {
        hunt_id: 'demo-3', title: 'Art Gallery Adventure', business_name: 'Modern Art Space',
        arrival_reward: 0.75, main_reward: 7.5, status: 'active', location_name: 'Arts Quarter',
        location_lat: 40.7306, location_lng: -73.9866, description: 'Explore contemporary art and earn rewards!',
        tasks: ['Visit 3 exhibits', 'Take photos', 'Write a short review'],
        start_time: '2026-03-01T00:00:00Z', end_time: '2026-04-01T00:00:00Z'
    },
];

export default function HuntsPage() {
    const navigate = useNavigate();
    const [hunts, setHunts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        async function fetchHunts() {
            try {
                const res = await getHunts();
                const apiHunts = res.data.hunts || [];
                if (apiHunts.length > 0) {
                    setHunts(apiHunts);
                } else {
                    setHunts(DEMO_HUNTS);
                }
            } catch (err) {
                console.log('Using demo hunts (backend unavailable)');
                setHunts(DEMO_HUNTS);
            } finally {
                setLoading(false);
            }
        }
        fetchHunts();
    }, []);

    const filtered = hunts.filter(h => {
        const matchSearch = h.title?.toLowerCase().includes(search.toLowerCase()) ||
            h.business_name?.toLowerCase().includes(search.toLowerCase()) ||
            h.location_name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || h.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            color: 'var(--nb-text)',
            minHeight: '100vh',
            padding: '24px',
            paddingBottom: '100px',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Page Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
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
                    fontSize: '24px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    margin: 0,
                    letterSpacing: '-1px'
                }}>
                    CITY SELECTION
                </h1>
                <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#FFFFFF',
                    border: 'var(--nb-border)',
                    boxShadow: '4px 4px 0px #000',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px'
                }}>
                    👤
                </div>
            </div>

            {/* Total Progress Status Card */}
            <div style={{
                backgroundColor: '#FEF9C3', // Light yellow
                border: 'var(--nb-border)',
                borderRadius: 'var(--nb-radius)',
                padding: '20px',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '4px 4px 0px #000'
            }}>
                <div>
                    <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#000', margin: '0 0 4px 0' }}>Total Progress</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 900 }}>34/150</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Myths</span>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: 'var(--nb-radius)',
                    border: '2px solid #000'
                }}>
                    <span style={{ fontSize: '18px' }}>🌟</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#000000' }}>LEVEL 12</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div style={{ marginBottom: '24px' }}>
                <input
                    placeholder="Search hunts, brands, locations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: '4px 4px 0px #000',
                        borderRadius: 'var(--nb-radius)',
                        fontSize: '16px',
                        fontWeight: 700,
                        outline: 'none',
                        marginBottom: '16px'
                    }}
                />
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {['all', 'active', 'upcoming'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: filter === f ? 'var(--nb-yellow)' : '#FFFFFF',
                                border: '2px solid #000',
                                boxShadow: filter === f ? '2px 2px 0px #000' : 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hunts List */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '180px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: 'var(--nb-radius-lg)',
                            border: 'var(--nb-border)',
                            opacity: 0.5
                        }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius)',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900 }}>NO HUNTS FOUND</h3>
                    <p style={{ color: '#6B7280', fontWeight: 700, marginTop: '8px' }}>Try a different search or filter</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filtered.map((hunt, i) => (
                        <div key={hunt.hunt_id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                            <HuntCard hunt={hunt} />
                        </div>
                    ))}
                </div>
            )}

            <BottomNav />
        </div>
    );
}

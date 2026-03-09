import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHunts } from '../../lib/api';
import { HuntCard } from '../../components/HuntCard';
import { BottomNav } from '../../components/BottomNav';
import { WalletButton } from '../../components/WalletButton';

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
    const [usingDemo, setUsingDemo] = useState(false);

    useEffect(() => {
        async function fetchHunts() {
            try {
                const res = await getHunts();
                const apiHunts = res.data.hunts || [];
                if (apiHunts.length > 0) {
                    setHunts(apiHunts);
                } else {
                    // No hunts in database yet — show demo
                    setHunts(DEMO_HUNTS);
                    setUsingDemo(true);
                }
            } catch (err) {
                // Backend not available — use demo data
                console.log('Using demo hunts (backend unavailable)');
                setHunts(DEMO_HUNTS);
                setUsingDemo(true);
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
        <div className="page">
            {/* Header */}
            <div className="flex justify-between items-center mb-4" style={{ padding: '16px 0' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Explore</h1>
                    <small style={{ color: 'var(--text-muted)' }}>
                        {usingDemo ? '📋 Demo data' : `🔴 ${hunts.length} live hunts`}
                    </small>
                </div>
                <WalletButton />
            </div>

            {/* Search */}
            <div className="mb-3">
                <input
                    className="input" placeholder="Search hunts, brands, locations..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                {['all', 'active', 'upcoming'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Hunts List */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card skeleton" style={{ height: '140px' }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
                    <h3>No hunts found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try a different search or filter</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((hunt, i) => (
                        <div key={hunt.hunt_id} className="animate-slide-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => navigate(`/hunt/${hunt.hunt_id}`)}>
                            <HuntCard hunt={hunt} />
                        </div>
                    ))}
                </div>
            )}

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}

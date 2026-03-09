import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';

export default function MapPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="page">
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(`/hunt/${id}`)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h2>Navigate</h2>
            </div>

            {/* Map placeholder */}
            <div className="map-container animate-fade-in" style={{
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }} className="animate-float">📍</div>
                <h3>Map View</h3>
                <p style={{ textAlign: 'center', padding: '0 20px', marginTop: '8px' }}>
                    Connect Google Maps or Mapbox API to enable live navigation
                </p>
                <div style={{
                    marginTop: '16px', padding: '8px 16px',
                    background: 'var(--bg-card)', borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)'
                }}>
                    Set <code>VITE_MAPBOX_TOKEN</code> to activate
                </div>
            </div>

            {/* Location info card */}
            <div className="card mt-4 animate-slide-up">
                <div className="flex items-center gap-3 mb-2">
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <div>
                        <h3>Hunt Location</h3>
                        <small>Navigate to the location to scan the QR</small>
                    </div>
                </div>
            </div>

            {/* Action */}
            <button onClick={() => navigate('/scan')} className="btn btn-primary btn-lg btn-full mt-4 animate-slide-up">
                I'm here — Scan QR
            </button>

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}

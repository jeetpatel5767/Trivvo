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
    // Calculate a mock discovery progress based on the title length or something consistent
    const mockProgress = Math.min(Math.floor((hunt.title.length * 7) % 100) + 10, 95);
    const mockFound = Math.floor(mockProgress / 10);
    const mockTotal = 20;

    return (
        <div
            onClick={() => navigate(`/hunt/${hunt.hunt_id}`)}
            style={{
                backgroundColor: '#FFFFFF',
                border: 'var(--nb-border)',
                boxShadow: '8px 8px 0px #000000',
                borderRadius: 'var(--nb-radius-lg)',
                padding: '24px',
                marginBottom: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translate(4px, 4px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}
        >
            {/* Header: Title and Distance/Label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                            backgroundColor: hunt.status === 'active' ? 'var(--nb-mint)' : '#FCA5A5',
                            border: '2px solid #000',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                        }}>
                            {hunt.status}
                        </span>
                    </div>
                    <h3 style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1',
                        letterSpacing: '-1px'
                    }}>
                        {hunt.title}
                    </h3>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#6B7280',
                        margin: '4px 0 0 0',
                        textTransform: 'uppercase'
                    }}>
                        {hunt.business_name}
                    </p>
                </div>

                {/* Distance Badge */}
                <div style={{
                    backgroundColor: 'var(--nb-yellow)',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 900,
                    boxShadow: '2px 2px 0px #000'
                }}>
                    2.4 KM
                </div>
            </div>

            {/* Discovery Progress Section */}
            <div style={{ width: '100%', color: '#000000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Discovery Progress</span>
                    <span style={{ fontSize: '12px', fontWeight: 800 }}>{mockProgress}%</span>
                </div>
                <div style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '5px',
                    border: '2px solid #000',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${mockProgress}%`,
                        height: '100%',
                        backgroundColor: 'var(--nb-mint)',
                    }} />
                </div>
                <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                        {mockFound}/{mockTotal} Myths Found
                    </span>
                </div>
            </div>

            {/* Start Hunt Button */}
            <button
                style={{
                    width: '100%',
                    backgroundColor: 'var(--nb-yellow)',
                    border: 'var(--nb-border)',
                    boxShadow: '4px 4px 0px #000',
                    borderRadius: 'var(--nb-radius-lg)',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '18px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginTop: '8px'
                }}
            >
                Start Hunt ▶
            </button>
        </div>
    );
}

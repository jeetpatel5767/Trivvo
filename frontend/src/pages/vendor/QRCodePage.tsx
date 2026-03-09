import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import LogoT from '../../assets/LogoT.png';

export default function QRCodePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const qrData = `${id}:demo_secret_${id}`;

    const handleDownload = () => {
        const svg = document.querySelector('.qr-download-target svg') as SVGSVGElement;
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = 400;
            canvas.height = 400;
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 400, 400);
                ctx.drawImage(img, 50, 50, 300, 300);
            }
            const link = document.createElement('a');
            link.download = `trivvo-hunt-${id}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px',
        textAlign: 'center'
    };

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: '#000000',
            paddingBottom: '40px'
        }}>
            {/* Top Navigation Bar */}
            <div style={{
                backgroundColor: '#FFFFFF',
                borderBottom: 'var(--nb-border)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--nb-yellow)',
                        border: '2px solid #000',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px'
                    }}>
                        <img src={LogoT} alt="T" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}>TR!VVO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E5E7EB',
                        border: '2px solid #000',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px'
                    }}>👤</div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate('/vendor/dashboard')}
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
                    >←</button>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1'
                    }}>HUNT QR CODE 📱</h1>
                </div>

                {/* QR Code Card */}
                <div style={cardStyle}>
                    <div className="qr-download-target" style={{
                        display: 'inline-block',
                        padding: '24px',
                        backgroundColor: '#FFFFFF',
                        border: '3px solid #000',
                        boxShadow: '8px 8px 0px #000',
                        borderRadius: '20px',
                        marginBottom: '32px'
                    }}>
                        <QRCodeSVG
                            value={qrData}
                            size={200}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="H"
                        />
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Join the Hunt!</h2>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280', marginBottom: '24px' }}>
                        Display this QR code at your location for hunters to scan.
                    </p>

                    <div style={{
                        backgroundColor: '#F3F4F6',
                        border: '2px solid #000',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 800,
                        wordBreak: 'break-all',
                        marginBottom: '32px',
                        color: '#4B5563'
                    }}>
                        QR DATA: {qrData}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            onClick={handleDownload}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--nb-mint)',
                                border: 'var(--nb-border)',
                                boxShadow: 'var(--nb-shadow)',
                                borderRadius: 'var(--nb-radius)',
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>📥</span> DOWNLOAD QR CODE
                        </button>
                        <button
                            onClick={() => navigate(`/vendor/fund/${id}`)}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--nb-yellow)',
                                border: 'var(--nb-border)',
                                boxShadow: 'var(--nb-shadow)',
                                borderRadius: 'var(--nb-radius)',
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>💰</span> FUND THIS HUNT
                        </button>
                    </div>
                </div>

                {/* Instructions Board */}
                <div style={{ ...cardStyle, textAlign: 'left', backgroundColor: '#FFFFFF' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📋</span> INSTRUCTIONS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            'Download and print the QR code',
                            'Display it prominently at your location',
                            'Fund the hunt with USDC tokens',
                            'Users scan → earn arrival reward → tasks',
                            'Verify tasks and distribute main rewards'
                        ].map((text, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#000',
                                    color: '#FFF',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    flexShrink: 0
                                }}>{i + 1}</div>
                                <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParticipants } from '../../lib/api';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';

const DEMO_DATA = [
    { wallet_address: '0x1234...abcd', arrival_time: '2026-03-06T10:30:00Z', task_completed: true, arrival_tx_hash: '0xabc123', reward_tx_hash: '0xdef456' },
    { wallet_address: '0x5678...efgh', arrival_time: '2026-03-06T09:15:00Z', task_completed: true, arrival_tx_hash: '0x111aaa', reward_tx_hash: '0x222bbb' },
    { wallet_address: '0x9012...ijkl', arrival_time: '2026-03-06T08:45:00Z', task_completed: false, arrival_tx_hash: '0x333ccc', reward_tx_hash: null },
    { wallet_address: '0x3456...mnop', arrival_time: '2026-03-05T14:20:00Z', task_completed: false, arrival_tx_hash: '0x444ddd', reward_tx_hash: null },
    { wallet_address: '0x7890...qrst', arrival_time: '2026-03-05T11:10:00Z', task_completed: true, arrival_tx_hash: '0x555eee', reward_tx_hash: null },
];

export default function ParticipantsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<any[]>(DEMO_DATA);

    useEffect(() => {
        if (id) {
            getParticipants(id).then(res => {
                if (res.data.participants?.length) setParticipants(res.data.participants);
            }).catch(() => { });
        }
    }, [id]);

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page" style={{ paddingBottom: '40px' }}>
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(`/vendor/hunt-manage/${id}`)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <h2>Participants ({participants.length})</h2>
                </div>

                <div className="table-container animate-fade-in">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Wallet</th>
                                <th>Arrived</th>
                                <th>Task</th>
                                <th>Reward</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p, i) => (
                                <tr key={i}>
                                    <td><span className="wallet-address" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{p.wallet_address}</span></td>
                                    <td style={{ fontSize: '0.8rem' }}>{new Date(p.arrival_time).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${p.task_completed ? 'badge-active' : 'badge-pending'}`}>
                                            {p.task_completed ? 'Done' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {p.reward_tx_hash ? (
                                            <span className="badge badge-reward">Sent</span>
                                        ) : (
                                            <span className="badge badge-pending">Pending</span>
                                        )}
                                    </td>
                                    <td>
                                        {p.task_completed && !p.reward_tx_hash && (
                                            <button className="btn btn-success btn-sm">Pay</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

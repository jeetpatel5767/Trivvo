import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { HUNT_ESCROW_ABI, ERC20_ABI, CONTRACTS } from '../../lib/contracts';
import { getHunt, fundHunt } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';

type FundingStep = 'input' | 'creating' | 'approving' | 'funding' | 'done';

export default function FundHuntPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { address } = useAccount();
    const [amount, setAmount] = useState('50');
    const [step, setStep] = useState<FundingStep>('input');
    const [error, setError] = useState('');
    const [hunt, setHunt] = useState<any>(null);
    const [contractHuntId, setContractHuntId] = useState<bigint | null>(null);

    // Fetch hunt details from backend
    useEffect(() => {
        if (id) getHunt(id).then(res => setHunt(res.data.hunt)).catch(() => { });
    }, [id]);

    // Read USDC balance
    const { data: usdcBalance } = useReadContract({
        address: CONTRACTS.USDC_TOKEN as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    // Read nextHuntId from escrow to know what our ID will be
    const { data: nextHuntId } = useReadContract({
        address: CONTRACTS.HUNT_ESCROW as `0x${string}`,
        abi: HUNT_ESCROW_ABI,
        functionName: 'nextHuntId',
    });

    // Step 1: Create hunt on-chain
    const { writeContract: createHuntOnChain, data: createTxHash } = useWriteContract();
    const { isSuccess: createConfirmed } = useWaitForTransactionReceipt({ hash: createTxHash });

    // Step 2: Approve USDC
    const { writeContract: approveUSDC, data: approveTxHash } = useWriteContract();
    const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });

    // Step 3: Fund hunt on-chain
    const { writeContract: fundHuntOnChain, data: fundTxHash } = useWriteContract();
    const { isSuccess: fundConfirmed } = useWaitForTransactionReceipt({ hash: fundTxHash });

    // Watch for step transitions
    useEffect(() => {
        if (createConfirmed && step === 'creating') {
            // Hunt created, now approve USDC
            setStep('approving');
            const amountInUnits = parseUnits(amount, 6);
            approveUSDC({
                address: CONTRACTS.USDC_TOKEN as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [CONTRACTS.HUNT_ESCROW as `0x${string}`, amountInUnits],
            });
        }
    }, [createConfirmed, step]);

    useEffect(() => {
        if (approveConfirmed && step === 'approving') {
            // USDC approved, now fund the hunt
            setStep('funding');
            const amountInUnits = parseUnits(amount, 6);
            fundHuntOnChain({
                address: CONTRACTS.HUNT_ESCROW as `0x${string}`,
                abi: HUNT_ESCROW_ABI,
                functionName: 'fundHunt',
                args: [contractHuntId ?? BigInt(0), amountInUnits],
            });
        }
    }, [approveConfirmed, step]);

    useEffect(() => {
        if (fundConfirmed && step === 'funding') {
            const finishFunding = async () => {
                try {
                    await fundHunt({
                        huntId: id,
                        contractHuntId: Number(contractHuntId),
                        txHash: fundTxHash
                    });
                    setStep('done');
                } catch (err) {
                    console.error('Failed to register funding to DB', err);
                    setError('Funded on blockchain, but failed to sync to database.');
                }
            };
            finishFunding();
        }
    }, [fundConfirmed, step, id, contractHuntId, fundTxHash]);

    const handleFund = async () => {
        setError('');
        if (!hunt) { setError('Hunt not found'); return; }
        if (!address) { setError('Connect your wallet first'); return; }

        const amountNum = parseFloat(amount);
        if (amountNum <= 0) { setError('Enter a valid amount'); return; }

        // Check USDC balance
        const balanceFormatted = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)) : 0;
        if (balanceFormatted < amountNum) {
            setError(`Insufficient USDC balance. You have ${balanceFormatted.toFixed(2)} USDC`);
            return;
        }

        // Step 1: Create hunt on the smart contract
        setContractHuntId(nextHuntId as bigint || BigInt(0));
        setStep('creating');
        const arrivalRewardUnits = parseUnits(String(hunt.arrival_reward || '0.5'), 6);
        const mainRewardUnits = parseUnits(String(hunt.main_reward || '5'), 6);
        const now = Math.floor(Date.now() / 1000);
        const startTime = hunt.start_time ? Math.floor(new Date(hunt.start_time).getTime() / 1000) : now - 60;
        const endTime = hunt.end_time ? Math.max(Math.floor(new Date(hunt.end_time).getTime() / 1000), startTime + 3600) : startTime + 30 * 86400;

        try {
            createHuntOnChain({
                address: CONTRACTS.HUNT_ESCROW as `0x${string}`,
                abi: HUNT_ESCROW_ABI,
                functionName: 'createHunt',
                args: [
                    CONTRACTS.USDC_TOKEN as `0x${string}`,
                    arrivalRewardUnits,
                    mainRewardUnits,
                    BigInt(startTime),
                    BigInt(endTime),
                ],
            });
        } catch (err: any) {
            setError(err?.message || 'Failed to create hunt on-chain');
            setStep('input');
        }
    };

    const arrivalReward = hunt?.arrival_reward || 0.5;
    const mainReward = hunt?.main_reward || 5;
    const perParticipant = Number(arrivalReward) + Number(mainReward);
    const estimatedParticipants = Math.floor(parseFloat(amount || '0') / perParticipant);
    const balanceDisplay = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)).toFixed(2) : '0.00';

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        border: '3px solid #000',
        borderRadius: '12px',
        fontSize: '24px',
        fontWeight: 900,
        outline: 'none',
        textAlign: 'center',
        boxShadow: '4px 4px 0px #000'
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
                        fontSize: '28px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1'
                    }}>FUND HUNT 💰</h1>
                </div>

                {step === 'done' ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'var(--nb-mint)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            fontSize: '40px'
                        }}>✓</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>HUNT FUNDED! 🎉</h2>
                        <p style={{ fontWeight: 700, margin: '0 0 8px 0' }}>{amount} USDC deposited into escrow</p>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', marginBottom: '16px' }}>
                            TX: {fundTxHash?.slice(0, 10)}...{fundTxHash?.slice(-8)}
                        </p>
                        <div style={{
                            backgroundColor: 'var(--nb-yellow)',
                            border: '2px solid #000',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            display: 'inline-block',
                            fontWeight: 900,
                            marginBottom: '32px'
                        }}>LIVE & ACTIVE ●</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                onClick={() => navigate(`/vendor/hunt-manage/${id}`)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#000',
                                    color: '#FFF',
                                    border: '2px solid #000',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >MANAGE HUNT</button>
                            <button
                                onClick={() => navigate('/vendor/dashboard')}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#FFFFFF',
                                    border: '2px solid #000',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >BACK TO DASHBOARD</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {/* Balance Board */}
                        <div style={{
                            backgroundColor: 'var(--nb-mint)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius)',
                            padding: '16px',
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000', margin: '0 0 4px 0' }}>YOUR USDC BALANCE</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>{balanceDisplay} USDC</h2>
                        </div>

                        {/* Amount Card */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>💰 DEPOSIT USDC</h3>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280', marginBottom: '24px' }}>
                                Tokens are locked in escrow and distributed to successful hunters.
                            </p>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>AMOUNT (USDC)</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    step="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={step !== 'input'}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
                                {['25', '50', '100', '250'].map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAmount(a)}
                                        disabled={step !== 'input'}
                                        style={{
                                            backgroundColor: amount === a ? 'var(--nb-yellow)' : '#FFFFFF',
                                            border: '2px solid #000',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            boxShadow: amount === a ? '2px 2px 0px #000' : 'none'
                                        }}
                                    >{a}</button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{
                                    backgroundColor: '#F3F4F6',
                                    border: '2px solid #000',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 900 }}>{estimatedParticipants}</div>
                                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280' }}>EST. HUNTERS</div>
                                </div>
                                <div style={{
                                    backgroundColor: '#F3F4F6',
                                    border: '2px solid #000',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 900 }}>{perParticipant}</div>
                                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#6B7280' }}>USDC PER USER</div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Tracker */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>TRANSACTION STEPS</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { label: 'Create hunt on smart contract', status: step === 'creating' ? 'loading' : createConfirmed ? 'done' : 'wait' },
                                    { label: 'Approve USDC spend', status: step === 'approving' ? 'loading' : approveConfirmed ? 'done' : 'wait' },
                                    { label: 'Deposit tokens into escrow', status: step === 'funding' ? 'loading' : fundConfirmed ? 'done' : 'wait' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: s.status === 'done' ? 'var(--nb-mint)' : s.status === 'loading' ? 'var(--nb-yellow)' : '#FFF',
                                            border: '2px solid #000',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '12px',
                                            fontWeight: 900
                                        }}>
                                            {s.status === 'done' ? '✓' : s.status === 'loading' ? '⏳' : i + 1}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: s.status === 'wait' ? '#6B7280' : '#000' }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#FEE2E2',
                                border: '2px solid #B91C1C',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '24px',
                                color: '#B91C1C',
                                fontWeight: 800,
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <span>❌</span> {error}
                            </div>
                        )}

                        <button
                            onClick={handleFund}
                            disabled={step !== 'input' || !amount || parseFloat(amount) <= 0}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--nb-yellow)',
                                border: 'var(--nb-border)',
                                boxShadow: 'var(--nb-shadow)',
                                borderRadius: 'var(--nb-radius-lg)',
                                padding: '24px',
                                fontSize: '20px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: step !== 'input' ? 'not-allowed' : 'pointer',
                                opacity: step !== 'input' ? 0.8 : 1
                            }}
                        >
                            {step === 'input' ? `DEPLOY ${amount} USDC` : 'PROCESSING...'}
                        </button>

                        {step !== 'input' && (
                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', fontWeight: 800, color: '#6B7280' }}>
                                ⚠️ CONFIRM TRANSACTIONS IN METAMASK
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

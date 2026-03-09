import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { HUNT_ESCROW_ABI, ERC20_ABI, CONTRACTS } from '../../lib/contracts';
import { getHunt, fundHunt } from '../../lib/api';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';

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

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate('/vendor/dashboard')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <h2>Fund Hunt</h2>
                </div>

                {step === 'done' ? (
                    <div className="animate-scale-in text-center" style={{ paddingTop: '40px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                            fontSize: '2rem',
                        }}>
                            ✓
                        </div>
                        <h1>Hunt Funded! 🎉</h1>
                        <p className="mt-2">{amount} USDC deposited into escrow contract</p>
                        <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Tx: {fundTxHash?.slice(0, 10)}...{fundTxHash?.slice(-8)}
                        </p>
                        <p className="mt-2">Your hunt is now <strong style={{ color: 'var(--success)' }}>ACTIVE</strong></p>

                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={() => navigate(`/vendor/hunt-manage/${id}`)} className="btn btn-primary btn-full">
                                Manage Hunt
                            </button>
                            <button onClick={() => navigate('/vendor/dashboard')} className="btn btn-secondary btn-full">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* USDC Balance */}
                        <div className="card mb-3" style={{ textAlign: 'center', padding: '12px' }}>
                            <small style={{ color: 'var(--text-muted)' }}>Your USDC Balance</small>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>{balanceDisplay} USDC</div>
                        </div>

                        <div className="card-glass mb-4">
                            <h3 className="mb-3">💰 Deposit USDC</h3>
                            <p style={{ marginBottom: '16px' }}>Fund your hunt escrow. Tokens are locked in the smart contract and distributed as rewards.</p>

                            <div className="input-group mb-4">
                                <label>Amount (USDC)</label>
                                <input className="input" type="number" step="1" value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={step !== 'input'}
                                    style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }} />
                            </div>

                            <div className="flex gap-2 mb-4">
                                {['25', '50', '100', '250'].map((a) => (
                                    <button key={a} onClick={() => setAmount(a)}
                                        className={`btn btn-sm ${amount === a ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ flex: 1 }} disabled={step !== 'input'}>
                                        {a}
                                    </button>
                                ))}
                            </div>

                            <div className="stat-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{estimatedParticipants}</div>
                                    <div className="stat-label">Est. Participants</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{perParticipant}</div>
                                    <div className="stat-label">USDC Per User</div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Steps Progress */}
                        <div className="card mb-4">
                            <h3 className="mb-3">Transaction Steps</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span>{step === 'creating' ? '⏳' : createConfirmed ? '✅' : '⬜'}</span>
                                    <span>1. Create hunt on smart contract</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>{step === 'approving' ? '⏳' : approveConfirmed ? '✅' : '⬜'}</span>
                                    <span>2. Approve USDC spend</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>{step === 'funding' ? '⏳' : fundConfirmed ? '✅' : '⬜'}</span>
                                    <span>3. Deposit USDC into escrow</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="card mb-3" style={{ border: '1px solid var(--danger)', padding: '12px' }}>
                                <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>❌ {error}</p>
                            </div>
                        )}

                        <button onClick={handleFund} className="btn btn-primary btn-lg btn-full"
                            disabled={step !== 'input' || !amount || parseFloat(amount) <= 0}>
                            {step === 'input' ? `Fund Hunt with ${amount} USDC` :
                                step === 'creating' ? '⏳ Creating hunt on-chain...' :
                                    step === 'approving' ? '⏳ Approving USDC...' :
                                        step === 'funding' ? '⏳ Depositing USDC...' : 'Done!'}
                        </button>

                        {step !== 'input' && (
                            <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                ⚠️ Please confirm each transaction in MetaMask
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

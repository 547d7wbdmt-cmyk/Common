import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FakeQr, Icon, Modal } from '../../components/ui'
import { POINTS_PER_DOLLAR } from '../../data'
import { money, shortDate } from '../../store'
import { DEMO_MEMBER, memberSummaries, type MTxn } from '../data'
import { activeBonus, useMerchant } from '../store'
import { MPage, MTxnRow } from '../ui'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫']
type Mode = 'charge' | 'code' | 'reward'
type ChargeStep = 'scan' | 'waiting'

export default function Counter() {
  const m = useMerchant()
  const [mode, setMode] = useState<Mode>('charge')
  const [digits, setDigits] = useState('')
  const [step, setStep] = useState<ChargeStep | null>(null)
  const [memberId, setMemberId] = useState('')
  const [received, setReceived] = useState<MTxn | null>(null)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [checking, setChecking] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<MTxn | null>(null)
  const total = Number(digits || '0')
  const bonus = activeBonus(m.bonuses)
  const recentMembers = memberSummaries(m.txns).slice(0, 4).map((x) => x.id)

  // Simulated: the member approves the charge on their phone a moment later.
  useEffect(() => {
    if (step !== 'waiting') return
    const t = setTimeout(() => {
      setStep(null)
      setReceived(m.charge(memberId, total, 'shop'))
      setDigits('')
    }, 1800)
    return () => clearTimeout(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!redeemed) return
    const t = setTimeout(() => setRedeemed(null), 4000)
    return () => clearTimeout(t)
  }, [redeemed])

  const press = (k: string) => {
    if (k === '⌫') setDigits((d) => d.slice(0, -1))
    else setDigits((d) => (d + k).replace(/^0+/, '').slice(0, 6))
  }

  const simulateMemberPayment = () => {
    const amount = Math.round((400 + Math.random() * 2400) / 5) * 5
    const usePoints = Math.random() < 0.3 ? Math.min(250, amount) : 0
    setReceived(m.charge(recentMembers[Math.floor(Math.random() * recentMembers.length)] ?? DEMO_MEMBER, amount, 'member', usePoints))
  }

  const checkCode = () => {
    const v = m.findVoucher(code)
    if (!v) return setCodeError("We couldn't find that code. Check the letters and numbers and try again.")
    if (v.usedAt) return setCodeError(`That code was already used on ${shortDate(v.usedAt)}.`)
    const reward = m.rewards.find((r) => r.id === v.rewardId)
    if (reward && !reward.active) return setCodeError(`"${reward.title}" is paused. Turn it back on in Rewards to accept this code.`)
    setCodeError('')
    setChecking(v.code)
  }
  const voucher = checking ? m.findVoucher(checking) : undefined
  const voucherReward = voucher && m.rewards.find((r) => r.id === voucher.rewardId)

  return (
    <MPage title="Counter" section="counter">
      <div className="chips m-modes" role="tablist" aria-label="Counter mode">
        {([['charge', 'Charge a member'], ['code', 'Shop code'], ['reward', 'Check a reward code']] as const).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={mode === k} className={`chip${mode === k ? ' active' : ''}`} onClick={() => setMode(k)}>{label}</button>
        ))}
      </div>
      {bonus && <p className="m-bonus-inline"><span className="pill pill-ready">{bonus.multiplier}× points</span> {bonus.title} is on. Members earn {bonus.multiplier * POINTS_PER_DOLLAR} points per $1 today.</p>}

      <div className="m-counter">
        {mode === 'charge' && (
          <section className="m-panel m-charge">
            <p className="amount">{money(total)}</p>
            <div className="keypad">
              {KEYS.map((k) => <button key={k} onClick={() => press(k)} aria-label={k === '⌫' ? 'Delete' : k}>{k}</button>)}
            </div>
            <button className="btn btn-primary btn-block" disabled={total === 0} onClick={() => setStep('scan')}>
              <Icon name="scan" size={18} /> Charge {money(total)}
            </button>
            <p className="hint">Scan the member's card. They approve the charge on their phone.</p>
          </section>
        )}

        {mode === 'code' && (
          <section className="m-panel center">
            <h2>Members scan to pay</h2>
            <FakeQr value="shop-rosas-bakery" size={200} />
            <p className="code">ROSAS-048</p>
            <p className="muted">Keep this by the register. Members scan it, enter the amount, and the payment appears here.</p>
            <button className="btn btn-secondary" onClick={simulateMemberPayment}>Simulate a member payment</button>
          </section>
        )}

        {mode === 'reward' && (
          <section className="m-panel">
            <h2>Check a reward code</h2>
            <p className="muted">Members show a code like <span className="code-inline">CW-7Q2K</span> in their app. Type it or scan it.</p>
            <form className="m-code-form" onSubmit={(e) => { e.preventDefault(); checkCode() }}>
              <label className="sr-only" htmlFor="reward-code">Reward code</label>
              <input id="reward-code" className="search code-input" placeholder="CW-XXXX" value={code} autoComplete="off"
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError('') }} />
              <button className="btn btn-primary" disabled={code.trim().length < 4}>Check code</button>
            </form>
            {codeError && <p className="warn m-left">{codeError}</p>}
            <p className="hint m-left">Demo codes: CW-7Q2K and CW-M4RS are valid; CW-B8TL was already used.</p>
          </section>
        )}

        <section className="m-panel m-recent">
          <div className="section-head"><h2>Latest at the counter</h2></div>
          <div className="list">{m.txns.slice(0, 5).map((t) => <MTxnRow key={t.id} txn={t} />)}</div>
        </section>
      </div>

      <Modal open={step === 'scan'} onClose={() => setStep(null)} title={`Charge ${money(total)}`}>
        <div className="camera"><div className="camera-frame" /><p>Point the camera at the member card</p></div>
        <p className="label">Or pick a recent member (demo)</p>
        <div className="m-member-picks">
          {recentMembers.map((id) => (
            <button key={id} className="btn btn-quiet" onClick={() => { setMemberId(id); setStep('waiting') }}>{id}</button>
          ))}
        </div>
      </Modal>

      <Modal open={step === 'waiting'} onClose={() => setStep(null)} title="Waiting for approval">
        <div className="center">
          <span className="m-spinner" aria-hidden="true" />
          <p><strong>{money(total)}</strong> sent to <strong>{memberId}</strong>.</p>
          <p className="muted">They approve it on their phone. This usually takes a few seconds.</p>
          <button className="btn btn-quiet" onClick={() => setStep(null)}>Cancel charge</button>
        </div>
      </Modal>

      <Modal open={!!received} onClose={() => setReceived(null)} title="Payment received">
        {received && (
          <>
            <div className="center">
              <span className="success-icon"><Icon name="check" size={28} /></span>
              <p className="amount">{money(received.total)}</p>
              <p>from <strong>{received.memberId}</strong> · {received.source === 'member' ? 'scanned your shop code' : 'charged at the counter'}</p>
            </div>
            <dl className="facts">
              {received.pointsApplied > 0 && <div><dt>Paid with points</dt><dd>{received.pointsApplied} points ({money(received.pointsApplied)}, reimbursed to you)</dd></div>}
              <div><dt>Member earned</dt><dd className="earned">+{received.pointsIssued} points{received.multiplier ? ` (${received.multiplier}× bonus)` : ''}</dd></div>
              <div><dt>Fee</dt><dd>{money(received.fee)}</dd></div>
            </dl>
            <div className="sheet-actions">
              <Link className="btn btn-quiet" to={`/merchant/transactions/${received.id}`}>View details</Link>
              <button className="btn btn-primary" onClick={() => setReceived(null)}>Done</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!voucher} onClose={() => setChecking(null)} title="Code is valid">
        {voucher && voucherReward && (
          <>
            <dl className="facts">
              <div><dt>Reward</dt><dd>{voucherReward.title}</dd></div>
              <div><dt>Member</dt><dd>{voucher.memberId}</dd></div>
              <div><dt>Points</dt><dd>{voucherReward.points} points ({money(voucherReward.points)} reimbursed to you)</dd></div>
              <div><dt>Code</dt><dd className="code-inline">{voucher.code}</dd></div>
            </dl>
            <p className="muted">Hand over the reward, then confirm. The code can't be used again.</p>
            <div className="sheet-actions">
              <button className="btn btn-quiet" onClick={() => setChecking(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setRedeemed(m.redeemVoucher(voucher.code)); setChecking(null); setCode('') }}>Confirm redemption</button>
            </div>
          </>
        )}
      </Modal>
      {redeemed && (
        <div className="m-toast" role="status">
          <Icon name="check" size={18} /> Redeemed {m.rewards.find((r) => r.id === redeemed.rewardId)?.title ?? 'reward'} for {redeemed.memberId}
        </div>
      )}
    </MPage>
  )
}

import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FakeQr, Icon, Page, ShopBadge } from '../components/ui'
import { rewardById, shopById } from '../data'
import { money, pointsValue, shortDate, useWallet } from '../store'
import NotFound from './NotFound'

export default function TxnDetail() {
  const { txnId } = useParams()
  const [params] = useSearchParams()
  const { txns, points, cents } = useWallet()
  const txn = txns.find((t) => t.id === txnId)
  if (!txn) return <NotFound />

  const shop = txn.kind === 'load' ? undefined : shopById(txn.shopId)
  const justPaid = params.has('paid')
  const justAdded = params.has('added')

  return (
    <Page title={justPaid ? 'Receipt' : 'Details'} back="/wallet/activity">
      {(justPaid || justAdded) && (
        <div className="success">
          <span className="success-icon"><Icon name="check" size={28} /></span>
          <h2>{justPaid ? 'Payment sent' : 'Funds added'}</h2>
          {txn.kind === 'payment' && shop ? (
            <p>
              You earned <strong className="earned">{txn.pointsEarned} points</strong> at {shop.name}. Use them at any member shop.
            </p>
          ) : null}
          <p className="muted">Balance {money(cents)} · {points.toLocaleString()} points</p>
        </div>
      )}

      <section className="receipt">
        {shop && <ShopBadge shop={shop} size={48} />}
        {txn.kind === 'load' && <p className="amount pos">+{money(txn.cents)}</p>}
        {txn.kind === 'payment' && <p className="amount">{money(txn.cents + txn.pointsUsed)}</p>}
        {txn.kind === 'redeem' && <p className="amount">{rewardById(txn.rewardId)?.title}</p>}

        <dl className="facts">
          <div><dt>Date</dt><dd>{shortDate(txn.date)}</dd></div>
          {txn.kind === 'load' && <div><dt>From</dt><dd>{txn.method}</dd></div>}
          {shop && (
            <div><dt>Shop</dt><dd><Link to={`/shops/${shop.id}`}>{shop.name}</Link></dd></div>
          )}
          {txn.kind === 'payment' && (
            <>
              <div><dt>Paid from balance</dt><dd>{money(txn.cents)}</dd></div>
              {txn.pointsUsed > 0 && <div><dt>Points applied</dt><dd>{txn.pointsUsed} points ({pointsValue(txn.pointsUsed)})</dd></div>}
              <div><dt>Points earned</dt><dd className="earned">+{txn.pointsEarned} points</dd></div>
            </>
          )}
          {txn.kind === 'redeem' && (
            <>
              <div><dt>Points used</dt><dd>{txn.pointsUsed} points</dd></div>
              <div><dt>Code</dt><dd className="code">{txn.code}</dd></div>
            </>
          )}
          <div><dt>Reference</dt><dd className="muted">{txn.id.toUpperCase()}</dd></div>
        </dl>

        {txn.kind === 'redeem' && <FakeQr value={txn.code} size={150} />}
      </section>

      {justPaid && <Link to="/" className="btn btn-primary btn-block">Done</Link>}
      {justAdded && <Link to="/pay" className="btn btn-primary btn-block">Pay a shop</Link>}
    </Page>
  )
}

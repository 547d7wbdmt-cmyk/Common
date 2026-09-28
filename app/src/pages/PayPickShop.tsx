import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon, Modal, Page, ShopBadge } from '../components/ui'
import { SHOPS } from '../data'
import { money, useWallet } from '../store'

export default function PayPickShop() {
  const { cents } = useWallet()
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)

  return (
    <Page>
      <h1 className="page-title">Pay a shop</h1>
      <p className="muted">Balance {money(cents)} · <Link to="/wallet/add">Add funds</Link></p>

      <button className="scan-btn" onClick={() => setScanning(true)}>
        <Icon name="scan" size={32} />
        <span>
          <strong>Scan shop code</strong>
          <small>Point your camera at the code by the register</small>
        </span>
      </button>

      <div className="section-head"><h2>Or choose a shop</h2></div>
      <div className="list">
        {SHOPS.map((s) => (
          <Link key={s.id} to={`/pay/${s.id}`} className="row">
            <ShopBadge shop={s} size={40} />
            <span className="row-main">
              <strong>{s.name}</strong>
              <small>{s.address}</small>
            </span>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </div>

      <Modal open={scanning} onClose={() => setScanning(false)} title="Scan shop code">
        <div className="camera">
          <div className="camera-frame" />
          <p>Camera preview (prototype)</p>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => navigate(`/pay/${SHOPS[0].id}`)}>
          Simulate scan: {SHOPS[0].name}
        </button>
      </Modal>
    </Page>
  )
}

import { Link } from 'react-router-dom'
import { Page } from '../components/ui'

export default function NotFound() {
  return (
    <Page title="Not found" back="/">
      <div className="center">
        <p className="empty">We couldn’t find that page.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </Page>
  )
}

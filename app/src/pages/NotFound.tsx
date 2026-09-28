import { Link } from 'react-router-dom'
import { Page } from '../components/ui'

export default function NotFound() {
  return (
    <Page title="Not found" back="/">
      <p className="empty">We couldn't find that page.</p>
      <Link to="/" className="btn btn-primary btn-block">Go home</Link>
    </Page>
  )
}

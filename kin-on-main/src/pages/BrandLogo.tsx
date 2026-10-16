import { KinMark, Page } from '../components/ui'

const LOCKUPS = [
  { src: '/brand/kin-on-main-logo-cream.png', name: 'Primary · cream', note: 'Use this by default: the app, receipts, counter cards, window decals and print.' },
  { src: '/brand/kin-on-main-logo-navy.png', name: 'Navy background', note: 'Only where the background is dark: social posts, signage, dark mode.' },
]

const MARKS = [
  { file: 'kin-on-main-mark.svg', label: 'Full color' },
  { file: 'kin-on-main-mark-indigo.svg', label: 'One color · indigo' },
  { file: 'kin-on-main-mark-cream.svg', label: 'One color · cream' },
  { file: 'kin-on-main-mark-black.svg', label: 'One color · black' },
]

/** The Kin on Main logo: versions, downloads and usage rules (source files in brand/logo/). */
export default function BrandLogo() {
  return (
    <Page title="Logo" back="/profile">
      {LOCKUPS.map((c) => (
        <figure key={c.src} className="concept">
          <img src={c.src} alt={`Kin on Main logo, ${c.name}`} width={640} height={640} />
          <figcaption><strong>{c.name}</strong><small>{c.note}</small></figcaption>
        </figure>
      ))}

      <p className="label">Storefront mark</p>
      <div className="size-test">
        {[64, 44, 34, 24, 16].map((s) => (
          <span key={s}><KinMark size={s} /><small>{s}px</small></span>
        ))}
      </div>
      <p className="label">One color · decals, receipts, stamps</p>
      <div className="size-test mono">
        {[64, 44, 34, 24].map((s) => (
          <span key={s}><KinMark size={s} mono /><small>{s}px</small></span>
        ))}
      </div>
      <div className="size-test dark mono">
        {[64, 44, 34, 24].map((s) => (
          <span key={s}><KinMark size={s} mono /><small>{s}px</small></span>
        ))}
      </div>

      <p className="label">Download the mark (SVG)</p>
      <div className="list">
        {MARKS.map((m) => (
          <a key={m.file} href={`/brand/${m.file}`} download className="row">
            <span className="row-main"><strong>{m.label}</strong><small>{m.file}</small></span>
          </a>
        ))}
      </div>

      <p className="label">How to use it</p>
      <ul className="notes">
        <li>Lead with the cream version. Use navy only when the background is already dark.</li>
        <li>Write it “Kin <em>on</em> Main”, with “on” lowercase and in italic brick (gold on navy).</li>
        <li>Below 32px, use the storefront mark alone, without the wordmark or tagline.</li>
        <li>On a photo or a colored background, use a one-color mark. Don’t recolor the full-color one.</li>
        <li>Leave clear space around the logo at least the height of the awning.</li>
      </ul>
    </Page>
  )
}

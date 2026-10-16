import { KinMark, Page } from '../components/ui'

const CONCEPTS = [
  { src: '/brand/kin-on-main-light.png', name: 'Storefront · light', note: 'Default for cream backgrounds: app, receipts, window decals.' },
  { src: '/brand/kin-on-main-dark.png', name: 'Storefront · dark', note: 'For indigo backgrounds: social, signage, dark mode.' },
]

/** Review screen for logo concepts (brand/logo-ideas/). Not a member-facing screen. */
export default function LogoIdeas() {
  return (
    <Page title="Logo ideas" back="/profile">
      <p className="draft">Concepts for review · not final</p>

      {CONCEPTS.map((c) => (
        <figure key={c.src} className="concept">
          <img src={c.src} alt={`Kin on Main logo concept, ${c.name}`} width={640} height={640} />
          <figcaption><strong>{c.name}</strong><small>{c.note}</small></figcaption>
        </figure>
      ))}

      <p className="label">Mark at app sizes</p>
      <div className="size-test">
        {[64, 44, 34, 24, 16].map((s) => (
          <span key={s}><KinMark size={s} /><small>{s}px</small></span>
        ))}
      </div>
      <div className="size-test dark">
        {[64, 44, 34, 24, 16].map((s) => (
          <span key={s}><KinMark size={s} /><small>{s}px</small></span>
        ))}
      </div>

      <p className="label">Notes against the brand guide</p>
      <ul className="notes">
        <li>Hits the guide’s idea of a rising sun with a storefront awning, and uses the palette and the Fraunces-style wordmark. The italic brick “on” keeps “on” lowercase.</li>
        <li>It shows one storefront where the guide described a short row of three. Worth confirming with the designer which way to go.</li>
        <li>The “open” sign and the sun’s rays disappear below about 32px. The app mark drops them to a gold bar and three short rays.</li>
        <li>Still needed: a one-color version (decals, receipts) and a test at 4 in decal size and a 32px favicon.</li>
        <li>Dark version: the indigo awning bar and ground line almost vanish on navy. Lighten them or drop them.</li>
      </ul>
    </Page>
  )
}

'use client';
import Link from 'next/link';
import { I } from './icons';
import { useStore } from './store-context';
import { toast } from './ui-context';

export function Footer() {
  const { name, footer, social, sections } = useStore();
  const about = footer?.about || `Considered pieces, made to be kept.`;
  const hasSocial = social && (social.instagram || social.tiktok || social.x);
  return (
    <footer className="site-footer">
      {sections?.newsletter && (
        <div className="footer-cta container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>The List</p>
          <h2 className="display">First looks, private sales, nothing else.</h2>
          <p>Join the list for early access to new arrivals and members-only pricing.</p>
          <form className="news-form" onSubmit={(e) => { e.preventDefault(); toast('Welcome to the list ✦'); (e.target as HTMLFormElement).reset(); }}>
            <input type="email" placeholder="you@email.com" required />
            <button className="btn btn-ink" type="submit">Subscribe</button>
          </form>
        </div>
      )}
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand"><span className="brand-dot" />{name}</div>
            <p>{about}</p>
            {hasSocial && (
              <div className="footer-social">
                {social.instagram && <a href={social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><I.ig /></a>}
                {social.tiktok && <a href={social.tiktok} aria-label="TikTok" target="_blank" rel="noreferrer"><I.ig /></a>}
                {social.x && <a href={social.x} aria-label="X" target="_blank" rel="noreferrer"><I.ig /></a>}
              </div>
            )}
          </div>
          {[
            ['Shop', [['All products', '/products']]],
            ['Help', [['Shipping', '/products'], ['Returns', '/products'], ['Contact', '/products']]],
            ['Company', [['About', '/products']]],
          ].map(([title, items]) => (
            <div className="footer-col" key={title as string}>
              <h5>{title as string}</h5>
              {(items as [string, string][]).map(([l, p]) => (
                <Link key={l} href={p}>{l}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bar">
          <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <span className="powered"><span className="plungee-mark">P</span> Powered by <b>Plungee</b></span>
        </div>
      </div>
    </footer>
  );
}

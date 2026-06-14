'use client';
import Link from 'next/link';
import { I } from './icons';
import { useStore } from './store-context';
import { toast } from './ui-context';

export function Footer() {
  const { name } = useStore();
  return (
    <footer className="site-footer">
      <div className="footer-cta container">
        <p className="eyebrow" style={{ marginBottom: 16 }}>The List</p>
        <h2 className="display">First looks, private sales, nothing else.</h2>
        <p>Join the list for early access to new arrivals and members-only pricing.</p>
        <form className="news-form" onSubmit={(e) => { e.preventDefault(); toast('Welcome to the list ✦'); (e.target as HTMLFormElement).reset(); }}>
          <input type="email" placeholder="you@email.com" required />
          <button className="btn btn-ink" type="submit">Subscribe</button>
        </form>
      </div>
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand"><span className="brand-dot" />{name}</div>
            <p>Considered pieces, made to be kept. Designed for the everyday and the occasion alike.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}><I.ig /></a>
            </div>
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

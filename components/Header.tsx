'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { I } from './icons';
import { useCart } from './cart';
import { useUI } from './ui-context';
import { useStore } from './store-context';

export function Header() {
  const { name } = useStore();
  const { count } = useCart();
  const { openCart } = useUI();
  const path = usePathname();
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  const links: [string, string][] = [
    ['/', 'Home'],
    ['/products', 'Shop'],
  ];

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/products" className="icon-btn menu-toggle" aria-label="Menu"><I.menu /></Link>
        <Link href="/" className="brand"><span className="brand-dot" />{name}</Link>
        <nav className="nav">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={active(href) ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/products" className="icon-btn" aria-label="Search"><I.search /></Link>
          <button className="icon-btn" onClick={openCart} aria-label="Cart">
            <I.cart />{count > 0 && <span className="dot">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

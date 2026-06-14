'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { I } from './icons';
import { useUI } from './ui-context';
import { useStore } from './store-context';

export function MenuDrawer() {
  const { menuOpen, closeMenu } = useUI();
  const { name, logo, social } = useStore();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    if (menuOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  const go = (path: string) => {
    closeMenu();
    router.push(path);
  };

  const hasSocial = social && (social.instagram || social.tiktok || social.x);

  return (
    <>
      <div className={'drawer-scrim' + (menuOpen ? ' open' : '')} onClick={closeMenu} />
      <aside className={'drawer drawer-left' + (menuOpen ? ' open' : '')} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <div className="brand" style={{ margin: 0 }}>
            {logo ? <img src={logo} alt={name} className="brand-logo" /> : <span className="brand-dot" />}
            {name}
          </div>
          <button className="icon-btn" onClick={closeMenu} aria-label="Close"><I.close /></button>
        </div>
        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBlock: 24 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => go('/')} style={{ background: 'none', border: 'none', textAlign: 'left', font: 'inherit', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Home</button>
            <button onClick={() => go('/products')} style={{ background: 'none', border: 'none', textAlign: 'left', font: 'inherit', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>Shop All</button>
          </nav>
          {hasSocial && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: 24 }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Follow Us</p>
              <div className="footer-social" style={{ margin: 0, justifyContent: 'flex-start' }}>
                {social.instagram && <a href={social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><I.ig /></a>}
                {social.tiktok && <a href={social.tiktok} aria-label="TikTok" target="_blank" rel="noreferrer"><I.tiktok /></a>}
                {social.x && <a href={social.x} aria-label="X" target="_blank" rel="noreferrer"><I.x /></a>}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

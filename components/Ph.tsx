import Image from 'next/image';
import type { CSSProperties } from 'react';

// Tonal "lookbook" palette — used when a product has no image (or as art).
const TONES: [string, string][] = [
  ['#d9c7b0', '#b08968'], // sand → cognac
  ['#cfd2cf', '#5b5f5b'], // stone
  ['#3a3733', '#15110d'], // onyx
  ['#e7dcc7', '#c9b48f'], // champagne
  ['#e3ddd2', '#b9b0a0'], // bone
  ['#c9d3d6', '#7f9296'], // mist
];
export function toneFor(seed: number | string): [string, string] {
  const n = typeof seed === 'number' ? seed : String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return TONES[Math.abs(n) % TONES.length];
}

export function Ph({
  seed, label, mono = true, meta, className = '', style,
}: {
  seed: number | string;
  label?: string;
  mono?: boolean;
  meta?: { cat?: string; color?: string };
  className?: string;
  style?: CSSProperties;
}) {
  const [hi, lo] = toneFor(seed);
  return (
    <div className={'ph ph-host ' + className} style={{ ['--t-hi' as string]: hi, ['--t-lo' as string]: lo, ...style }}>
      {mono && label && <div className="ph-mono">{label[0]}</div>}
      {meta && (
        <div className="ph-meta">
          {meta.cat && <span className="ph-cat">{meta.cat}</span>}
          {meta.color && <span className="ph-color">{meta.color}</span>}
        </div>
      )}
    </div>
  );
}

// Real product media: the image if present, else the tonal placeholder.
export function Media({
  src, alt, seed, meta, className = '', sizes, priority,
}: {
  src?: string | null;
  alt: string;
  seed: number | string;
  meta?: { cat?: string; color?: string };
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={'ph-host ' + className} style={{ position: 'absolute', inset: 0 }}>
        <Image src={src} alt={alt} fill sizes={sizes || '(max-width:768px) 50vw, 25vw'} className="object-cover" style={{ objectFit: 'cover' }} priority={priority} />
      </div>
    );
  }
  return <Ph seed={seed} label={alt} meta={meta} className={className} style={{ position: 'absolute', inset: 0 }} />;
}

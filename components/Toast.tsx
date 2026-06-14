'use client';
import { useEffect, useState } from 'react';
import { I } from './icons';
import { _registerToast } from './ui-context';

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    _registerToast((msg: string) => {
      const id = Math.random();
      setItems((x) => [...x, { id, msg }]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 2600);
    });
    return () => _registerToast(null);
  }, []);
  return (
    <div className="toast-wrap">
      {items.map((i) => <div className="toast" key={i.id}><I.check /> {i.msg}</div>)}
    </div>
  );
}

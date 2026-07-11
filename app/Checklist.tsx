'use client';

import { useState } from 'react';

/**
 * Checklist — liste cochable (clic = coche/décoche). État local, non persistant.
 * Utilisée sur « Préparer le voyage » et « Départ ».
 */
export default function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
      {items.map((c, i) => {
        const on = checked.has(i);
        return (
          <li key={c}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              className="flex w-full items-center gap-4 border-b py-4 text-left text-[15px] transition-opacity"
              style={{ borderColor: 'rgba(255,255,255,0.12)', opacity: on ? 0.5 : 1 }}
            >
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px] transition-colors"
                style={{
                  border: `1.5px solid ${on ? 'var(--cava-pink)' : 'rgba(255,255,255,0.4)'}`,
                  background: on ? 'var(--cava-pink)' : 'transparent',
                  color: '#fff',
                }}
              >
                {on ? '✓' : ''}
              </span>
              <span style={{ textDecoration: on ? 'line-through' : 'none' }}>{c}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

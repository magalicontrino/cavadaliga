'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Fenêtre de consultation de la carte — zoom et déplacement.
 * Sur téléphone la carte est trop dense pour être lue en entier : on peut
 * pincer pour zoomer et glisser pour se balader. À la souris : molette + glisser.
 *
 * Le glissement ne doit pas déclencher les liens des épingles : on mesure la
 * distance parcourue et on annule le clic au-delà de DRAG_SLOP.
 */
const MIN = 1;
const MAX = 5;
const DRAG_SLOP = 6; // px

/**
 * Cadrage demandé par la page (clic sur un filtre ou une fiche).
 * fx / fy = position visée, en fraction [0..1] de la carte. `key` change → on recadre.
 */
export type MapFocus = { fx: number; fy: number; scale: number; key: string };

export default function MapViewport({
  children,
  labels,
  focus,
}: {
  children: ReactNode;
  labels: { zoomIn: string; zoomOut: string; reset: string };
  focus?: MapFocus | null;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  // Pointeurs actifs (1 = glisser, 2 = pincer)
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef({ dist: 0, scale: 1, tx: 0, ty: 0, cx: 0, cy: 0 });
  const moved = useRef(0);

  // Empêche de faire sortir la carte de sa fenêtre.
  const clamp = (s: number, x: number, y: number) => {
    const el = box.current;
    if (!el) return { x, y };
    const { width: w, height: h } = el.getBoundingClientRect();
    const mx = ((s - 1) * w) / 2;
    const my = ((s - 1) * h) / 2;
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  };

  const apply = (s: number, x: number, y: number) => {
    const ns = Math.min(MAX, Math.max(MIN, s));
    const c = clamp(ns, x, y);
    setScale(ns);
    setTx(c.x);
    setTy(c.y);
  };

  // Zoom centré sur un point de l'écran (pincement, molette, boutons).
  const zoomAt = (ns: number, clientX: number, clientY: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = clientX - r.left - r.width / 2;
    const py = clientY - r.top - r.height / 2;
    const k = Math.min(MAX, Math.max(MIN, ns)) / scale;
    apply(scale * k, px - (px - tx) * k, py - (py - ty) * k);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      start.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale,
        tx,
        ty,
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
      };
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const prev = pts.current.get(e.pointerId);
    if (!prev) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (start.current.dist > 0) {
        moved.current += DRAG_SLOP + 1; // un pincement n'est jamais un clic
        zoomAt(start.current.scale * (dist / start.current.dist), start.current.cx, start.current.cy);
      }
      return;
    }

    // Glisser : seulement quand la carte est zoomée.
    if (scale <= 1) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    moved.current += Math.hypot(dx, dy);
    apply(scale, tx + dx, ty + dy);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    pts.current.delete(e.pointerId);
    start.current.dist = 0;
  };

  // Un glissement ne doit pas ouvrir le lien de l'épingle survolée.
  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current > DRAG_SLOP) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Molette : zoom UNIQUEMENT avec ctrl/cmd (= le pincement du trackpad).
  // Sans ce garde-fou, faire défiler la page au-dessus de la carte la zoomerait
  // au lieu de la faire défiler. Listener natif car il faut preventDefault
  // (React pose « wheel » en passif).
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: globalThis.WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return; // la page défile normalement
      e.preventDefault();
      zoomAt(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  // Recadrage sur demande de la page : amène le point visé au centre.
  // Un point à dx du centre se retrouve à dx*s + tx → tx = -dx*s pour le centrer.
  const focusKey = focus?.key;
  useEffect(() => {
    if (!focus) return;
    const el = box.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    const s = Math.min(MAX, Math.max(MIN, focus.scale));
    apply(s, -(focus.fx * w - w / 2) * s, -(focus.fy * h - h / 2) * s);
    // Volontairement déclenché par la seule clé : refocaliser à chaque rendu
    // annulerait le zoom manuel de l'utilisateur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  const step = (k: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    zoomAt(scale * k, r.left + r.width / 2, r.top + r.height / 2);
  };

  const zoomed = scale > 1.01;

  return (
    <div className="relative">
      <div
        ref={box}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={onClickCapture}
        className="overflow-hidden"
        style={{ touchAction: zoomed ? 'none' : 'pan-y', cursor: zoomed ? 'grab' : 'default' }}
      >
        <div
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: pts.current.size ? 'none' : 'transform 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {children}
        </div>
      </div>

      {/* Commandes de zoom */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        {/* Revoir toute la carte — en premier. Toujours présent pour que les
            boutons ne sautent pas ; inerte tant qu'on n'a pas zoomé. */}
        <button
          type="button"
          onClick={() => apply(1, 0, 0)}
          disabled={!zoomed}
          aria-label={labels.reset}
          className="cava-zoombtn flex h-10 w-10 items-center justify-center rounded-full disabled:pointer-events-none disabled:opacity-40"
        >
          <Icon name="map" size={16} />
        </button>
        <button
          type="button"
          onClick={() => step(1.5)}
          aria-label={labels.zoomIn}
          className="cava-zoombtn flex h-10 w-10 items-center justify-center rounded-full text-[20px] leading-none"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => step(1 / 1.5)}
          aria-label={labels.zoomOut}
          className="cava-zoombtn flex h-10 w-10 items-center justify-center rounded-full text-[20px] leading-none"
        >
          −
        </button>
      </div>
    </div>
  );
}

// Bandeau défilant pleine largeur, vitesse constante, boucle sans trou.
// Le contenu est dupliqué et l'animation translate de -50% → boucle parfaite.
export default function Marquee({
  items,
  duration = 40,
  className = '',
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  const seq = [...items, ...items];
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden>
      <div className="cava-marquee-track" style={{ ['--cava-marquee-duration' as string]: `${duration}s` }}>
        {seq.map((it, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-6 text-[clamp(1.5rem,4vw,3rem)]" style={{ fontWeight: 500 }}>
            {it}
            <span className="inline-block h-2 w-2 rounded-full align-middle" style={{ background: 'var(--cava-pink)' }} />
          </span>
        ))}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';

// Deterministic pseudo-rating seeded from fabric id so it's stable across renders
function getRating(id = '') {
  const seed = [...String(id)].reduce((s, c) => s + c.charCodeAt(0), 0);
  const rating = 4.5 + ((seed % 5) / 10); // 4.5 – 4.9
  const reviews = 28 + (seed % 60);        // 28 – 87
  return { rating: rating.toFixed(1), reviews };
}

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="w-3 h-3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 1l1.236 2.505L10 3.91l-2 1.949.472 2.752L6 7.25 3.528 8.611 4 5.86 2 3.91l2.764-.405L6 1z"
            fill={i < full || (i === full && half) ? '#C5A059' : 'none'}
            stroke="#C5A059"
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </span>
  );
}

export default function FabricCard({ fabric }) {
  const { rating, reviews } = getRating(fabric.id);
  return (
    <Link to={`/product/${fabric.id}`} className="group block" aria-label={`${fabric.color} ${fabric.name} ${fabric.weave_type} fabric`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image src={fabric.image_url} fittingType="fill" className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
        <div className="absolute inset-0 weave-grain opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/90 bg-foreground/80 px-2 py-1">{fabric.weave_type}</span>
        </div>
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Stars rating={parseFloat(rating)} />
          <span className="font-mono text-[10px] text-[#C5A059]">{rating}</span>
          <span className="font-mono text-[10px] text-muted-foreground">({reviews})</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl leading-tight text-foreground">{fabric.name}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{fabric.brand} · {fabric.fabric_type}</p>
          </div>
          <span className="font-mono text-sm text-foreground whitespace-nowrap">{formatINR(fabric.price)}<span className="text-muted-foreground text-[10px]">/m</span></span>
        </div>
      </div>
    </Link>
  );
}
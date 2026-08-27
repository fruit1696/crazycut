import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';
import { ReviewSummary } from '@/components/Reviews';

export default function FabricCard({ fabric }) {
  return (
    <div className="group block" aria-label={`${fabric.color} ${fabric.name} fabric`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link to={`/product/${fabric.id}`} aria-label={`View ${fabric.name}`}>
          <Image src={fabric.image_url} fittingType="fill" className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
        </Link>
        <div className="pointer-events-none absolute inset-0 weave-grain opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
      <div className="pt-3">
        <Link to={`/product/${fabric.id}#reviews`} className="inline-flex rounded-sm hover:opacity-80" aria-label={`Read reviews for ${fabric.name}`}>
          <ReviewSummary fabricId={fabric.id} />
        </Link>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <Link to={`/product/${fabric.id}`} className="min-w-0">
            <h3 className="font-display text-xl leading-tight text-foreground break-words">{fabric.name}</h3>
            <p className="mt-1 break-words text-sm leading-snug text-muted-foreground">{fabric.color} <span className="font-mono text-[10px] uppercase tracking-[0.12em]">· {fabric.fabric_type}</span></p>
          </Link>
          <span className="self-start font-mono text-sm leading-snug text-foreground sm:shrink-0">{formatINR(fabric.price)}<span className="text-muted-foreground text-[10px]"> / 2-piece set</span></span>
        </div>
      </div>
    </div>
  );
}

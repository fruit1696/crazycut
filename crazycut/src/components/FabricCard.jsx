import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';
import { ReviewSummary } from '@/components/Reviews';

export default function FabricCard({ fabric }) {
  return (
    <div className="group block" aria-label={`${fabric.color} ${fabric.name} ${fabric.weave_type} fabric`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link to={`/product/${fabric.id}`} aria-label={`View ${fabric.name}`}>
          <Image src={fabric.image_url} fittingType="fill" className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
        </Link>
        <div className="absolute inset-0 weave-grain opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/90 bg-foreground/80 px-2 py-1">{fabric.weave_type}</span>
        </div>
      </div>
      <div className="pt-3">
        <Link to={`/product/${fabric.id}#reviews`} className="inline-flex rounded-sm hover:opacity-80" aria-label={`Read reviews for ${fabric.name}`}>
          <ReviewSummary fabricId={fabric.id} />
        </Link>
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${fabric.id}`} className="min-w-0">
                            <h3 className="font-display text-xl leading-tight text-foreground">{fabric.brand}</h3>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{fabric.name} · {fabric.fabric_type}</p>
          </Link>
          <span className="font-mono text-sm text-foreground whitespace-nowrap">{formatINR(fabric.price)}<span className="text-muted-foreground text-[10px]">/m</span></span>
        </div>
      </div>
    </div>
  );
}
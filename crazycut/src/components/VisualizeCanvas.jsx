import { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';
import { base44 } from '@/api/base44Client';

export default function VisualizeCanvas({ fabricImage, garmentType, fabricName, fabricType, brand }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setUrl(null);
    setError(null);
    (async () => {
      try {
        const res = await base44.functions.invoke('VisualizeGarment', {
          fabric_image_url: fabricImage,
          garment_type: garmentType,
          fabric_name: fabricName,
          fabric_type: fabricType,
          brand,
        });
        if (active) {
          setUrl(res.data.image_url);
          setLoading(false);
        }
      } catch (e) {
        if (active) {
          setError('Could not render the drape. Please try again.');
          setLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, [fabricImage, garmentType, fabricName, fabricType, brand]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/40">
        <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin mb-4" />
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/80 capitalize">Rendering photoreal drape · {garmentType}</p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground mt-1">AI inpainting fabric onto model…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="font-display text-2xl mb-4">{error}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Close and try another fabric.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-muted/40 overflow-hidden">
      <Image src={url} fittingType="fill" className="w-full h-full animate-fade-in" />
    </div>
  );
}
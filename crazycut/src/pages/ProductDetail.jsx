import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, Check } from 'lucide-react';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';
import { useCart } from '@/lib/cartStore';

import { useTranslation } from 'react-i18next';


export default function ProductDetail() {
    const { id } = useParams();
    const { addItem, setOpen } = useCart();
    const [fabric, setFabric] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [garment, setGarment] = useState('Shirt');
    const [zoom, setZoom] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try { 
                const { data, error } = await supabase.from('fabrics').select('*').eq('id', id).single();
                if (error) throw new Error(error.message);
                setFabric(fabricToFrontend(data)); 
            }
            catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, [id]);

    if (loading) return <div className="pt-[112px] min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" /></div>;
    if (!fabric) return <div className="pt-[112px] min-h-screen flex flex-col items-center justify-center gap-4"><p className="font-display text-4xl">{t('product.notFound')}</p><Link to="/shop" className="btn-loom-ghost">{t('product.backToGallery')}</Link></div>;

    const specs = [
        [t('product.specMaterial'), fabric.material_composition],
        [t('product.specWeave'), fabric.weave_type],
        [t('product.specWidth'), fabric.width_inches ? `${fabric.width_inches}″` : '—'],
        [t('product.specWeight'), fabric.weight],
        [t('product.specOrigin'), fabric.origin],
        [t('product.specPattern'), fabric.pattern],
    ];

    const garments = [t('product.garmentShirt'), t('product.garmentPants')];

    return (
        <div className="pt-[112px]">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-5 sm:py-6">
                <Link to="/shop" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" />{t('product.backToGallery')}</Link>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
                    <div>
                        <div className="relative aspect-square overflow-hidden bg-muted cursor-zoom-in" onClick={() => setZoom(z => !z)}>
                            <Image src={fabric.image_url} fittingType="fill" className={`w-full h-full transition-transform duration-700 ${zoom ? 'scale-150' : 'scale-100'}`} />
                            <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-background/80 bg-foreground/70 px-2 py-1">{t('product.macroZoom')}</div>
                        </div>
                        <div className="mt-4 aspect-[3/1] overflow-hidden bg-muted">
                            <Image src={fabric.detail_image_url || fabric.image_url} fittingType="fill" className="w-full h-full" />
                        </div>
                    </div>
                    <div className="lg:py-4">
                        <p className="eyebrow mb-4">{fabric.brand} · {fabric.sku}</p>
                        {/* Star Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const seed = [...String(fabric.id || '')].reduce((s, c) => s + c.charCodeAt(0), 0);
                                    const rating = 4.5 + ((seed % 5) / 10);
                                    const full = Math.floor(rating);
                                    const half = rating - full >= 0.5;
                                    return (
                                        <svg key={i} viewBox="0 0 12 12" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 1l1.236 2.505L10 3.91l-2 1.949.472 2.752L6 7.25 3.528 8.611 4 5.86 2 3.91l2.764-.405L6 1z"
                                                fill={i < full || (i === full && half) ? '#C5A059' : 'none'}
                                                stroke="#C5A059" strokeWidth="0.8" />
                                        </svg>
                                    );
                                })}
                            </span>
                            <span className="font-mono text-sm text-[#C5A059]">
                                {(4.5 + ((([...String(fabric.id || '')].reduce((s, c) => s + c.charCodeAt(0), 0)) % 5) / 10)).toFixed(1)}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                                ({28 + (([...String(fabric.id || '')].reduce((s, c) => s + c.charCodeAt(0), 0)) % 60)} reviews)
                            </span>
                        </div>
                        <h1 className="font-display text-5xl sm:text-6xl leading-[0.95]">{fabric.name}</h1>
                        <p className="mt-6 font-display text-3xl text-accent">{formatINR(fabric.price)}<span className="text-base text-muted-foreground font-body"> {t('product.perMetre')}</span></p>
                        <p className="mt-6 text-foreground/70 text-lg leading-relaxed max-w-md">{fabric.description}</p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            <span className="text-accent">{t('product.freeShipping')}</span>
                            <span className="text-accent">{t('product.cod')}</span>
                        </div>



                        <div className="mt-6 border-t border-border pt-5">
                            <p className="eyebrow mb-3">{t('product.tailoringIntent')}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {garments.map(g => (
                                    <button key={g} onClick={() => setGarment(g)} className={`font-mono text-xs uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${garment === g ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground/70 hover:border-foreground'}`}>{g}</button>
                                ))}
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-border">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-muted" aria-label="Decrease metres"><Minus className="w-4 h-4" /></button>
                                    <span className="px-5 font-mono">{qty} m</span>
                                    <button onClick={() => setQty(q => q + 1)} className="px-3 py-3 hover:bg-muted" aria-label="Increase metres"><Plus className="w-4 h-4" /></button>
                                </div>
                                <button onClick={() => addItem({ ...fabric }, qty, garment)} className="btn-loom-ghost flex-1">{t('product.addCutPiece')} <ArrowRight className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => {
                                const STORE_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || "+919425333460";
                                const text = `Hi, I'm interested in ${fabric.brand} ${fabric.name} (SKU: ${fabric.sku}), ₹${fabric.price}/m. I would like to know about availability and ordering. Product: ${window.location.href}${qty > 1 ? `\n\nQuantity desired: ${qty}m` : ''}`;
                                window.open(`https://wa.me/${STORE_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }} className="mt-4 w-full bg-[#128C7E] text-white font-mono text-xs uppercase tracking-[0.14em] py-4 px-6 flex items-center justify-center gap-3 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                {t('product.whatsappOrder')}
                            </button>
                            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><Check className="w-3.5 h-3.5 text-accent" /> {fabric.stock_quantity > 0 ? t('product.inStock', { count: fabric.stock_quantity }) : t('product.mto')}</p>
                        </div>

                        <div className="mt-6 border-t border-border pt-5">
                            <p className="eyebrow mb-3">{t('product.specifications')}</p>
                            <dl className="grid grid-cols-2 gap-y-4">
                                {specs.map(([k, v]) => (
                                    <div key={k} className="flex flex-col gap-1 pb-4 border-b border-border">
                                        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
                                        <dd className="font-display text-lg">{v || '—'}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

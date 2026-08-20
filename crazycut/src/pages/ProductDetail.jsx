import { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import { formatINR } from '@/lib/format';
import { useCart } from '@/lib/cartStore';
import Reviews, { ReviewSummary } from '@/components/Reviews';

import { useTranslation } from 'react-i18next';


export default function ProductDetail() {
    const { id } = useParams();
    const { addItem, setOpen } = useCart();
    const [fabric, setFabric] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
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

    useEffect(() => {
        if (fabric && location.hash === '#reviews') {
            document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [fabric, location.hash]);

    if (loading) return <div className="pt-[112px] min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" /></div>;
    if (!fabric) return <div className="pt-[112px] min-h-screen flex flex-col items-center justify-center gap-4"><p className="font-display text-4xl">{t('product.notFound')}</p><Link to="/shop" className="btn-loom-ghost">{t('product.backToGallery')}</Link></div>;

    const specs = [
        [t('product.specMaterial'), fabric.material_composition],
        [t('product.specColor'), fabric.color],
        [t('product.specWeight'), fabric.weight],
        [t('product.specPattern'), fabric.pattern],
    ];

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
                        <Link to="#reviews" className="inline-flex mb-4 rounded-sm hover:opacity-80" aria-label="Read customer reviews">
                            <ReviewSummary fabricId={fabric.id} />
                        </Link>
                        <h1 className="font-display text-5xl sm:text-6xl leading-[0.95]">{fabric.name}</h1>
                        <p className="mt-6 font-display text-3xl text-accent">{formatINR(fabric.price)}<span className="text-base text-muted-foreground font-body"> / 2-piece set</span></p>
                        <p className="mt-6 text-foreground/70 text-lg leading-relaxed max-w-md">{fabric.description}</p>
                        <p className="mt-5 border-y border-border py-4 text-foreground/75 leading-relaxed max-w-md">You receive 2 pieces of Raymond shirt fabric. Take them to your tailor and get your shirt stitched your way.</p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            <span className="text-accent">{t('product.freeShipping')}</span>
                            <span className="text-accent">{t('product.cod')}</span>
                        </div>



                        <div className="mt-6 border-t border-border pt-5">
                            <button onClick={() => addItem({ ...fabric })} className="btn-loom-ghost w-full">{t('product.addCutPiece')} <ArrowRight className="w-4 h-4" /></button>
                            <button onClick={() => {
                                addItem({ ...fabric });
                                setOpen(false);
                                navigate('/checkout');
                            }} className="btn-loom-solid mt-4 w-full">
                                {t('product.buyNow')}
                            </button>
                            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><Check className="w-3.5 h-3.5 text-accent" /> {fabric.stock_quantity > 0 ? t('product.inStock') : t('product.mto')}</p>
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
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-16">
                <Reviews fabricId={fabric.id} />
            </div>

        </div>
    );
}

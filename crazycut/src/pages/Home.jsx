import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Scissors } from 'lucide-react';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import { Image } from '@/components/ui/image';
import FabricCard from '@/components/FabricCard';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [parallax, setParallax] = useState({ x: 0, y: 0 });
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase.from('fabrics').select('*').order('created_date', { ascending: false }).limit(50);
                if (error) throw new Error(error.message);
                setFabrics((data || []).map(fabricToFrontend));
            }
            catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const onMove = (e) => {
            setParallax({ x: (e.clientX / window.innerWidth - 0.5) * 24, y: (e.clientY / window.innerHeight - 0.5) * 24 });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const featured = fabrics.filter(f => f.featured).slice(0, 8);

    const pillars = [
        { icon: Scissors, title: t('atelier.pillar1Title'), desc: t('atelier.pillar1Desc') },
        { icon: BadgeCheck, title: t('atelier.pillar2Title'), desc: t('atelier.pillar2Desc') },
        { icon: ArrowRight, title: t('atelier.pillar3Title'), desc: t('atelier.pillar3Desc') },
    ];

    const studioSpecs = [
        t('studio.spec1'),
        t('studio.spec2'),
        t('studio.spec3'),
    ];

    return (
        <div>
            <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-[112px]">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="/background.jpeg" className="w-full h-full object-cover animate-slow-zoom" alt="Background" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(253,251,247,0.95)] via-[rgba(253,251,247,0.7)] to-transparent pointer-events-none" />
                <div className="absolute inset-0 weave-grain opacity-30 pointer-events-none" />

                <div className="relative mx-auto max-w-[1400px] w-full px-6 lg:px-10 z-10">
                    <div className="max-w-xl lg:max-w-[50%] animate-slide-fade-in">
                        <div className="eyebrow mb-6 flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                            <span>Premium Fabrics</span>
                            <span className="hidden md:inline mx-2">·</span>
                            <span>Original Cutpieces</span>
                        </div>
                        <h2 className="font-display text-[3.4rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] tracking-tight text-balance">
                            {t('hero.italic') === 'Elegance' ? (
                                <>Branded Fabrics<br /> Delivered To Your Doorstep</>
                            ) : (
                                <>धागे से बुनें अपना <span className="italic">{t('hero.italic')}</span>।</>
                            )}
                        </h2>
                        <p className="mt-7 text-foreground/80 text-lg leading-relaxed">
                            {t('hero.subtitle')}
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Link to="/shop" className="btn-loom-solid">{t('hero.ctaGallery')} <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-1.5 md:gap-0 font-mono text-[10px] tracking-widest text-foreground/60 uppercase">
                            <span>✓ 100% Original Mill Stamped</span>
                            <span className="hidden md:inline mx-3">·</span>
                            <span>✓ 15+ Years Trust</span>
                            <span className="hidden md:inline mx-3">·</span>
                            <span>✓ Pan-India Delivery</span>
                        </div>
                    </div>
                </div>
                {/* Fade to background color at the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                    <div className="thread-line h-px w-24 animate-pulse-thread" />
                </div>
            </section>

            <section className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="eyebrow mb-4">{t('gallery.eyebrow')}</p>
                            <h2 className="font-display text-4xl sm:text-5xl">{t('gallery.headline')}</h2>
                        </div>
                        <Link to="/shop" className="hidden sm:inline-flex btn-loom-ghost">{t('gallery.viewAll')} <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {featured.map((f, i) => (
                                <div key={f.id} className={i >= 4 ? 'hidden lg:block' : ''}>
                                    <FabricCard fabric={f} />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-12 sm:hidden"><Link to="/shop" className="btn-loom-ghost w-full">{t('gallery.viewAll')} <ArrowRight className="w-4 h-4" /></Link></div>
                </div>
            </section>

            <section id="atelier" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
                    <p className="eyebrow mb-6">{t('atelier.eyebrow')}</p>
                    <p className="font-display text-3xl sm:text-4xl lg:text-5xl leading-snug text-balance">
                        {t('atelier.manifesto')}
                    </p>
                    <div className="mt-14 mb-4 overflow-hidden shadow-2xl relative bg-muted group">
                        <img src="/tap.jpeg" alt="The Style Studio" className="w-full h-auto max-h-[70vh] object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-all duration-500" style={{fontFamily: 'var(--font-mono)'}}>
                                Explore Fabrics <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-16 grid sm:grid-cols-3 gap-10 text-left">
                        {pillars.map(f => (
                            <div key={f.title} className="border-t border-border pt-6">
                                <f.icon className="w-6 h-6 text-accent mb-4" />
                                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="visualize" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
                    <div>
                        <p className="eyebrow mb-6">{t('studio.eyebrow')}</p>
                        <h2 className="font-display text-4xl sm:text-5xl leading-tight text-balance">{t('studio.headline')}</h2>
                        <p className="mt-6 text-foreground/70 text-lg max-w-md leading-relaxed">{t('studio.desc')}</p>
                        <ul className="mt-8 space-y-3">
                            {studioSpecs.map(spec => (
                                <li key={spec} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-foreground/80"><span className="w-6 h-px bg-accent" />{spec}</li>
                            ))}
                        </ul>
                        <Link to="/shop" className="btn-loom-solid mt-10">{t('studio.cta')} <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['/pants.jpeg', '/Linen.jpeg', '/gifts.jpeg', '/blazerr.jpeg'].map((img, i) => (
                            <Link key={img} to="/shop" className={`group relative overflow-hidden bg-background border border-border aspect-[3/4] ${i % 2 === 1 ? 'mt-8' : ''}`}>
                                <Image src={img} fittingType="fill" className="w-full h-full transition-transform duration-1000 group-hover:scale-105" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}

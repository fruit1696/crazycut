import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CheckCircle, ChevronDown, IndianRupee, MessageCircle, MousePointerClick, Package, Scissors, ShieldCheck, Shirt, Truck } from 'lucide-react';
import { supabase, fabricToFrontend } from '@/api/supabaseClient';
import FabricCard from '@/components/FabricCard';
import RaymondWordmark, { RaymondText } from '@/components/RaymondWordmark';
import MillStampIcon from '@/components/MillStampIcon';
import { useTranslation } from 'react-i18next';
import raymondImage from '../../raymond.jpeg';
import pileImage from '../../pile.jpeg';

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
    const heroSubtitle = t('hero.subtitle');
    const heroPrice = 'Starting at ₹400.';

    const pillars = [
        { icon: BadgeCheck, title: t('atelier.pillar1Title'), desc: t('atelier.pillar1Desc') },
        { icon: Scissors, title: t('atelier.pillar2Title'), desc: t('atelier.pillar2Desc') },
        { icon: Truck, title: t('atelier.pillar3Title'), desc: t('atelier.pillar3Desc') },
    ];

    const howItWorksSteps = [
        { icon: Package, label: 'STEP 1', title: '2 Pieces of Raymond Fabric', desc: 'What you receive' },
        { icon: Scissors, label: 'STEP 2', title: 'Take It to Your Tailor', desc: 'Give the fabric to your trusted master cutter.' },
        { icon: Shirt, label: 'STEP 3', title: 'Get Your Shirt Stitched', desc: 'Cut & sewn to order' },
        { icon: CheckCircle, label: 'STEP 4', title: 'Your Shirt. Your Fit.', desc: 'Wear it your way' },
    ];

    const howToOrderSteps = [
        { icon: MousePointerClick, label: '1', title: 'Choose', desc: 'Browse Raymond fabrics and open the one you like.' },
        { icon: MessageCircle, label: '2', title: 'Just Checkout', desc: 'Enter your delivery details. That’s all.' },
        { icon: IndianRupee, label: '3', title: 'Cash on Delivery', desc: 'Confirm product, quantity & address. Pay when it arrives.' },
        { icon: Truck, label: '4', title: 'Delivered', desc: 'Your 2-piece set ships from Khargone to your door.' },
    ];

    return (
        <div>
            <section id="landing-hero" className="relative flex min-h-[100svh] items-start overflow-hidden pt-[176px] sm:pt-[330px] lg:min-h-[90vh] lg:items-center lg:pt-[112px]">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="/chatgptback.jpeg" alt="" className="pointer-events-none h-full w-full scale-[1.08] object-cover object-[62%_50%] lg:origin-top-left lg:scale-[1.18] lg:object-[58%_52%]" aria-hidden="true" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(253,251,247,0.96)] via-[rgba(253,251,247,0.64)] to-[rgba(253,251,247,0.06)]" />
                <div className="absolute inset-0 weave-grain opacity-30 pointer-events-none" />

                <div className="relative z-10 mx-auto w-full max-w-[1400px] px-[30px] lg:px-10">
                    <div className="max-w-[22rem] animate-slide-fade-in sm:max-w-xl lg:max-w-[50%]">
                        <div className="eyebrow mb-6 flex flex-col gap-1 font-semibold leading-relaxed !text-[#86141a] lg:mb-4 lg:flex-row lg:items-center lg:gap-0">
                            <span>2-PIECE SETS</span>
                            <span className="mx-2 hidden lg:inline">·</span>
                            <span>RAYMOND SHIRT FABRICS</span>
                            <span className="mt-3 h-0.5 w-12 bg-[#86141a] lg:hidden" aria-hidden="true" />
                        </div>
                        <h2 className="font-display text-[3.4rem] sm:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] tracking-tight text-balance">
                            {t('hero.italic') === 'Elegance' ? (
                                <>
                                    <span className="flex items-center whitespace-nowrap">
                                        <RaymondWordmark className="mr-[0.12em] h-[0.72em]" />
                                        <span>Fabrics.</span>
                                    </span>
                                    <span className="block">Crazy Deals.</span>
                                </>
                            ) : (
                                <>धागे से बुनें अपना <span className="italic">{t('hero.italic')}</span>।</>
                            )}
                        </h2>
                        <p className="mt-7 max-w-[23rem] text-base leading-[1.65] text-foreground/85 sm:text-lg lg:mt-5">
                            {heroSubtitle.includes(heroPrice) ? (
                                <>{heroSubtitle.replace(heroPrice, '')}<span className="mt-5 block whitespace-nowrap font-bold text-[#86141a]">{heroPrice}</span></>
                            ) : heroSubtitle}
                        </p>
                        <div className="mt-6 flex flex-col items-start gap-3">
                            <Link to="/shop" className="btn-loom-solid w-full rounded-md py-4 lg:w-auto">{t('hero.ctaGallery')} <ArrowRight className="h-5 w-5" /></Link>
                        </div>
                        <div className="mt-7 flex flex-col gap-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/80 lg:mt-6 lg:flex-row lg:items-center lg:gap-0">
                            <span className="flex items-center gap-3"><MillStampIcon className="h-7 w-6 shrink-0 text-accent" />100% Original Mill Stamped</span>
                            <span className="mx-3 hidden lg:inline">·</span>
                            <span className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />10+ Years Trust</span>
                            <span className="mx-3 hidden lg:inline">·</span>
                            <span className="flex items-center gap-3"><Package className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />Limited Clearance Stock</span>
                        </div>
                    </div>
                </div>
                {/* Fade to background color at the bottom */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-background via-background/75 to-transparent sm:h-40 lg:h-48" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
                    <a href="#featured-fabrics" aria-label="Scroll to featured fabrics" className="text-white drop-shadow-md transition-opacity hover:opacity-75">
                        <ChevronDown className="h-6 w-6 animate-bounce" />
                    </a>
                </div>
            </section>

            <section id="featured-fabrics" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex flex-col items-center justify-center mb-12 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
                        <div>
                            <p className="eyebrow mb-4"><RaymondText logoClassName="h-[1.35em]">{t('gallery.eyebrow')}</RaymondText></p>
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

            <section id="why-buy-it" className="bg-foreground py-14 text-background lg:py-24">
                <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-10">
                    <p className="eyebrow mb-4"></p>
                    <h2 className="font-display text-4xl leading-tight text-balance sm:text-5xl lg:text-6xl">
                        <span className="inline-flex items-center whitespace-nowrap">
                            <RaymondWordmark className="mr-[0.12em] h-[0.72em]" />
                            <span>Quality.</span>
                        </span>{' '}Just ₹400
                    </h2>
                    <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-background/75">
                        Why buy an entire thaan when you only need enough fabric for one shirt?
                    </p>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-background/75">
                        Get <strong className="font-semibold text-background">1.8 metres of genuine Raymond fabric</strong> pre-cut into 2 pieces and ready to take to your tailor.
                    </p>
                    <p className="mt-7 font-display text-2xl sm:text-3xl">
                        Trusted brand. Affordable price.
                    </p>

                    <div className="mt-12 grid border-y border-background/20 sm:grid-cols-3">
                        <div className="px-5 py-7 sm:border-r sm:border-background/20">
                            <p className="font-display text-xl">1.8 metres</p>
                            <p className="mt-1 text-sm text-background/60">Enough for 1 shirt</p>
                        </div>
                        <div className="border-t border-background/20 px-5 py-7 sm:border-r sm:border-t-0">
                            <p className="font-display text-xl"><RaymondText logoClassName="h-[1em]">Raymond fabric</RaymondText></p>
                            <p className="mt-1 text-sm text-background/60">Genuine quality</p>
                        </div>
                        <div className="border-t border-background/20 px-5 py-7 sm:border-t-0">
                            <p className="font-display text-xl">Only ₹400 per set</p>
                            <p className="mt-1 text-sm text-background/60">Choose your own tailor &amp; style</p>
                        </div>
                    </div>

                    <p className="mx-auto mt-10 max-w-3xl font-display text-2xl leading-snug text-balance sm:text-3xl">
                        The brand you trust. The quality you expect. The price you’ll love.
                    </p>
                </div>
            </section>

            <section id="how-it-works" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
                    <p className="eyebrow mb-4">HOW IT WORKS</p>
                    <h2 className="font-display text-4xl sm:text-5xl leading-tight text-balance">From Fabric to Your Shirt</h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {howItWorksSteps.map(({ icon: Icon, label, title, desc }) => (
                            <div key={label} className="border-t border-border pt-6 px-2">
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                                </div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{label}</p>
                                <h3 className="mt-3 font-display text-2xl leading-tight"><RaymondText logoClassName="h-[0.95em]">{title}</RaymondText></h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-12 font-display text-2xl sm:text-3xl leading-snug text-balance">We provide the soul. Your tailor provides the fit.</p>
                </div>
            </section>

            <section className="px-6 py-4 lg:px-10 lg:py-8">
                <div className="relative mx-auto max-w-[1400px] overflow-hidden bg-muted group">
                    <img src={pileImage} alt="Raymond fabric collection" className="w-full h-auto max-h-[70vh] object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-all duration-500" style={{fontFamily: 'var(--font-mono)'}}>
                            Explore collection <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section id="how-to-order" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1100px] px-2 sm:px-6 lg:px-10 text-center">
                    <p className="eyebrow mb-4">HOW TO ORDER</p>
                    {/* <h2 className="whitespace-nowrap font-display text-4xl leading-tight sm:text-5xl max-md:text-[1.35rem]">
                        Choose <span className="mx-2 max-md:mx-0.5">→</span> WhatsApp <span className="mx-2 max-md:mx-0.5">→</span> COD <span className="mx-2 max-md:mx-0.5">→</span> Delivered
                    </h2> */}
                    {/* <p className="mt-5 text-foreground/70 text-lg leading-relaxed text-balance">Simple, fast, and secure ordering in 4 easy steps.</p> */}
                    <h2 className="font-display text-4xl sm:text-5xl leading-tight text-balance"></h2>
                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {howToOrderSteps.map(({ icon: Icon, label, title, desc }) => (
                            <div key={label} className="border-t border-border pt-6 px-2">
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                                    <Icon className={`h-6 w-6 ${label === '4' ? 'animate-delivery-drive' : ''}`} strokeWidth={1.5} />
                                </div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{label}</p>
                                <h3 className="mt-3 font-display text-2xl leading-tight">{title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="atelier" className="py-12 lg:py-20">
                <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
                    <p className="eyebrow mb-6">{t('atelier.eyebrow')}</p>
                    <p className="font-display text-3xl sm:text-4xl lg:text-5xl leading-snug text-balance">
                        {t('atelier.manifesto')}
                    </p>
                    <div className="mt-14 mb-4 overflow-hidden shadow-2xl relative bg-muted group">
                        <img src={raymondImage} alt="Raymond fabric" className="w-full h-auto max-h-[70vh] object-cover group-hover:scale-105 transition-transform duration-1000" />
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
                                <div className="relative mb-4 h-6 overflow-hidden">
                                    <f.icon className={`h-6 w-6 text-accent ${f.icon === Truck ? 'absolute animate-atelier-truck' : ''}`} />
                                </div>
                                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

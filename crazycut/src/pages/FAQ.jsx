import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Reveal from '@/components/Reveal';

const CATEGORIES = [
    {
        title: 'Fabric & Quality',
        items: [
            { q: 'What is the fabric composition?', a: 'Every cut piece lists its exact material composition — Rayon, Poly-Viscose, cotton blends, wool, linen or silk — alongside the weave type and width. Find these on each product page under Specifications, so you know precisely what your tailor is working with.' },
            { q: 'How do I know the fabric thickness/weight?', a: 'Each fabric is tagged Lightweight, Midweight or Heavyweight. Lightweight cloth breathes for summer shirts; heavyweight wool holds structure for blazers and trousers. The weight appears on the product card and in the spec table.' },
            { q: 'Is the fabric suitable for shirts, pants, blazers, etc.?', a: 'Yes — most cut pieces are versatile. On every product page, the "What Can Be Stitched?" gallery shows the garments each cloth is suited to, and the "Visualize It" studio lets you preview the drape on a shirt or trouser before you buy.' },
            { q: 'Will the color look exactly like the photos?', a: 'We photograph fabrics flat-lit to show true color and weave, but screens render tones differently and natural dyes shift with light. Expect a close, honest match — never an exact pixel-for-pixel one. Our detail image helps you read the true shade.' },
        ],
    },
    {
        title: 'Cut Pieces',
        items: [
            { q: 'What is a 2-piece set?', a: 'Each product is a fixed set of two Raymond shirt-fabric pieces: one piece for the front and back, and one piece for the sleeves and collar. Take both pieces to your tailor and have your shirt stitched your way.' },
            { q: 'How many pieces do I receive?', a: 'Every product order contains one 2-piece Raymond shirt-fabric set. You can add multiple sets of the same fabric or choose different fabrics in your cart.' },
            { q: 'Can I order multiple sets?', a: 'Absolutely. Use the cart controls to add as many 2-piece sets as you need, then check out together in a single order.' },
            { q: 'Can I request a specific cut or length?', a: 'The sets are pre-cut and sold as shown. For tailoring questions or a special request, contact us on WhatsApp before ordering.' },
        ],
    },
    {
        title: 'Shipping',
        items: [
            { q: 'How long does delivery take?', a: 'Orders are dispatched within 24–48 hours and reach most Indian pincodes in 3–6 business days. Remote pincodes may take a day or two longer. You will receive a confirmation once your cut piece is on its way.' },
            { q: 'Where do you ship?', a: 'We ship across India with free shipping on every order. Cash on Delivery is available nationwide so you pay only when the fabric reaches your door.' },
            { q: 'How can I track my order?', a: 'Visit the Orders page once signed in to see the live status — pending, processing, shipped, or delivered — of every cut piece you have ordered with us.' },
        ],
    },
    {
        title: 'Returns & Exchanges',
        items: [
            { q: 'Can I return fabric?', a: 'Because each 2-piece set is pre-cut and prepared to order, it cannot be returned for a change of mind. If something is genuinely wrong with your order, we will make it right — see below.' },
            { q: 'What happens if the fabric arrives damaged?', a: 'If your fabric arrives torn, soiled, or flawed, contact us within 48 hours of delivery with a photo and we will replace the cut piece or refund it in full — no argument.' },
            { q: 'What if the color or quality is different from what I expected?', a: 'We work hard to represent each weave honestly, but if the cloth you receive is materially different from its listing — wrong fabric type, wrong weight, or a damaged weave — reach out within 48 hours and we will resolve it with a replacement or refund.' },
        ],
    },
    {
        title: 'Using the Fabric',
        items: [
            { q: 'What can I stitch from this fabric?', a: 'Almost anything. The "What Can Be Stitched?" gallery on each product page suggests the silhouettes best suited to that cloth — from linen shirts and formal trousers to structured blazers' },
            { q: 'What does each piece cover?', a: 'Piece 1 covers the front and back of the shirt. Piece 2 covers the sleeves and collar. Your tailor uses both pieces to stitch the finished shirt.' },
            { q: 'Is this fabric suitable for formal tailoring?', a: 'Mid- and heavyweight wools and fine poplins hold the structure and press formal tailoring demands. Check the weight and weave on the product page — when a fabric is flagged Heavyweight or Worsted, it is built to hold a crease and a collar.' },
        ],
    },
];

export default function FAQ() {
    const total = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

    return (
        <div className="pt-[112px]">
            {/* Header */}
            <section className="relative border-b border-border py-14 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 weave-grain opacity-40" />
                <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
                    <Reveal>
                        <p className="eyebrow mb-4">Need Help?</p>
                        <div className="flex items-end justify-between gap-8">
                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-balance">Questions, answered.</h1>
                            <p className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground text-right max-w-[14rem]">
                                {total} entries · fabric, cut pieces, shipping & returns
                            </p>
                        </div>
                        <p className="mt-5 max-w-xl text-foreground/70 text-lg leading-relaxed">
                            Everything you need to know about our cut pieces — composition, lengths, delivery, and what each cloth can become.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Accordion body */}
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
                    <div className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-16">
                        {/* Category rail */}
                        <aside className="lg:sticky lg:top-[120px] self-start">
                            <p className="eyebrow mb-4">Topics</p>
                            <nav className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                                {CATEGORIES.map((c, i) => (
                                    <a key={c.title} href={`#cat-${i}`} className="flex-shrink-0 lg:flex-shrink font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground transition-colors py-1">
                                        {c.title}
                                    </a>
                                ))}
                            </nav>
                        </aside>

                        {/* Accordions */}
                        <div className="space-y-14">
                            {CATEGORIES.map((c, i) => (
                                <div key={c.title} id={`cat-${i}`} className="scroll-mt-[120px]">
                                    <Reveal>
                                        <div className="flex items-center gap-5 mb-5">
                                            <HelpCircle className="w-4 h-4 text-accent" />
                                            <h2 className="font-display text-2xl sm:text-3xl">{c.title}</h2>
                                            <span className="thread-line h-px flex-1" />
                                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.items.length}</span>
                                        </div>
                                    </Reveal>
                                    <Reveal delay={0.05}>
                                        <Accordion type="single" collapsible className="border-t border-border">
                                            {c.items.map((it, idx) => (
                                                <AccordionItem key={it.q} value={`${i}-${idx}`}>
                                                    <AccordionTrigger className="hover:no-underline py-5 group">
                                                        <span className="font-display text-lg sm:text-xl text-foreground group-hover:text-accent transition-colors text-left pr-4">{it.q}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-foreground/70 text-base leading-relaxed max-w-2xl">
                                                        {it.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </Reveal>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Still have questions CTA */}
            <section className="py-14 lg:py-20 bg-muted/30 border-t border-border">
                <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
                    <Reveal>
                        <p className="eyebrow mb-4">Still curious?</p>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-balance">We will talk you through it.</h2>
                        <p className="mt-4 text-foreground/70 text-lg max-w-xl mx-auto">Browse the gallery, pick a cut piece, or message us on WhatsApp — we reply fast.</p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link to="/shop" className="btn-loom-solid">Shop cut pieces <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
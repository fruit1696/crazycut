import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/Reveal';

const SECTIONS = [
  {
    title: 'Acceptance of terms',
    body: 'By accessing or purchasing from crazycutpiece.com, you agree to these Terms of Service. If you do not agree, please do not use the site or place orders.',
  },
  {
    title: 'Products & pricing',
    body: 'We sell unstitched cut-piece fabrics by the metre. All fabrics are subject to availability. Prices are listed in Indian Rupees (₹) and may change without notice. We make every effort to display colours and weaves accurately, but natural variation between screen and cloth may occur.',
  },
  {
    title: 'Orders',
    body: 'Placing an order is an offer to purchase. We may accept or decline any order at our discretion. Once accepted, you will receive a confirmation by email or message. Stock shortages may result in cancellation and a full refund of any advance paid.',
  },
  {
    title: 'Payment',
    body: 'Cash on Delivery (COD) is the primary payment method for the Indian market. Where enabled, additional online methods may be offered at checkout. COD orders must be paid in full to the courier on delivery before the package is opened.',
  },
  {
    title: 'Shipping & delivery',
    body: 'We ship across India through partner couriers. Estimated delivery times are indicative and not guaranteed. Delivery addresses must be accurate; we are not liable for delays or loss caused by incorrect information provided at checkout.',
  },
  {
    title: 'Returns & exchanges',
    body: 'As fabrics are cut to order, cut pieces are non-returnable unless damaged or incorrect on arrival. Please inspect your order on delivery and report any issue within 48 hours with photographs so we can arrange a replacement or refund.',
  },
  {
    title: 'Visualize It tool',
    body: 'Our AI-powered visualization renders an illustrative preview of how a fabric may appear stitched. It is a guide to drape, colour, and pattern — not a guarantee of the finished garment. Tailoring outcomes depend on your chosen tailor.',
  },
  {
    title: 'Intellectual property',
    body: 'All site content, imagery, and branding are the property of CrazyCutPiece and may not be reproduced without written permission. Product photography is representative of the fabric shown.',
  },
  {
    title: 'Limitation of liability',
    body: 'To the fullest extent permitted by law, our liability for any order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses arising from the use of the site or our products.',
  },
  {
    title: 'Changes to these terms',
    body: 'We may update these Terms from time to time. The latest version will always be posted on this page with the revised date. Continued use of the site after changes constitutes acceptance of the updated terms.',
  },
];

export default function Terms() {
  return (
    <div className="pt-[112px]">
      <section className="relative border-b border-border py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 weave-grain opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" />Back to the atelier</Link>
            <p className="eyebrow mb-4">Legal</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-balance">Terms of Service</h1>
            <p className="mt-5 max-w-xl text-foreground/70 text-lg leading-relaxed">The rules of the cut piece — what to expect when you shop CrazyCutPiece.</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Last updated · August 2026</p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-[800px] px-6 lg:px-10">
          <div className="border-t border-border">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title}>
                <div className="py-8 border-b border-border">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="font-display text-2xl sm:text-3xl">{s.title}</h2>
                  </div>
                  <p className="text-foreground/70 text-base sm:text-lg leading-relaxed pl-8">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 p-6 bg-muted/30 border border-border">
              <p className="eyebrow mb-2">Questions about these terms?</p>
              <p className="text-foreground/70">Write to us at <a href="mailto:hello@crazycutpiece.com" className="text-foreground underline underline-offset-4">hello@crazycutpiece.com</a> and we will respond promptly.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
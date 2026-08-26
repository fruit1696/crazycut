import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/Reveal';

const SECTIONS = [
  {
    title: 'Who we are',
    body: 'CrazyCutPiece ("we", "us") operates the woven-logic atelier at crazycutpiece.com, selling unstitched cut-piece fabrics to customers across India. This Privacy Policy explains what information we collect, how we use it, and the choices you have.',
  },
  {
    title: 'Information we collect',
    body: 'When you register, place an order, or contact us, we collect the details you provide — your name, email, shipping address, phone number, and order contents. We also receive technical data such as device, browser, and usage patterns when you visit the site.',
  },
  {
    title: 'How we use your information',
    body: 'We use your information to fulfil orders, process Cash on Delivery, send order updates, prevent fraud, and improve the atelier. With your consent, we may send weave notes and release announcements — you can unsubscribe at any time.',
  },
  {
    title: 'Sharing your information',
    body: 'We share your details only with the couriers and payment partners needed to deliver and confirm your order, and where required by law. We never sell your personal information to third parties.',
  },
  {
    title: 'Data retention',
    body: 'We keep your account and order records for as long as your account is active or as needed to provide our services and meet legal obligations. You may request deletion of your account at any time.',
  },
  {
    title: 'Your rights',
    body: 'You can access, correct, or request deletion of the personal information we hold about you, and withdraw any consent you have given. To exercise these rights, write to hello@crazycutpiece.com.',
  },
  {
    title: 'Security',
    body: 'We apply reasonable technical and organisational measures to protect your information. However, no method of transmission over the internet is fully secure, and we cannot guarantee absolute protection.',
  },
  {
    title: 'Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the revised date. Continued use of the site after changes constitutes acceptance of the updated policy.',
  },
];

export default function Privacy() {
  return (
    <div className="pt-[112px]">
      <section className="relative border-b border-border py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 weave-grain opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" />Back to the atelier</Link>
            <p className="eyebrow mb-4">Legal</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-balance">Privacy Policy</h1>
            <p className="mt-5 max-w-xl text-foreground/70 text-lg leading-relaxed">How CrazyCutPiece collects, uses, and protects your information.</p>
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
              <p className="eyebrow mb-2">Questions about privacy?</p>
              <p className="text-foreground/70">Write to us at <a href="mailto:hello@crazycutpiece.com" className="text-foreground underline underline-offset-4">hello@crazycutpiece.com</a> and we will respond promptly.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
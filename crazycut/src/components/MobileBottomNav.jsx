import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Info, ShoppingBag, UserRound, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const notifications = [];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const accountPath = isAuthenticated ? '/orders' : '/login';

  useEffect(() => {
    setAlertsOpen(false);
    if (location.pathname === '/' && location.hash === '#how-it-works') {
      requestAnimationFrame(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.pathname, location.hash]);

  const goToHowItWorks = () => {
    if (location.pathname === '/') {
      navigate('/#how-it-works', { replace: true });
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
  };

  const shopActive = location.pathname === '/shop' || location.pathname.startsWith('/product/');
  const howActive = location.pathname === '/' && location.hash === '#how-it-works';
  const accountActive = ['/login', '/register', '/orders'].includes(location.pathname);
  const itemClass = active => `flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 px-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] transition-colors ${active ? 'text-accent' : 'text-muted-foreground'}`;

  return (
    <>
      {alertsOpen && (
        <div id="mobile-alerts-panel" className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-sm border border-border bg-background shadow-2xl lg:hidden" role="dialog" aria-label="Notifications">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Alerts</p>
            <button type="button" onClick={() => setAlertsOpen(false)} className="flex h-11 w-11 items-center justify-center text-muted-foreground" aria-label="Close notifications">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <p className="px-5 py-8 text-center font-display text-xl text-muted-foreground">No new alerts</p>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(24,18,14,0.08)] backdrop-blur-md lg:hidden" aria-label="Mobile navigation">
        <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2">
          <Link to="/shop" className={itemClass(shopActive)} aria-label="Shop" aria-current={shopActive ? 'page' : undefined}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <span>Shop</span>
          </Link>

          <button type="button" onClick={goToHowItWorks} className={itemClass(howActive)} aria-label="How It Works" aria-current={howActive ? 'page' : undefined}>
            <Info className="h-5 w-5" strokeWidth={1.5} />
            <span>How It Works</span>
          </button>

          <button type="button" onClick={() => setAlertsOpen(open => !open)} className={itemClass(alertsOpen)} aria-label="Alerts" aria-current={alertsOpen ? 'page' : undefined} aria-expanded={alertsOpen} aria-controls="mobile-alerts-panel">
            <span className="relative">
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              {unreadCount > 0 && <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[8px] leading-none text-accent-foreground" aria-label={`${unreadCount} unread alerts`}>{unreadCount}</span>}
            </span>
            <span>Alerts</span>
          </button>

          <Link to={accountPath} className={itemClass(accountActive)} aria-label="Account" aria-current={accountActive ? 'page' : undefined}>
            <UserRound className="h-5 w-5" strokeWidth={1.5} />
            <span>Account</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

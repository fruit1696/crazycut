import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppWidget />
      <MobileBottomNav />
    </div>
  );
}

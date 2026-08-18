import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://irihausydrzgpreoyaeb.supabase.co', 'sb_publishable_qwbZoOkQG-5TCFxEzzqHrQ_5-63e3as');
async function run() {
  const { data: fabrics, error: fErr } = await supabase.from('fabrics').select('*').limit(1);
  console.log('Fabrics:', fabrics, fErr);
  const { data: orders, error: oErr } = await supabase.from('orders').select('*').limit(1);
  console.log('Orders:', orders, oErr);
  const { data: items, error: iErr } = await supabase.from('order_items').select('*').limit(1);
  console.log('Order Items:', items, iErr);
}
run();

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const fmt = (n: number) => new Intl.NumberFormat('fr-DZ').format(n) + ' DZD';

async function sendWhatsApp(message: string) {
  const phone = process.env.WHATSAPP_PHONE?.replace('+', '') || '213562256189';
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    console.log('WhatsApp API key not set. Message would be:', message);
    return;
  }

  try {
    // CallMeBot API
    const encoded = encodeURIComponent(message);
    await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`);
  } catch (e) {
    console.error('WhatsApp send error:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, items, total, notes } = body;

    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        items,
        total,
        notes,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Build WhatsApp message
    const itemLines = items.map((i: any) =>
      `  - ${i.product_name} ×${i.quantity} (${i.unit_type}) = ${fmt(i.subtotal)}`
    ).join('\n');

    const message = `🛍 *NOUVELLE COMMANDE #${data.id.slice(0, 8).toUpperCase()}*

👤 *Client:* ${customer_name}
📞 *Téléphone:* ${customer_phone}

📦 *Articles:*
${itemLines}

💰 *Total: ${fmt(total)}*
${notes ? `\n📝 *Notes:* ${notes}` : ''}

⏰ ${new Date().toLocaleString('fr-DZ')}`;

    await sendWhatsApp(message);

    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err: any) {
    console.error('Order error:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

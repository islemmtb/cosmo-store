import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const urls: string[] = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(data.path);

    urls.push(urlData.publicUrl);
  }

  return NextResponse.json({ urls });
}

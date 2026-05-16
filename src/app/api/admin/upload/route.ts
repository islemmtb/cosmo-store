import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

async function compressImage(buffer: ArrayBuffer): Promise<Buffer> {
  return await sharp(Buffer.from(buffer))
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const urls: string[] = [];

  for (const file of files) {
    const originalBuffer = await file.arrayBuffer();

    const compressedBuffer = await compressImage(originalBuffer);

    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const filename = `${Date.now()}-${originalName.replace(/\s/g, '-')}.webp`;

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filename, compressedBuffer, {
        contentType: 'image/webp',
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
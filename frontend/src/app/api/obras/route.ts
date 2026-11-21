import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServerKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServerKey) {
    return NextResponse.json(
      { error: "Configura SUPABASE_URL y SUPABASE_SECRET_KEY en frontend/.env.local." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const image = form.get("imagen");
  if (
    !(image instanceof File) ||
    !ALLOWED_TYPES.has(image.type) ||
    image.size === 0 ||
    image.size > MAX_IMAGE_BYTES
  ) {
    return NextResponse.json(
      { error: "Selecciona una imagen JPG, PNG o WebP de hasta 5 MB." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServerKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const path = `${userId}/${crypto.randomUUID()}.${FILE_EXTENSIONS[image.type]}`;

  const { data, error } = await supabase.storage.from("obras").upload(path, image, {
    contentType: image.type,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Supabase Storage upload failed:", error.message);
    return NextResponse.json(
      { error: "No se pudo guardar la imagen en Supabase Storage." },
      { status: 502 },
    );
  }

  return NextResponse.json({ path: data.path, bucket: "obras" });
}

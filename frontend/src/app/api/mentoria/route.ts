
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const webhook = process.env.N8N_WEBHOOK_URL;

  if (!webhook) {
    return NextResponse.json(
      { error: "El webhook de n8n todavía no está configurado." },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const titulo = form.get("titulo");
    const categoria = form.get("categoria");
    const notas = form.get("notas");
    const imagen = form.get("imagen");
    const imagenPath = form.get("imagen_path");

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      titulo.length > 100 ||
      typeof categoria !== "string" ||
      typeof notas !== "string" ||
      !notas.trim() ||
      notas.length > 1000 ||
      !(imagen instanceof File) ||
      !["image/jpeg", "image/png", "image/webp"].includes(imagen.type) ||
      imagen.size > 5 * 1024 * 1024
    ) {
      return NextResponse.json(
        { error: "Datos de la obra inválidos." },
        { status: 400 }
      );
    }

    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: "No se pudo obtener la sesión." },
        { status: 401 }
      );
    }

    const datos = new FormData();
    datos.append("clerk_user_id", userId);
    datos.append("titulo_obra", titulo.trim());
    datos.append("categoria", categoria);
    datos.append("notas_creadora", notas.trim());
    if (typeof imagenPath === "string" && imagenPath) {
      datos.append("imagen_path", imagenPath);
    }
    datos.append("foto", imagen, imagen.name);

    const respuesta = await fetch(webhook, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: datos,
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });

    if (!respuesta.ok) {
      return NextResponse.json(
        { error: "n8n no pudo procesar la obra." },
        { status: 502 }
      );
    }

    const tipo = respuesta.headers.get("content-type") || "";

    if (!tipo.includes("application/json")) {
      return NextResponse.json(
        { error: "n8n debe devolver una respuesta JSON." },
        { status: 502 }
      );
    }

    const resultado = await respuesta.json();

    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json(
      { error: "No se pudo completar el análisis." },
      { status: 500 }
    );
  }
}

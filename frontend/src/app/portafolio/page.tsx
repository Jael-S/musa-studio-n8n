"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import Logo from "@/components/Logo";
import type { Obra } from "@/components/SubirObra";
import { cargarObrasLocales } from "@/lib/obras-locales";

export default function PortafolioPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [obras, setObras] = useState<Obra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [obraAmpliada, setObraAmpliada] = useState<Obra | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user?.id) {
      setObras([]);
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    cargarObrasLocales(user.id)
      .then((guardadas) => {
        if (cancelado) {
          guardadas.forEach((obra) => URL.revokeObjectURL(obra.imagen));
          return;
        }
        setObras(guardadas);
        setCargando(false);
      })
      .catch((error) => {
        console.error("No se pudo cargar el portafolio:", error);
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [isLoaded, user?.id]);

  useEffect(
    () => () => obras.forEach((obra) => URL.revokeObjectURL(obra.imagen)),
    [obras],
  );

  useEffect(() => {
    if (!obraAmpliada) return;

    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setObraAmpliada(null);
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [obraAmpliada]);

  return (
    <main className="min-h-screen bg-rose-50 text-slate-900">
      <header className="border-b border-rose-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-8 border-l border-rose-200 sm:block" />
            <h1 className="text-2xl font-bold text-rose-800">Mi portafolio</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-800 transition hover:bg-rose-50"
            >
              Volver al estudio
            </Link>
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-6">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-rose-200 to-purple-200 p-8">
          <p className="text-slate-700">
            Tus obras y avances creativos, guardados en este navegador.
          </p>
          <p className="mt-2 font-semibold text-rose-800">
            {obras.length} {obras.length === 1 ? "obra" : "obras"}
          </p>
        </div>

        {cargando ? (
          <p className="rounded-2xl bg-white p-6 text-slate-600">
            Cargando tu portafolio...
          </p>
        ) : !isSignedIn ? (
          <p className="rounded-2xl bg-white p-6 text-slate-600">
            Inicia sesión para ver tu portafolio. Puedes hacerlo desde el estudio.
          </p>
        ) : obras.length === 0 ? (
          <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-rose-800">
              Tu portafolio está esperando tu primera obra
            </h2>
            <p className="mt-2 text-slate-600">
              Agrega una creación desde el estudio y aparecerá aquí.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-rose-700 px-5 py-3 font-semibold text-white transition hover:bg-rose-800"
            >
              Subir una obra
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <article
                key={obra.id}
                className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setObraAmpliada(obra)}
                  aria-label={`Ampliar imagen: ${obra.titulo}`}
                  className="group relative block w-full cursor-zoom-in bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={obra.imagen}
                    alt={obra.titulo}
                    className="h-56 w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-950/65 px-3 py-2 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ver imagen ampliada
                  </span>
                </button>
                <div className="p-5">
                  <p className="text-sm font-medium text-rose-700">
                    {obra.categoria}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{obra.titulo}</h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                    {obra.notas}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {obraAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setObraAmpliada(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ampliada: ${obraAmpliada.titulo}`}
            className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
          >
            <button
              type="button"
              autoFocus
              onClick={() => setObraAmpliada(null)}
              className="mb-3 self-end rounded-xl bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-rose-100"
            >
              Cerrar <span aria-hidden="true">✕</span>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={obraAmpliada.imagen}
              alt={obraAmpliada.titulo}
              className="max-h-[78vh] max-w-full rounded-xl object-contain"
            />
            <p className="mt-3 text-center font-medium text-white">
              {obraAmpliada.titulo}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

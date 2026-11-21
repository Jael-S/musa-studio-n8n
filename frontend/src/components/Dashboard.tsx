"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import SubirObra, { type Obra } from "./SubirObra";
import { cargarObrasLocales, guardarObraLocal } from "@/lib/obras-locales";

export default function Dashboard() {
  const { user } = useUser();
  const [obras, setObras] = useState<Obra[]>([]);
  const obrasRef = useRef<Obra[]>([]);

  useEffect(() => {
    obrasRef.current = obras;
  }, [obras]);

  useEffect(() => {
    const ownerId = user?.id;
    if (!ownerId) {
      setObras([]);
      return;
    }

    let cancelado = false;
    cargarObrasLocales(ownerId)
      .then((guardadas) => {
        if (!cancelado) setObras(guardadas);
        else guardadas.forEach((obra) => URL.revokeObjectURL(obra.imagen));
      })
      .catch((error) => console.error("No se pudieron cargar las obras locales:", error));

    return () => {
      cancelado = true;
    };
  }, [user?.id]);

  useEffect(
    () => () => {
      obrasRef.current.forEach((obra) => URL.revokeObjectURL(obra.imagen));
    },
    [],
  );

  async function agregarObra(obra: Obra) {
    if (user?.id) {
      try {
        await guardarObraLocal(user.id, obra);
      } catch (error) {
        console.error("No se pudo guardar la obra en este navegador:", error);
      }
    }

    setObras((actuales) => [obra, ...actuales]);
  }

  return (
    <main className="min-h-screen bg-rose-50 text-slate-900">
      <header className="border-b border-rose-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              href="/calendario"
              className="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-800 transition hover:bg-rose-50"
            >
              Calendario
            </Link>
            <Link
              href="/portafolio"
              className="rounded-xl bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800"
            >
              Mi portafolio
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <section className="rounded-3xl bg-gradient-to-r from-rose-200 to-purple-200 p-8">
          <h2 className="text-3xl font-bold">
            ¡Hola, {user?.firstName || "artista"}!
          </h2>
          <p className="mt-2 text-slate-700">
            Cada obra es un paso más en tu camino creativo.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Mis obras</p>
            <p className="mt-2 text-3xl font-bold">{obras.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Estado</p>
            <p className="mt-2 font-semibold text-rose-700">Creando</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Mentoría IA</p>
            <p className="mt-2 font-semibold">Pendiente de conexión</p>
          </div>
        </section>

        <div className="max-w-3xl">
          <SubirObra onAgregar={agregarObra} />
        </div>
      </div>
    </main>
  );
}

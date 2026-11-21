"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import Logo from "@/components/Logo";
import type { Obra } from "@/components/SubirObra";
import { cargarObrasLocales } from "@/lib/obras-locales";

const DIAS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

function claveFecha(fecha: Date) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

export default function CalendarioPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [obras, setObras] = useState<Obra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mes, setMes] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [diaSeleccionado, setDiaSeleccionado] = useState(() => claveFecha(new Date()));
  const obrasRef = useRef<Obra[]>([]);

  useEffect(() => {
    obrasRef.current = obras;
  }, [obras]);

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
        if (!cancelado) {
          setObras(guardadas);
          setCargando(false);
        } else {
          guardadas.forEach((obra) => URL.revokeObjectURL(obra.imagen));
        }
      })
      .catch((error) => {
        console.error("No se pudo cargar el calendario de avance:", error);
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [isLoaded, user?.id]);

  useEffect(
    () => () => obrasRef.current.forEach((obra) => URL.revokeObjectURL(obra.imagen)),
    [],
  );

  const año = mes.getFullYear();
  const numeroMes = mes.getMonth();
  const primerDia = new Date(año, numeroMes, 1).getDay();
  const diasEnMes = new Date(año, numeroMes + 1, 0).getDate();
  const diasDeObras = new Map<string, Obra[]>();

  for (const obra of obras) {
    if (!obra.fechaCreacion) continue;
    const key = claveFecha(new Date(obra.fechaCreacion));
    const obrasDelDia = diasDeObras.get(key) ?? [];
    obrasDelDia.push(obra);
    diasDeObras.set(key, obrasDelDia);
  }

  const obrasDelDiaSeleccionado = diasDeObras.get(diaSeleccionado) ?? [];
  const obrasDelMes = [...diasDeObras.entries()]
    .filter(([key]) => key.startsWith(`${año}-${String(numeroMes + 1).padStart(2, "0")}`))
    .reduce((total, [, lista]) => total + lista.length, 0);
  const diasActivos = [...diasDeObras.keys()].filter((key) =>
    key.startsWith(`${año}-${String(numeroMes + 1).padStart(2, "0")}`),
  ).length;
  const nombreMes = new Intl.DateTimeFormat("es-BO", {
    month: "long",
    year: "numeric",
  }).format(mes);

  return (
    <main className="min-h-screen bg-rose-50 text-slate-900">
      <header className="border-b border-rose-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-8 border-l border-rose-200 sm:block" />
            <h1 className="text-2xl font-bold text-rose-800">Calendario de avance</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-800 transition hover:bg-rose-50"
            >
              Volver al estudio
            </Link>
            <Link
              href="/portafolio"
              className="rounded-xl bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800"
            >
              Mi portafolio
            </Link>
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMes(new Date(año, numeroMes - 1, 1))}
              aria-label="Mes anterior"
              className="rounded-xl border border-rose-200 px-4 py-2 text-rose-800 hover:bg-rose-50"
            >
              ←
            </button>
            <h2 className="text-xl font-bold capitalize text-rose-800">{nombreMes}</h2>
            <button
              type="button"
              onClick={() => setMes(new Date(año, numeroMes + 1, 1))}
              aria-label="Mes siguiente"
              className="rounded-xl border border-rose-200 px-4 py-2 text-rose-800 hover:bg-rose-50"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {DIAS.map((dia) => (
              <div key={dia} className="py-2 text-sm font-semibold text-slate-500">
                {dia}
              </div>
            ))}
            {Array.from({ length: primerDia }, (_, index) => (
              <div key={`vacio-${index}`} aria-hidden="true" />
            ))}
            {Array.from({ length: diasEnMes }, (_, index) => {
              const numeroDia = index + 1;
              const fecha = new Date(año, numeroMes, numeroDia);
              const key = claveFecha(fecha);
              const obrasDelDia = diasDeObras.get(key) ?? [];
              const seleccionado = key === diaSeleccionado;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDiaSeleccionado(key)}
                  aria-label={`${numeroDia} de ${nombreMes}${obrasDelDia.length ? `, ${obrasDelDia.length} obras` : ""}`}
                  aria-pressed={seleccionado}
                  className={`relative flex min-h-14 flex-col items-center justify-center rounded-xl border text-sm transition ${
                    seleccionado
                      ? "border-rose-700 bg-rose-700 font-bold text-white"
                      : obrasDelDia.length
                        ? "border-rose-200 bg-rose-50 font-semibold text-rose-800 hover:bg-rose-100"
                        : "border-transparent text-slate-700 hover:border-rose-100 hover:bg-rose-50"
                  }`}
                >
                  <span>{numeroDia}</span>
                  {obrasDelDia.length > 0 && (
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full ${seleccionado ? "bg-white" : "bg-rose-600"}`} />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Los días marcados indican que guardaste al menos una obra.
          </p>
        </div>

        <aside className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Días con avance</p>
              <p className="mt-2 text-3xl font-bold text-rose-700">{diasActivos}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Obras del mes</p>
              <p className="mt-2 text-3xl font-bold text-rose-700">{obrasDelMes}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-rose-800">
              {new Intl.DateTimeFormat("es-BO", {
                day: "numeric",
                month: "long",
              }).format(new Date(`${diaSeleccionado}T12:00:00`))}
            </h2>
            {cargando ? (
              <p className="mt-4 text-slate-500">Cargando avances...</p>
            ) : !isSignedIn ? (
              <p className="mt-4 text-slate-500">Inicia sesión para ver tu calendario.</p>
            ) : obrasDelDiaSeleccionado.length === 0 ? (
              <p className="mt-4 text-slate-500">No hay obras guardadas este día.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {obrasDelDiaSeleccionado.map((obra) => (
                  <li key={obra.id} className="rounded-xl bg-rose-50 p-4">
                    <p className="font-semibold text-slate-800">{obra.titulo}</p>
                    <p className="mt-1 text-sm text-rose-700">{obra.categoria}</p>
                    <p className="mt-2 text-sm text-slate-600">{obra.notas}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            href="/portafolio"
            className="block rounded-xl border border-rose-200 bg-white px-4 py-3 text-center font-semibold text-rose-800 transition hover:bg-rose-50"
          >
            Ver todas mis obras
          </Link>
        </aside>
      </section>
    </main>
  );
}


"use client";

import { useState, type FormEvent } from "react";

export type Obra = {
  id: string;
  titulo: string;
  categoria: string;
  notas: string;
  imagen: string;
  imagenBlob?: Blob;
};

type ResultadoMentoria = {
  evaluacion_general?: string;
  puntaje_progreso?: number;
  aciertos?: string[];
  consejo_tecnico?: string;
  comparacion?: string | null;
  logros_destacados?: string[];
  mejoras_tecnicas?: string[];
  siguiente_reto?: string;
  siguiente_reto_titulo?: string;
  siguiente_reto_consigna?: string;
  mensaje_aliento?: string;
};

export default function SubirObra({
  onAgregar,
}: {
  onAgregar: (obra: Obra) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Ilustración digital");
  const [notas, setNotas] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] =
    useState<ResultadoMentoria | null>(null);

  const [modoDemo, setModoDemo] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (cargando) return;

    setError("");
    setResultado(null);
    setModoDemo(false);

    if (!titulo.trim() || !notas.trim()) {
      setError("Completa el título y las notas.");
      return;
    }

    if (!archivo) {
      setError("Selecciona una imagen.");
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(archivo.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WebP.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5 MB.");
      return;
    }

    setCargando(true);

    const datos = new FormData();
    datos.append("titulo", titulo.trim());
    datos.append("categoria", categoria);
    datos.append("notas", notas.trim());
    datos.append("imagen", archivo);

    let analisis: ResultadoMentoria | null = null;
    let demo = false;

    try {
      const respuesta = await fetch("/api/mentoria", {
        method: "POST",
        body: datos,
      });

      const datosRespuesta = await respuesta.json();

      if (!respuesta.ok) {
        if (
          respuesta.status === 503 &&
          datosRespuesta.error ===
            "El webhook de n8n todavía no está configurado."
        ) {
          demo = true;
        } else {
          throw new Error(
            datosRespuesta.error || "No se pudo analizar la obra."
          );
        }
      } else {
        analisis = datosRespuesta as ResultadoMentoria;
      }

      const obra: Obra = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        categoria,
        notas: notas.trim(),
        imagen: URL.createObjectURL(archivo),
        imagenBlob: archivo,
      };

      onAgregar(obra);

      setResultado(analisis);
      setModoDemo(demo);

      setTitulo("");
      setNotas("");
      setArchivo(null);

      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={enviar}
        className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-rose-800">
          Subir nueva obra
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Comparte tu proceso creativo y recibe orientación
          para seguir mejorando.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">
              Título de la obra
            </span>

            <input
              required
              maxLength={100}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Mi primer retrato"
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-rose-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Categoría artística
            </span>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-rose-400"
            >
              <option>Ilustración digital</option>
              <option>Retrato a grafito</option>
              <option>Acuarela / Tinta</option>
              <option>Boceto de anatomía</option>
              <option>Pintura</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Notas del proceso
            </span>

            <textarea
              required
              maxLength={1000}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="¿Qué intentaste mejorar hoy? ¿Qué dificultades encontraste?"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-rose-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Imagen de tu obra
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              onChange={(e) =>
                setArchivo(e.target.files?.[0] ?? null)
              }
              className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm"
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded-xl bg-rose-700 px-5 py-3 font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando
            ? "Procesando obra..."
            : "Analizar obra con IA"}
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Tus obras se guardan en este navegador. Para
          sincronizarlas entre dispositivos y recibir mentoría
          con IA, falta conectar Supabase y n8n.
        </p>
      </form>

      {modoDemo && (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
        >
          <h3 className="font-semibold text-amber-900">
            Obra agregada en modo demostración
          </h3>

          <p className="mt-2 text-sm text-amber-800">
            Tu obra aparece en la galería local.
            Todavía no se envió a Gemini ni se guardó
            en Supabase.
          </p>
        </div>
      )}

      {resultado && (
        <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-purple-800">
            Resultado de la mentoría
          </h2>

          {resultado.puntaje_progreso !== undefined && (
            <div className="mt-5 rounded-xl bg-purple-50 p-4">
              <p className="text-sm text-purple-700">
                Puntaje de progreso
              </p>

              <p className="text-3xl font-bold text-purple-900">
                {resultado.puntaje_progreso}/100
              </p>
            </div>
          )}

          {resultado.evaluacion_general && (
            <div className="mt-5">
              <h3 className="font-semibold">
                Evaluación general
              </h3>
              <p className="mt-2 text-slate-600">
                {resultado.evaluacion_general}
              </p>
            </div>
          )}

          {(resultado.aciertos ?? resultado.logros_destacados)?.length ? (
            <div className="mt-5">
              <h3 className="font-semibold text-green-700">
                Logros destacados
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                {(resultado.aciertos ?? resultado.logros_destacados ?? []).map((logro, i) => (
                  <li key={i}>{logro}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {resultado.consejo_tecnico && (
            <div className="mt-5">
              <h3 className="font-semibold text-amber-700">
                Consejo técnico
              </h3>
              <p className="mt-2 text-slate-600">
                {resultado.consejo_tecnico}
              </p>
            </div>
          )}

          {resultado.comparacion && (
            <div className="mt-5">
              <h3 className="font-semibold text-purple-700">
                Comparación con tu avance anterior
              </h3>
              <p className="mt-2 text-slate-600">
                {resultado.comparacion}
              </p>
            </div>
          )}

          {resultado.mejoras_tecnicas?.length ? (
            <div className="mt-5">
              <h3 className="font-semibold text-amber-700">
                Aspectos para mejorar
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                {resultado.mejoras_tecnicas.map((mejora, i) => (
                  <li key={i}>{mejora}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {(resultado.siguiente_reto ||
            resultado.siguiente_reto_titulo) && (
            <div className="mt-5 rounded-xl bg-rose-50 p-4">
              <h3 className="font-semibold text-rose-800">
                Tu siguiente reto
              </h3>

              <p className="mt-2 text-slate-700">
                {resultado.siguiente_reto_titulo ||
                  resultado.siguiente_reto}
              </p>

              {resultado.siguiente_reto_consigna && (
                <p className="mt-2 text-sm text-slate-600">
                  {resultado.siguiente_reto_consigna}
                </p>
              )}
            </div>
          )}

          {(resultado.mensaje ?? resultado.mensaje_aliento) && (
            <p className="mt-5 italic text-purple-700">
              {resultado.mensaje ?? resultado.mensaje_aliento}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

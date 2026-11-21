
import { Suspense } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

function AuthButtons() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex gap-3">
          <SignInButton mode="modal">
            <button className="rounded-lg border border-rose-700 px-4 py-2">
              Iniciar sesión
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="rounded-lg bg-rose-700 px-4 py-2 text-white">
              Registrarme
            </button>
          </SignUpButton>
        </div>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

function WelcomeMessage() {
  return (
    <Show when="signed-in">
      <div className="mt-10 rounded-2xl bg-white p-8 shadow-md">
        <h3 className="text-2xl font-semibold text-rose-700">
          ¡Bienvenida a Musa Studio!
        </h3>

        <p className="mt-3 text-slate-600">
          Aquí podrás subir tus obras, consultar tu progreso
          y recibir nuevos retos creativos.
        </p>
      </div>
    </Show>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-rose-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-rose-700">
          Musa Studio
        </h1>

        <Suspense fallback={<span>Cargando...</span>}>
          <AuthButtons />
        </Suspense>
      </header>

      <section className="mx-auto mt-28 max-w-3xl px-6 text-center">
        <h2 className="text-5xl font-bold">
          Tu creatividad merece crecer.
        </h2>

        <p className="mt-6 text-lg text-slate-600">
          Comparte tus obras, descubre tu progreso y recibe
          recomendaciones personalizadas con inteligencia artificial.
        </p>

        <Suspense fallback={null}>
          <WelcomeMessage />
        </Suspense>
      </section>
    </main>
  );
}

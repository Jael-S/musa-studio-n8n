
import { Suspense } from "react";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Dashboard from "../components/Dashboard";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <Suspense fallback={<p className="p-8">Cargando Musa Studio...</p>}>
      <Show when="signed-in">
        <Dashboard />
      </Show>

      <Show when="signed-out">
        <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 px-6 text-center">
          <Logo className="scale-125" />

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Tu espacio para crear, registrar tus avances y
            desarrollar tu talento artístico con inteligencia artificial.
          </p>

          <div className="mt-8 flex gap-4">
            <SignInButton mode="modal">
              <button className="rounded-xl border border-rose-700 px-6 py-3 text-rose-700">
                Iniciar sesión
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-xl bg-rose-700 px-6 py-3 text-white">
                Registrarme
              </button>
            </SignUpButton>
          </div>
        </main>
      </Show>
    </Suspense>
  );
}

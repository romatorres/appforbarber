import { LoginForm } from "@/app/login/_components/login-form";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full h-screen bg-bg_dark lg:flex items-center justify-center hidden">
        <div className="relative w-56 h-full">
          <Image
            src="/img/logo.svg"
            alt="Logo AppForBarber"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center bg-background">
        <div className="w-full md:w-[540px] px-8 py-8">
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="relative w-28 h-28">
              <Image
                src="/img/logo.svg"
                alt="Logo AppForBarber"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center text-2xl font-bold">Entrar</div>
          <div className="flex flex-col justify-center items-center gap-4 py-10 text-xl font-semibold">
            <CircleUserRound size={48} strokeWidth={1} color="#4E525B" />
            Faça seu login para agendar!
          </div>
          <div>
            <LoginForm />
            <p className="text-center text-gray-3 mt-6 text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                <span className="text-base font-semibold">Cadastre-se</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <p>
            Não tem uma conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div> */
}

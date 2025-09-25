"use client";

import { useState } from "react";
import LoginForm from "./_components/login-form";
import SignupForm from "./_components/signup-form";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const switchLogin = () => {
    setIsLogin(true);
  };

  const switchRegister = () => {
    setIsLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* col 01 */}
      <div className="w-full lg:w-1/2 h-screen bg-bg_dark lg:flex items-center justify-center hidden">
        <div className="relative w-56 h-56">
          <Image
            src="/img/logo.svg"
            alt="Logo AppForBarber"
            fill
            className="object-contain"
          />
        </div>
      </div>
      {/* col 02 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-background">
        <div className="flex justify-center lg:hidden mb-10">
          <div className="relative w-28 h-28">
            <Image
              src="/img/logo.svg"
              alt="Logo AppForBarber"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="w-full px-10 max-w-3xl">
          {isLogin ? (
            <LoginForm onSwitchToRegister={switchRegister} />
          ) : (
            <SignupForm onSwitchToLogin={switchLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

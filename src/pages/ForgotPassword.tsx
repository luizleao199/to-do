"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email é obrigatório");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Email inválido");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      setSent(true);
      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 mb-4 shadow-lg shadow-purple-500/25 dark:shadow-purple-500/40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">MINHAS TAREFAS</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Organize sua vida, uma tarefa por vez</p>
        </div>

        {/* Card */}
        <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/20 animate-fade-in-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {sent ? "Email enviado!" : "Recuperar senha"}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {sent 
                ? "Verifique sua caixa de entrada para redefinir sua senha"
                : "Digite seu email para receber o link de recuperação"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200 group-focus-within:text-purple-500" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      onBlur={() => validateForm()}
                      className={`pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        error 
                          ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20" 
                          : email && isSubmitted
                          ? "border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500"
                          : "border-gray-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-300 dark:hover:border-purple-600"
                      } focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-purple-950`}
                      disabled={isLoading}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400 animate-slide-in" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-purple-950"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enviamos um link para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
                </p>
                <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para o login
                </Button>
              </div>
            )}

            {/* Back to Login */}
            {!sent && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Lembrou a senha?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Entrar
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6 animate-fade-in">
          © 2024 MINHAS TAREFAS. Todos os direitos reservados.
        </p>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out 0.1s forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.5s ease-out 0.3s forwards; opacity: 0; }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
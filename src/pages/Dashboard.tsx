"use client";

import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, CheckSquare, Clock, Trash2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Você saiu da sua conta");
    navigate("/login");
  };

  // Dados de exemplo para o dashboard
  const stats = [
    { label: "Total", count: 12, icon: CheckSquare, color: "bg-purple-500" },
    { label: "Concluídas", count: 8, icon: CheckSquare, color: "bg-green-500" },
    { label: "Pendentes", count: 4, icon: Clock, color: "bg-yellow-500" },
    { label: "Excluídas", count: 2, icon: Trash2, color: "bg-red-500" },
  ];

  const recentTasks = [
    { id: 1, title: "Finalizar relatório mensal", completed: true, priority: "high" },
    { id: 2, title: "Reunião com equipe às 14h", completed: false, priority: "high" },
    { id: 3, title: "Comprar materiais de escritório", completed: false, priority: "medium" },
    { id: 4, title: "Ler documentação da nova API", completed: true, priority: "low" },
    { id: 5, title: "Fazer backup do banco de dados", completed: false, priority: "high" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">MINHAS TAREFAS</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Bem-vindo de volta!
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                aria-label="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel de Controle</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie suas tarefas e acompanhe seu progresso
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.count}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tasks Section */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tarefas Recentes</h2>
          <Button className="gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {recentTasks.map((task) => (
            <Card
              key={task.id}
              className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800 hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 group"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-5 h-5 rounded border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
                      {task.completed && (
                        <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"} font-medium truncate`}>
                        {task.title}
                      </h3>
                      <Badge variant="secondary" className={getPriorityColor(task.priority)} >
                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State / CTA */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Card className="bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border-purple-100 dark:border-purple-800">
            <CardContent className="py-12 px-6">
              <CheckSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pronto para começar?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                Crie sua primeira tarefa e comece a organizar seu dia com mais produtividade.
              </p>
              <Button className="gap-2" size="lg">
                <Plus className="w-5 h-5" />
                Criar Primeira Tarefa
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;
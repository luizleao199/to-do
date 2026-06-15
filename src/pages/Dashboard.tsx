"use client";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogOut, Plus, CheckSquare, Clock, Trash2, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTasks, useCreateTask, useDeleteTask, useToggleTask } from "@/contexts/tasks/hooks/useTasks";
import { TaskForm } from "@/contexts/tasks/components/TaskForm";
import { TaskList } from "@/contexts/tasks/components/TaskList";
import { useState, useEffect } from "react";
import type { Task } from "@/contexts/tasks/tasks.types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null);
  
  const sortBy = (searchParams.get('sort') as 'created_at' | 'due_date') || 'created_at';
  const { data: tasks, isLoading, refetch } = useTasks({ sortBy });
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  // Fetch user on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Você saiu da sua conta");
      navigate("/login");
    }
  };

  const handleAddTask = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Stats calculados dinamicamente - use status field
  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter(t => t.status === 'concluida').length ?? 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pendente').length ?? 0;

  const stats = [
    { label: "Total", count: totalTasks, icon: CheckSquare, color: "bg-purple-500" },
    { label: "Concluídas", count: completedTasks, icon: CheckSquare, color: "bg-green-500" },
    { label: "Pendentes", count: pendingTasks, icon: Clock, color: "bg-yellow-500" },
    { label: "Excluídas", count: 0, icon: Trash2, color: "bg-red-500" },
  ];

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
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
                <span className className className="text-xl font-bold text-gray-900 dark:text-white">MINHAS TAREFAS</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-transparent p-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm font-medium">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block font-medium">{user.user_metadata?.full_name || user.email.split('@')[0]}</span>
                      <User className="w-4 h-4 hidden sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-purple-950 border-purple-800 w-56">
                    <div className="px-3 py-2 border-b border-purple-100 dark:border-purple-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.user_metadata?.full_name || user.email.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="border-purple-100 dark:border-purple-800" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Tarefas</h2>
          <Button className="gap-2" size="sm" onClick={handleAddTask}>
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <TaskList />
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskForm isOpen={isFormOpen} onClose={handleCloseForm} />

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
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;
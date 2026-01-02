import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Zap, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Target,
  Check,
  Trash2,
  Edit3,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useNotifications } from "@/hooks/useNotifications";
import { ReminderModal } from "@/components/ReminderModal";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { DailyStreak } from "@/components/dashboard/DailyStreak";
import { AmbientSounds } from "@/components/dashboard/AmbientSounds";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MotivationalQuote } from "@/components/dashboard/MotivationalQuote";
import { EnhancedTimer } from "@/components/dashboard/EnhancedTimer";
import { MindReliefGames } from "@/components/dashboard/MindReliefGames";
import { FeatureNav } from "@/components/dashboard/FeatureNav";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, toggleComplete, deleteTask, addReminder } = useTasks();
  const { unreadCount } = useNotifications();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"high" | "medium" | "low">("medium");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [focusMode, setFocusMode] = useState(() => {
    const saved = localStorage.getItem('focusMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTaskForReminder, setSelectedTaskForReminder] = useState<{ id: string; title: string; dueDate?: Date } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('focusMinutes');
    if (saved) {
      const { date, minutes } = JSON.parse(saved);
      return date === today ? minutes : 0;
    }
    return 0;
  });
  const [activeFeature, setActiveFeature] = useState("streak");

  // Persist focus mode state
  useEffect(() => {
    localStorage.setItem('focusMode', JSON.stringify(focusMode));
  }, [focusMode]);

  // Persist focus minutes with date
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('focusMinutes', JSON.stringify({ date: today, minutes: focusMinutes }));
  }, [focusMinutes]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    await addTask(newTask, selectedPriority, dueDateObj);
    setNewTask("");
    setDueDate("");
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const startEdit = (task: { id: string; title: string }) => {
    setEditingTask(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    await updateTask(id, { title: editValue });
    setEditingTask(null);
    setEditValue("");
  };

  const openReminderModal = (task: { id: string; title: string; due_date: string | null }) => {
    setSelectedTaskForReminder({
      id: task.id,
      title: task.title,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
    });
    setShowReminderModal(true);
  };

  const handleSetReminder = async (reminder: { time: Date; type: 'email' | 'in_app' | 'both' }) => {
    if (!selectedTaskForReminder || !user) return;

    await addReminder(selectedTaskForReminder.id, reminder.time, reminder.type);

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('user_id', user.id)
      .single();

    const timeUntilReminder = reminder.time.getTime() - Date.now();
    
    if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
      setTimeout(async () => {
        try {
          const { error } = await supabase.functions.invoke('send-reminder', {
            body: {
              taskId: selectedTaskForReminder.id,
              taskTitle: selectedTaskForReminder.title,
              dueDate: selectedTaskForReminder.dueDate?.toISOString() || new Date().toISOString(),
              userEmail: profile?.email || user.email,
              userName: profile?.full_name || user.email?.split('@')[0],
              reminderType: reminder.type,
            },
          });
          
          if (error) {
            console.error('Error sending reminder:', error);
          }
        } catch (err) {
          console.error('Failed to send reminder:', err);
        }
      }, timeUntilReminder);
    }

    toast({
      title: "Reminder set!",
      description: `You'll be reminded at ${reminder.time.toLocaleString()}`,
    });

    setShowReminderModal(false);
    setSelectedTaskForReminder(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSessionComplete = () => {
    // Session complete doesn't add extra time since we track real-time now
  };

  const handleFocusMinuteAdd = () => {
    setFocusMinutes(prev => prev + 1);
  };

  const priorityColors = {
    high: "bg-priority-high/20 text-priority-high border-priority-high/30",
    medium: "bg-priority-medium/20 text-priority-medium border-priority-medium/30",
    low: "bg-priority-low/20 text-priority-low border-priority-low/30",
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: true },
    { icon: BarChart3, label: "Insights", path: "/insights", active: false },
    { icon: Settings, label: "Settings", path: "#", active: false },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  // Calculate stats
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const pendingTasks = tasks.filter(t => !t.is_completed).length;
  const todayCompleted = tasks.filter(t => {
    if (!t.completed_at) return false;
    const completedDate = new Date(t.completed_at);
    const today = new Date();
    return completedDate.toDateString() === today.toDateString();
  }).length;
  const productivity = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Calculate daily streak from task completion history
  const calculateStreak = () => {
    const completedDates = tasks
      .filter(t => t.completed_at)
      .map(t => new Date(t.completed_at!).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (completedDates.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today or yesterday has completions to start current streak
    const firstDate = new Date(completedDates[0]);
    firstDate.setHours(0, 0, 0, 0);
    
    if (firstDate.getTime() === today.getTime() || firstDate.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      
      for (let i = 1; i < completedDates.length; i++) {
        const currentDate = new Date(completedDates[i - 1]);
        const prevDate = new Date(completedDates[i]);
        currentDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < completedDates.length; i++) {
      const currentDate = new Date(completedDates[i - 1]);
      const prevDate = new Date(completedDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
  };

  const streak = calculateStreak();

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card/80 backdrop-blur-xl border border-border"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed lg:relative z-40 w-[280px] h-screen glass-card border-r border-border/50 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-border/50">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl text-foreground">FocusFlow</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    item.active 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <button onClick={handleSignOut}>
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 pt-12 lg:pt-0 flex items-start justify-between"
          >
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                {greeting}, <span className="gradient-text">{userName}</span>
              </h1>
              <p className="text-muted-foreground">Let's make today productive!</p>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl bg-card/80 backdrop-blur-xl border border-border hover:border-primary/30 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6"
          >
            <QuickStats
              completed={completedTasks}
              pending={pendingTasks}
              focusMinutes={focusMinutes}
              productivity={productivity}
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="xl:col-span-2 space-y-6">
              {/* Add Task */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Add a new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                      className="flex-1"
                    />
                    <div className="relative">
                      <button
                        onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                        className={`h-11 px-4 rounded-xl border flex items-center gap-2 transition-colors ${priorityColors[selectedPriority]}`}
                      >
                        <span className="capitalize text-sm">{selectedPriority}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {showPriorityDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 right-0 w-32 glass-card p-2 z-10"
                          >
                            {(["high", "medium", "low"] as const).map((priority) => (
                              <button
                                key={priority}
                                onClick={() => {
                                  setSelectedPriority(priority);
                                  setShowPriorityDropdown(false);
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-left text-sm capitalize transition-colors hover:bg-muted ${
                                  selectedPriority === priority ? "bg-muted" : ""
                                }`}
                              >
                                {priority}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full"
                        placeholder="Due date (optional)"
                      />
                    </div>
                    <Button onClick={handleAddTask} variant="glow" className="shrink-0">
                      <Plus className="w-5 h-5" />
                      Add Task
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Task List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold">Your Tasks</h2>
                  <span className="text-sm text-muted-foreground">
                    {pendingTasks} remaining
                  </span>
                </div>

                {tasksLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
                    />
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No tasks yet. Add your first task above!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <AnimatePresence>
                      {tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                            task.is_completed 
                              ? "bg-muted/30 border-border/30" 
                              : "bg-card/50 border-border hover:border-primary/30"
                          }`}
                        >
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              task.is_completed 
                                ? "bg-primary border-primary" 
                                : "border-muted-foreground hover:border-primary"
                            }`}
                          >
                            {task.is_completed && <Check className="w-4 h-4 text-primary-foreground" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            {editingTask === task.id ? (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                                onBlur={() => saveEdit(task.id)}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <p className={`font-medium truncate ${task.is_completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-md border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                                {task.priority}
                              </span>
                              {task.due_date && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openReminderModal(task)}
                              className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                              title="Set reminder"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEdit(task)}
                              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>

              {/* Motivational Quote */}
              <MotivationalQuote />

            </div>

            {/* Right Column - Feature Panel */}
            <div className="space-y-6">
              {/* Feature Navigation */}
              <FeatureNav activeFeature={activeFeature} onFeatureChange={setActiveFeature} />

              {/* Feature Content */}
              <AnimatePresence mode="wait">
                {activeFeature === "streak" && (
                  <motion.div
                    key="streak"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DailyStreak 
                      currentStreak={streak.current} 
                      longestStreak={streak.longest} 
                      tasksCompletedToday={todayCompleted}
                      completedDates={tasks.filter(t => t.completed_at).map(t => t.completed_at!)}
                    />
                  </motion.div>
                )}

                {activeFeature === "focus" && (
                  <motion.div
                    key="focus"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnhancedTimer
                      focusMode={focusMode}
                      onFocusModeChange={setFocusMode}
                      onSessionComplete={handleSessionComplete}
                      onFocusMinuteAdd={handleFocusMinuteAdd}
                    />
                  </motion.div>
                )}

                {activeFeature === "sounds" && (
                  <motion.div
                    key="sounds"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AmbientSounds />
                  </motion.div>
                )}

                {activeFeature === "games" && (
                  <motion.div
                    key="games"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MindReliefGames />
                  </motion.div>
                )}

                {activeFeature === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AISuggestions tasks={tasks} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false);
          setSelectedTaskForReminder(null);
        }}
        onSave={handleSetReminder}
        taskTitle={selectedTaskForReminder?.title || ''}
        dueDate={selectedTaskForReminder?.dueDate}
      />
    </div>
  );
};

export default Dashboard;

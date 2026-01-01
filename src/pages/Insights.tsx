import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  Flame,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { format, subDays, startOfDay, isSameDay } from "date-fns";

const Insights = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    tasksCompleted: 0,
    focusHours: 0,
    streak: 0,
    productivity: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Calculate real stats from tasks
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const totalTasks = tasks.length;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate streak
  const calculateStreak = () => {
    const completedDates = tasks
      .filter(t => t.completed_at)
      .map(t => startOfDay(new Date(t.completed_at!)).getTime())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => b - a);

    if (completedDates.length === 0) return 0;

    let streak = 0;
    const today = startOfDay(new Date()).getTime();
    const yesterday = startOfDay(subDays(new Date(), 1)).getTime();

    if (completedDates[0] === today || completedDates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < completedDates.length; i++) {
        const diff = completedDates[i - 1] - completedDates[i];
        if (diff === 86400000) { // 1 day in ms
          streak++;
        } else {
          break;
        }
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate weekly data from actual tasks
  const getWeeklyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayTasks = tasks.filter(t => 
        t.completed_at && isSameDay(new Date(t.completed_at), date)
      ).length;
      days.push({
        day: format(date, "EEE"),
        tasks: dayTasks,
        focus: Math.round(dayTasks * 0.5 * 10) / 10, // Estimate focus hours
      });
    }
    return days;
  };

  const weeklyData = getWeeklyData();
  const maxTasks = Math.max(...weeklyData.map((d) => d.tasks), 1);
  const totalFocusHours = weeklyData.reduce((sum, d) => sum + d.focus, 0);

  const stats = {
    tasksCompleted: completedTasks,
    focusHours: Math.round(totalFocusHours),
    streak: currentStreak,
    productivity: productivity,
  };

  // Animate stats on mount
  useEffect(() => {
    if (tasksLoading) return;

    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        tasksCompleted: Math.round(stats.tasksCompleted * easeOut),
        focusHours: Math.round(stats.focusHours * easeOut),
        streak: Math.round(stats.streak * easeOut),
        productivity: Math.round(stats.productivity * easeOut),
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [tasksLoading, stats.tasksCompleted, stats.focusHours, stats.streak, stats.productivity]);

  // Calculate category stats from tasks
  const getCategoryStats = () => {
    const highPriority = tasks.filter(t => t.priority === "high");
    const mediumPriority = tasks.filter(t => t.priority === "medium");
    const lowPriority = tasks.filter(t => t.priority === "low");

    return [
      { 
        name: "High Priority", 
        completed: highPriority.filter(t => t.is_completed).length, 
        total: highPriority.length || 1, 
        color: "from-priority-high to-red-400" 
      },
      { 
        name: "Medium Priority", 
        completed: mediumPriority.filter(t => t.is_completed).length, 
        total: mediumPriority.length || 1, 
        color: "from-priority-medium to-yellow-400" 
      },
      { 
        name: "Low Priority", 
        completed: lowPriority.filter(t => t.is_completed).length, 
        total: lowPriority.length || 1, 
        color: "from-priority-low to-green-400" 
      },
    ];
  };

  const categoryStats = getCategoryStats();

  const focusTips = [
    {
      icon: Clock,
      title: "Peak Productivity Hours",
      description: "Your most productive time is between 9 AM - 12 PM. Schedule important tasks during this window.",
    },
    {
      icon: Target,
      title: "Task Batching",
      description: "Group similar tasks together to reduce context switching and improve efficiency.",
    },
    {
      icon: Sparkles,
      title: "Break Optimization",
      description: "Take a 5-minute break every 25 minutes to maintain high focus levels throughout the day.",
    },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: false },
    { icon: BarChart3, label: "Insights", path: "/insights", active: true },
    { icon: Settings, label: "Settings", path: "#", active: false },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || tasksLoading) {
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
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280 }}
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 pt-12 lg:pt-0"
          >
            <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
              Productivity <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-muted-foreground">Track your progress and optimize your workflow</p>
          </motion.div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">No Data Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start adding and completing tasks to see your productivity insights
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: CheckCircle2,
                label: "Tasks Completed",
                value: animatedStats.tasksCompleted,
                suffix: "",
                change: tasks.length > 0 ? `${totalTasks} total` : "Add tasks",
                positive: true,
                color: "from-primary/20 to-primary/5",
              },
              {
                icon: Clock,
                label: "Focus Hours",
                value: animatedStats.focusHours,
                suffix: "h",
                change: "This week",
                positive: true,
                color: "from-secondary/20 to-secondary/5",
              },
              {
                icon: Flame,
                label: "Day Streak",
                value: animatedStats.streak,
                suffix: " days",
                change: currentStreak > 0 ? "Keep it up!" : "Start today",
                positive: currentStreak > 0,
                color: "from-accent/20 to-accent/5",
              },
              {
                icon: TrendingUp,
                label: "Productivity",
                value: animatedStats.productivity,
                suffix: "%",
                change: productivity >= 50 ? "Great work!" : "Keep going",
                positive: productivity >= 50,
                color: "from-primary/20 to-secondary/5",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                className="glass-card p-4 sm:p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${stat.positive ? "text-priority-low" : "text-muted-foreground"}`}>
                      {stat.positive && <ArrowUp className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="font-heading text-2xl sm:text-3xl font-bold">
                    {stat.value}
                    <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Weekly Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="xl:col-span-2 glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-semibold">Weekly Overview</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Focus (h)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="relative w-full flex-1 flex items-end justify-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.tasks / maxTasks) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="w-5 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg min-h-[4px]"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.focus / 6) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="w-5 bg-gradient-to-t from-accent to-accent/50 rounded-t-lg min-h-[4px]"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Category Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glass-card p-6"
            >
              <h2 className="font-heading text-xl font-semibold mb-6">By Priority</h2>
              <div className="space-y-6">
                {categoryStats.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.completed}/{category.total}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.completed / category.total) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Focus Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-xl font-semibold">AI Focus Tips</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-5 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <tip.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Insights;

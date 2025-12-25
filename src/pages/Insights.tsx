import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Calendar,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
} from "lucide-react";

const Insights = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    tasksCompleted: 0,
    focusHours: 0,
    streak: 0,
    productivity: 0,
  });

  const stats = {
    tasksCompleted: 47,
    focusHours: 32,
    streak: 12,
    productivity: 87,
  };

  // Animate stats on mount
  useEffect(() => {
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
  }, []);

  const weeklyData = [
    { day: "Mon", tasks: 8, focus: 4.5 },
    { day: "Tue", tasks: 12, focus: 5.2 },
    { day: "Wed", tasks: 6, focus: 3.8 },
    { day: "Thu", tasks: 10, focus: 4.8 },
    { day: "Fri", tasks: 7, focus: 4.0 },
    { day: "Sat", tasks: 3, focus: 2.0 },
    { day: "Sun", tasks: 1, focus: 0.5 },
  ];

  const maxTasks = Math.max(...weeklyData.map((d) => d.tasks));

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

  const categoryStats = [
    { name: "Work", completed: 28, total: 32, color: "from-primary to-secondary" },
    { name: "Personal", completed: 12, total: 15, color: "from-secondary to-accent" },
    { name: "Learning", completed: 7, total: 10, color: "from-accent to-primary" },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: false },
    { icon: BarChart3, label: "Insights", path: "/insights", active: true },
    { icon: Settings, label: "Settings", path: "#", active: false },
  ];

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
              J
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
            <Link to="/">
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </Link>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: CheckCircle2,
                label: "Tasks Completed",
                value: animatedStats.tasksCompleted,
                suffix: "",
                change: "+12%",
                positive: true,
                color: "from-primary/20 to-primary/5",
              },
              {
                icon: Clock,
                label: "Focus Hours",
                value: animatedStats.focusHours,
                suffix: "h",
                change: "+8%",
                positive: true,
                color: "from-secondary/20 to-secondary/5",
              },
              {
                icon: Flame,
                label: "Day Streak",
                value: animatedStats.streak,
                suffix: " days",
                change: "Personal best!",
                positive: true,
                color: "from-accent/20 to-accent/5",
              },
              {
                icon: TrendingUp,
                label: "Productivity",
                value: animatedStats.productivity,
                suffix: "%",
                change: "+5%",
                positive: true,
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
                    <div className={`flex items-center gap-1 text-xs ${stat.positive ? "text-priority-low" : "text-priority-high"}`}>
                      {stat.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
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
                        className="w-5 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.focus / 6) * 100}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="w-5 bg-gradient-to-t from-accent to-accent/50 rounded-t-lg"
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
              <h2 className="font-heading text-xl font-semibold mb-6">Categories</h2>
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

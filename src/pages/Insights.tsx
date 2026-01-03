import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
  Trophy,
  Lightbulb,
  Brain,
  Rocket,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, Tooltip } from "recharts";

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
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights'>('overview');

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
        if (diff === 86400000) {
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
        fullDate: format(date, "MMM d"),
        tasks: dayTasks,
        focus: Math.round(dayTasks * 0.5 * 10) / 10,
      });
    }
    return days;
  };

  const weeklyData = getWeeklyData();
  const totalFocusHours = weeklyData.reduce((sum, d) => sum + d.focus, 0);
  const totalWeeklyTasks = weeklyData.reduce((sum, d) => sum + d.tasks, 0);

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
        name: "High", 
        completed: highPriority.filter(t => t.is_completed).length, 
        total: highPriority.length || 0, 
        color: "hsl(var(--priority-high))",
        fill: "hsl(0 84% 60%)",
      },
      { 
        name: "Medium", 
        completed: mediumPriority.filter(t => t.is_completed).length, 
        total: mediumPriority.length || 0, 
        color: "hsl(var(--priority-medium))",
        fill: "hsl(45 93% 58%)",
      },
      { 
        name: "Low", 
        completed: lowPriority.filter(t => t.is_completed).length, 
        total: lowPriority.length || 0, 
        color: "hsl(var(--priority-low))",
        fill: "hsl(142 76% 46%)",
      },
    ];
  };

  const categoryStats = getCategoryStats();

  // Pie chart data
  const pieData = categoryStats.map(cat => ({
    name: cat.name,
    value: cat.total,
    fill: cat.fill,
  })).filter(d => d.value > 0);

  // Radial progress data
  const radialData = [
    {
      name: "Productivity",
      value: productivity,
      fill: "hsl(var(--primary))",
    },
  ];

  const focusTips = [
    {
      icon: Clock,
      title: "Peak Productivity",
      description: "Your most productive time is between 9 AM - 12 PM. Schedule important tasks during this window.",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    {
      icon: Brain,
      title: "Smart Batching",
      description: "Group similar tasks together to reduce context switching and improve efficiency by up to 40%.",
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
    },
    {
      icon: Rocket,
      title: "Break Strategy",
      description: "Take a 5-minute break every 25 minutes to maintain high focus levels throughout the day.",
      gradient: "from-accent/20 via-accent/10 to-transparent",
    },
  ];

  const achievements = [
    { 
      icon: Trophy, 
      title: "First Steps", 
      description: "Complete your first task",
      unlocked: completedTasks >= 1,
      progress: Math.min(completedTasks, 1),
      target: 1,
    },
    { 
      icon: Flame, 
      title: "On Fire", 
      description: "Maintain a 3-day streak",
      unlocked: currentStreak >= 3,
      progress: Math.min(currentStreak, 3),
      target: 3,
    },
    { 
      icon: Target, 
      title: "Focused", 
      description: "Complete 10 tasks",
      unlocked: completedTasks >= 10,
      progress: Math.min(completedTasks, 10),
      target: 10,
    },
    { 
      icon: Sparkles, 
      title: "Productivity Pro", 
      description: "Reach 80% productivity",
      unlocked: productivity >= 80,
      progress: Math.min(productivity, 80),
      target: 80,
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

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 pt-12 lg:pt-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
                  Your <span className="gradient-text">Analytics</span>
                </h1>
                <p className="text-muted-foreground">Track your productivity journey and unlock insights</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(), "MMMM d, yyyy")}</span>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex gap-2 mb-8 p-1.5 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/50 w-fit"
          >
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-12 text-center mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3">No Data Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start adding and completing tasks to see your productivity insights come to life
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: CheckCircle2,
                      label: "Tasks Completed",
                      value: animatedStats.tasksCompleted,
                      suffix: "",
                      subtext: `of ${totalTasks} total`,
                      color: "from-primary to-primary/50",
                      bgColor: "from-primary/20 to-primary/5",
                      iconBg: "bg-primary/20",
                    },
                    {
                      icon: Clock,
                      label: "Focus Hours",
                      value: animatedStats.focusHours,
                      suffix: "h",
                      subtext: "This week",
                      color: "from-secondary to-secondary/50",
                      bgColor: "from-secondary/20 to-secondary/5",
                      iconBg: "bg-secondary/20",
                    },
                    {
                      icon: Flame,
                      label: "Day Streak",
                      value: animatedStats.streak,
                      suffix: "",
                      subtext: currentStreak > 0 ? "Keep it up! 🔥" : "Start today",
                      color: "from-orange-500 to-orange-500/50",
                      bgColor: "from-orange-500/20 to-orange-500/5",
                      iconBg: "bg-orange-500/20",
                    },
                    {
                      icon: TrendingUp,
                      label: "Productivity",
                      value: animatedStats.productivity,
                      suffix: "%",
                      subtext: productivity >= 50 ? "Great work!" : "Keep going",
                      color: "from-accent to-accent/50",
                      bgColor: "from-accent/20 to-accent/5",
                      iconBg: "bg-accent/20",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-60`} />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="font-heading text-3xl sm:text-4xl font-bold mb-1">
                          {stat.value}
                          <span className="text-xl text-muted-foreground">{stat.suffix}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground/80 mb-1">{stat.label}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Weekly Activity Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="xl:col-span-2 glass-card p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-heading text-xl font-semibold">Weekly Activity</h2>
                        <p className="text-sm text-muted-foreground mt-1">Tasks completed this week</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Activity className="w-4 h-4" />
                        {totalWeeklyTasks} tasks
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData}>
                          <defs>
                            <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="tasks"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#taskGradient)"
                            name="Tasks"
                          />
                          <Area
                            type="monotone"
                            dataKey="focus"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            fill="url(#focusGradient)"
                            name="Focus Hours"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">Tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-sm text-muted-foreground">Focus Hours</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Priority Distribution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-card p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-2">Priority Distribution</h2>
                    <p className="text-sm text-muted-foreground mb-6">Task breakdown by priority</p>

                    {pieData.length > 0 ? (
                      <>
                        <div className="h-48 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                  color: 'hsl(var(--foreground))'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-3 mt-4">
                          {categoryStats.map((cat, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: cat.fill }}
                                />
                                <span className="text-sm">{cat.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {cat.completed}/{cat.total}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        No tasks yet
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-6 glass-card p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-semibold">Achievements</h2>
                        <p className="text-sm text-muted-foreground">Unlock badges as you progress</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                          achievement.unlocked
                            ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5"
                            : "border-border/50 bg-muted/20 opacity-60"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                            : "bg-muted"
                        }`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`} />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                            className={`h-full rounded-full ${achievement.unlocked ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-muted-foreground"}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Productivity Gauge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="glass-card p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-2">Productivity Score</h2>
                    <p className="text-sm text-muted-foreground mb-6">Your overall task completion rate</p>

                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="90%"
                          barSize={20}
                          data={radialData}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar
                            background={{ fill: 'hsl(var(--muted))' }}
                            dataKey="value"
                            cornerRadius={10}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center">
                        <div className="font-heading text-5xl font-bold">{animatedStats.productivity}%</div>
                        <div className="text-sm text-muted-foreground">Productivity</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Task Completion Trend */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass-card p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-2">Task Completion Trend</h2>
                    <p className="text-sm text-muted-foreground mb-6">Daily tasks over the past week</p>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Bar 
                            dataKey="tasks" 
                            fill="hsl(var(--primary))" 
                            radius={[8, 8, 0, 0]}
                            name="Tasks"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Priority Progress */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="lg:col-span-2 glass-card p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-6">Priority Completion</h2>

                    <div className="space-y-6">
                      {categoryStats.map((category, index) => {
                        const percentage = category.total > 0 
                          ? Math.round((category.completed / category.total) * 100) 
                          : 0;
                        
                        return (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.fill }}
                                />
                                <span className="font-medium">{category.name} Priority</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                  {category.completed} of {category.total} completed
                                </span>
                                <span className="font-semibold text-lg">{percentage}%</span>
                              </div>
                            </div>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ backgroundColor: category.fill }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* AI Focus Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="glass-card p-6 mb-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-semibold">AI Productivity Tips</h2>
                      <p className="text-sm text-muted-foreground">Personalized recommendations for you</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {focusTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`relative overflow-hidden p-6 rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-300 group cursor-pointer`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${tip.gradient}`} />
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <tip.icon className="w-6 h-6 text-accent" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Stats Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-heading text-xl font-semibold mb-6">Your Summary</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Productivity Analysis</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {productivity >= 80 
                              ? "Outstanding! You're crushing it with an exceptional completion rate. Keep this momentum going!"
                              : productivity >= 50
                              ? "Good progress! You're completing tasks steadily. Try focusing on high-priority items first."
                              : "Room for growth! Start with smaller tasks to build momentum and increase your completion rate."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Flame className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Streak Insight</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {currentStreak >= 7
                              ? "Incredible! A week-long streak shows amazing dedication. You've built a powerful habit!"
                              : currentStreak >= 3
                              ? "Nice streak! You're building consistency. Just a few more days to make it a solid habit."
                              : currentStreak >= 1
                              ? "Great start! Complete a task tomorrow to keep your streak alive and growing."
                              : "Start your streak today! Complete at least one task to begin building your productivity habit."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Insights;

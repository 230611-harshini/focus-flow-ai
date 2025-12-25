import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Zap, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Sparkles,
  Target,
  Clock,
  Check,
  Trash2,
  Edit3,
  Calendar,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
}

const Dashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete project proposal", priority: "high", dueDate: "Today", completed: false },
    { id: "2", title: "Review team feedback", priority: "medium", dueDate: "Tomorrow", completed: false },
    { id: "3", title: "Update documentation", priority: "low", dueDate: "This week", completed: true },
    { id: "4", title: "Schedule client meeting", priority: "high", dueDate: "Today", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"high" | "medium" | "low">("medium");
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const aiSuggestions = [
    "Break down 'Complete project proposal' into smaller subtasks",
    "Schedule focus time for high-priority tasks in the morning",
    "Consider delegating 'Review team feedback' if overloaded",
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev - 1);
      }, 1000);
    } else if (focusTime === 0) {
      setIsTimerRunning(false);
      toast({
        title: "Focus session complete!",
        description: "Great job! Take a short break.",
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTime, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      priority: selectedPriority,
      dueDate: "Today",
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask("");
    toast({
      title: "Task added",
      description: `"${newTask}" has been added to your list.`,
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditValue(task.title);
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title: editValue } : task
    ));
    setEditingTask(null);
    setEditValue("");
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 pt-12 lg:pt-0"
          >
            <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
              Good morning, <span className="gradient-text">John</span>
            </h1>
            <p className="text-muted-foreground">Let's make today productive!</p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="xl:col-span-2 space-y-6">
              {/* Add Task */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex gap-3">
                    <Input
                      placeholder="Add a new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
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
                  <Button onClick={addTask} variant="glow" className="shrink-0">
                    <Plus className="w-5 h-5" />
                    Add Task
                  </Button>
                </div>
              </motion.div>

              {/* Task List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold">Today's Tasks</h2>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(t => !t.completed).length} remaining
                  </span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                          task.completed 
                            ? "bg-muted/30 border-border/30" 
                            : "bg-card/50 border-border hover:border-primary/30"
                        }`}
                      >
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            task.completed 
                              ? "bg-primary border-primary" 
                              : "border-muted-foreground hover:border-primary"
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
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
                            <p className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(task)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Focus Mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-heading text-lg font-semibold">Focus Mode</h2>
                  </div>
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      focusMode ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-foreground rounded-full transition-transform ${
                      focusMode ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>

                <AnimatePresence>
                  {focusMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <div className="text-center">
                          <div className="text-5xl font-heading font-bold gradient-text mb-2">
                            {formatTime(focusTime)}
                          </div>
                          <p className="text-sm text-muted-foreground">Pomodoro Timer</p>
                        </div>
                        {isTimerRunning && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-32 h-32 rounded-full border-4 border-primary/30 animate-pulse-ring" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="glass"
                          size="icon"
                          onClick={() => {
                            setFocusTime(25 * 60);
                            setIsTimerRunning(false);
                          }}
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="glow"
                          size="lg"
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="px-8"
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="w-5 h-5" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* AI Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="font-heading text-lg font-semibold">AI Suggestions</h2>
                </div>

                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/30 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  LayoutDashboard,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  User,
  Palette,
  Bell,
  MessageSquare,
  Shield,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Camera,
  Mail,
  Lock,
  Trash2,
  Menu,
  X,
  Send,
  Star,
  Check,
  Info,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ThemeMode = 'light' | 'dark' | 'system';
type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'feedback' | 'help';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Appearance state
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState('indigo');
  
  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  // Feedback state
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
      root.classList.toggle('light', !systemDark);
    } else {
      root.classList.toggle('dark', mode === 'dark');
      root.classList.toggle('light', mode === 'light');
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem('theme', mode);
    applyTheme(mode);
    toast.success(`Theme changed to ${mode}`);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    // Simulate sending feedback (in real app, you'd save to database or send to external service)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for your feedback! We appreciate it.');
    setFeedbackMessage('');
    setRating(0);
    setIsSubmittingFeedback(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: false },
    { icon: BarChart3, label: "Insights", path: "/insights", active: false },
    { icon: SettingsIcon, label: "Settings", path: "/settings", active: true },
  ];

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const accentColors = [
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'cyan', color: 'bg-cyan-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'pink', color: 'bg-pink-500' },
    { name: 'green', color: 'bg-green-500' },
  ];

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 pt-12 lg:pt-0"
          >
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Tabs - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className="glass-card p-2 space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1"
            >
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Profile Card */}
                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Profile Information
                      </h2>
                      
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-primary-foreground text-3xl font-bold">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{userName}</h3>
                          <p className="text-sm text-muted-foreground">{userEmail}</p>
                          <p className="text-xs text-muted-foreground mt-1">Member since {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-muted/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              value={email}
                              disabled
                              className="bg-muted/30 pr-10"
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>

                        <Button 
                          onClick={handleUpdateProfile}
                          disabled={isUpdatingProfile}
                          className="w-full sm:w-auto"
                        >
                          {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Security
                      </h2>
                      
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <div className="text-left">
                              <p className="font-medium">Change Password</p>
                              <p className="text-sm text-muted-foreground">Update your account password</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors group border border-destructive/20">
                          <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-destructive" />
                            <div className="text-left">
                              <p className="font-medium text-destructive">Delete Account</p>
                              <p className="text-sm text-destructive/70">Permanently delete your account</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-destructive group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        Theme
                      </h2>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { mode: 'light' as ThemeMode, icon: Sun, label: 'Light' },
                          { mode: 'dark' as ThemeMode, icon: Moon, label: 'Dark' },
                          { mode: 'system' as ThemeMode, icon: Monitor, label: 'System' },
                        ].map((item) => (
                          <button
                            key={item.mode}
                            onClick={() => handleThemeChange(item.mode)}
                            className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
                              theme === item.mode
                                ? "border-primary bg-primary/10"
                                : "border-border/50 hover:border-primary/50 bg-muted/20"
                            }`}
                          >
                            {theme === item.mode && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              theme === item.mode ? "bg-primary/20" : "bg-muted"
                            }`}>
                              <item.icon className={`w-6 h-6 ${theme === item.mode ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`font-medium ${theme === item.mode ? "text-primary" : ""}`}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6">Accent Color</h2>
                      
                      <div className="flex flex-wrap gap-3">
                        {accentColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => {
                              setAccentColor(color.name);
                              toast.success(`Accent color changed to ${color.name}`);
                            }}
                            className={`w-12 h-12 rounded-xl ${color.color} transition-all duration-300 ${
                              accentColor === color.name
                                ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110"
                                : "hover:scale-105"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        <Info className="w-4 h-4 inline mr-1" />
                        Accent color customization coming soon
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6"
                  >
                    <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      {[
                        {
                          id: 'email',
                          label: 'Email Notifications',
                          description: 'Receive email updates about your tasks',
                          checked: emailNotifications,
                          onChange: setEmailNotifications,
                        },
                        {
                          id: 'push',
                          label: 'Push Notifications',
                          description: 'Get browser push notifications',
                          checked: pushNotifications,
                          onChange: setPushNotifications,
                        },
                        {
                          id: 'reminder',
                          label: 'Task Reminders',
                          description: 'Receive reminders for upcoming tasks',
                          checked: reminderNotifications,
                          onChange: setReminderNotifications,
                        },
                        {
                          id: 'digest',
                          label: 'Weekly Digest',
                          description: 'Get a weekly summary of your productivity',
                          checked: weeklyDigest,
                          onChange: setWeeklyDigest,
                        },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                              item.onChange(checked);
                              toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Feedback Tab */}
                {activeTab === 'feedback' && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Send Feedback
                      </h2>
                      
                      {/* Feedback Type */}
                      <div className="mb-6">
                        <Label className="mb-3 block">What type of feedback?</Label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { id: 'general', label: 'General' },
                            { id: 'feature', label: 'Feature Request' },
                            { id: 'bug', label: 'Bug Report' },
                          ].map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setFeedbackType(type.id as typeof feedbackType)}
                              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                feedbackType === type.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-6">
                        <Label className="mb-3 block">How would you rate your experience?</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  star <= rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-6">
                        <Label htmlFor="feedback" className="mb-2 block">Your Feedback</Label>
                        <Textarea
                          id="feedback"
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          placeholder="Tell us what's on your mind..."
                          className="min-h-[150px] bg-muted/50"
                        />
                      </div>

                      <Button 
                        onClick={handleSubmitFeedback}
                        disabled={isSubmittingFeedback}
                        className="w-full sm:w-auto"
                      >
                        {isSubmittingFeedback ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Help Tab */}
                {activeTab === 'help' && (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-6">
                      <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        Help & Support
                      </h2>
                      
                      <div className="space-y-4">
                        {[
                          {
                            title: "Getting Started Guide",
                            description: "Learn the basics of FocusFlow",
                            icon: "📚",
                          },
                          {
                            title: "FAQ",
                            description: "Frequently asked questions",
                            icon: "❓",
                          },
                          {
                            title: "Contact Support",
                            description: "Get help from our team",
                            icon: "💬",
                          },
                          {
                            title: "Keyboard Shortcuts",
                            description: "Speed up your workflow",
                            icon: "⌨️",
                          },
                        ].map((item, index) => (
                          <button
                            key={index}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <div className="text-left flex-1">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold mb-2">FocusFlow v1.0</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Built with ❤️ for productivity enthusiasts
                      </p>
                      <p className="text-xs text-muted-foreground">
                        © 2024 FocusFlow. All rights reserved.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

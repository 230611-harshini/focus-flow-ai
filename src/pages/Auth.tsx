import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  Github,
  Chrome,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleToggle = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsFlipping(false);
      }, 50);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your account.",
          });
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully.",
          });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "AI-powered task suggestions",
    "Smart priority management",
    "Real-time collaboration",
    "Productivity analytics"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Flip Card Container */}
      <div className="relative w-full max-w-5xl h-[700px] perspective-1000">
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: isFlipping ? (isLogin ? 0 : 180) : (isLogin ? 0 : 180),
          }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          {/* Front Side - Login */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="glass-card h-full rounded-3xl overflow-hidden grid lg:grid-cols-2">
              {/* Left - Branding */}
              <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent relative overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />
                </div>
                
                <div className="relative z-10">
                  <Link to="/" className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-2xl text-foreground">FocusFlow</span>
                  </Link>
                  
                  <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                    Welcome back to
                    <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      productivity
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Sign in to continue your journey towards peak efficiency.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-3 text-foreground/80"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div className="flex flex-col justify-center p-8 lg:p-10">
                <div className="lg:hidden mb-8">
                  <Link to="/" className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-xl text-foreground">FocusFlow</span>
                  </Link>
                </div>

                <h1 className="font-heading text-2xl font-bold mb-2">Sign in</h1>
                <p className="text-muted-foreground mb-6">Enter your credentials to continue</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="login-email" className="text-sm font-medium mb-2 block">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium mb-2 block">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="glass" size="lg" className="w-full" disabled>
                    <Chrome className="w-5 h-5" />
                    Google
                  </Button>
                  <Button variant="glass" size="lg" className="w-full" disabled>
                    <Github className="w-5 h-5" />
                    GitHub
                  </Button>
                </div>

                <p className="text-center mt-6 text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Back Side - Sign Up */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="glass-card h-full rounded-3xl overflow-hidden grid lg:grid-cols-2">
              {/* Left - Form */}
              <div className="flex flex-col justify-center p-8 lg:p-10 order-2 lg:order-1">
                <div className="lg:hidden mb-8">
                  <Link to="/" className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-xl text-foreground">FocusFlow</span>
                  </Link>
                </div>

                <h1 className="font-heading text-2xl font-bold mb-2">Create account</h1>
                <p className="text-muted-foreground mb-6">Start your productivity journey today</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-sm font-medium mb-2 block">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-medium mb-2 block">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-sm font-medium mb-2 block">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <>
                        Create Account
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="glass" size="lg" className="w-full" disabled>
                    <Chrome className="w-5 h-5" />
                    Google
                  </Button>
                  <Button variant="glass" size="lg" className="w-full" disabled>
                    <Github className="w-5 h-5" />
                    GitHub
                  </Button>
                </div>

                <p className="text-center mt-6 text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              {/* Right - Branding */}
              <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-bl from-secondary/10 via-accent/5 to-transparent relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0">
                  <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
                </div>
                
                <div className="relative z-10">
                  <Link to="/" className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-2xl text-foreground">FocusFlow</span>
                  </Link>
                  
                  <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                    Start your
                    <span className="block bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                      productivity journey
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Join thousands of professionals achieving their goals with FocusFlow.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="flex items-center gap-3 text-foreground/80"
                    >
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

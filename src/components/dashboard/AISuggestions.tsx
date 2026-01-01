import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, Loader2, Target, Clock, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  priority: string;
  is_completed: boolean;
  due_date: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AISuggestionsProps {
  tasks?: Task[];
}

const quickSuggestions = [
  { text: "How should I prioritize my tasks?", icon: Target },
  { text: "Give me a productivity tip", icon: Lightbulb },
  { text: "Help me plan my day", icon: Clock },
  { text: "How can I stay focused?", icon: Zap },
];

export const AISuggestions = ({ tasks = [] }: AISuggestionsProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate initial suggestions based on tasks
  useEffect(() => {
    if (tasks.length > 0 && messages.length === 0) {
      const pendingTasks = tasks.filter(t => !t.is_completed);
      const highPriorityTasks = pendingTasks.filter(t => t.priority === "high");
      
      let greeting = "👋 Hi! I'm your AI productivity assistant. ";
      
      if (pendingTasks.length === 0) {
        greeting += "Great job - you've completed all your tasks! Want some tips for planning ahead?";
      } else if (highPriorityTasks.length > 0) {
        greeting += `I see you have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''}. Would you like help prioritizing or breaking them down?`;
      } else {
        greeting += `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''}. Ask me anything about productivity or task management!`;
      }
      
      setMessages([{ role: "assistant", content: greeting }]);
    } else if (tasks.length === 0 && messages.length === 0) {
      setMessages([{ 
        role: "assistant", 
        content: "👋 Hi! I'm your AI productivity assistant. Add some tasks and I can help you prioritize and manage them effectively. Or ask me any productivity questions!" 
      }]);
    }
  }, [tasks]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: messageText, tasks }
      });

      if (error) throw error;

      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.reply || "I couldn't process that. Please try again." 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickSuggestion = (text: string) => {
    sendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-6 flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">
            {tasks.length > 0 
              ? `Aware of your ${tasks.length} task${tasks.length > 1 ? 's' : ''}` 
              : "Ask me anything about productivity"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === "user" 
                    ? "bg-primary/20" 
                    : "bg-gradient-to-br from-accent/20 to-primary/20"
                }`}>
                  {message.role === "user" 
                    ? <User className="w-4 h-4 text-primary" />
                    : <Bot className="w-4 h-4 text-accent" />
                  }
                </div>
                <div className={`flex-1 p-3 rounded-xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "bg-muted/50 text-foreground"
                }`}>
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length <= 1 && !isLoading && (
        <div className="flex flex-wrap gap-2 my-4">
          {quickSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleQuickSuggestion(suggestion.text)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {suggestion.text}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-border/50">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about productivity..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

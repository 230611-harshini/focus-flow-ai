import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Bell, 
  Mail, 
  Smartphone, 
  Clock,
  Calendar
} from "lucide-react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: { time: Date; type: 'email' | 'in_app' | 'both' }) => void;
  taskTitle: string;
  dueDate?: Date;
}

export const ReminderModal = ({ isOpen, onClose, onSave, taskTitle, dueDate }: ReminderModalProps) => {
  const [reminderType, setReminderType] = useState<'email' | 'in_app' | 'both'>('both');
  const [reminderDate, setReminderDate] = useState(
    dueDate ? new Date(dueDate.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16) : ''
  );

  const handleSave = () => {
    if (!reminderDate) return;
    onSave({
      time: new Date(reminderDate),
      type: reminderType,
    });
    onClose();
  };

  const reminderTypes = [
    { id: 'email' as const, label: 'Email Only', icon: Mail, description: 'Get notified via email' },
    { id: 'in_app' as const, label: 'In-App Only', icon: Smartphone, description: 'Get notified in the app' },
    { id: 'both' as const, label: 'Both', icon: Bell, description: 'Get email + in-app notifications' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-semibold">Set Reminder</h2>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {taskTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reminder Time */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Reminder Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {dueDate && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Task due: {dueDate.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Reminder Type */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Notification Method</Label>
                <div className="space-y-2">
                  {reminderTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setReminderType(type.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        reminderType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        reminderType === type.id ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <type.icon className={`w-4 h-4 ${
                          reminderType === type.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  variant="glow" 
                  onClick={handleSave} 
                  className="flex-1"
                  disabled={!reminderDate}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

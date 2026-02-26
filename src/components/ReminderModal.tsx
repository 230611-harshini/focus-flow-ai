import { useState, useMemo } from "react";
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
  
  const getDefaultValues = () => {
    if (!dueDate) return { date: '', hour: '12', minute: '00', period: 'PM' as const };
    const d = new Date(dueDate.getTime() - 60 * 60 * 1000);
    const h = d.getHours();
    return {
      date: d.toISOString().slice(0, 10),
      hour: String(h === 0 ? 12 : h > 12 ? h - 12 : h).padStart(2, '0'),
      minute: String(d.getMinutes()).padStart(2, '0'),
      period: (h >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    };
  };

  const defaults = useMemo(getDefaultValues, [dueDate]);
  const [reminderDateStr, setReminderDateStr] = useState(defaults.date);
  const [hour, setHour] = useState(defaults.hour);
  const [minute, setMinute] = useState(defaults.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(defaults.period);

  const handleSave = () => {
    if (!reminderDateStr || !hour || !minute) return;
    let h = parseInt(hour);
    if (period === 'AM' && h === 12) h = 0;
    if (period === 'PM' && h !== 12) h += 12;
    const dateTime = new Date(`${reminderDateStr}T${String(h).padStart(2, '0')}:${minute}:00`);
    onSave({
      time: dateTime,
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
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={reminderDateStr}
                      onChange={(e) => setReminderDateStr(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={hour}
                      onChange={(e) => setHour(e.target.value.slice(0, 2))}
                      className="w-16 text-center"
                      placeholder="HH"
                    />
                    <span className="flex items-center text-muted-foreground font-bold">:</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={minute}
                      onChange={(e) => setMinute(e.target.value.slice(0, 2).padStart(2, '0'))}
                      className="w-16 text-center"
                      placeholder="MM"
                    />
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPeriod('AM')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          period === 'AM'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod('PM')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          period === 'PM'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
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
                  disabled={!reminderDateStr || !hour || !minute}
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

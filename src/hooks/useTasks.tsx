import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskReminder {
  id: string;
  task_id: string;
  reminder_time: string;
  reminder_type: 'email' | 'in_app' | 'both';
  is_sent: boolean;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      toast({ title: 'Error', description: 'Failed to load tasks', variant: 'destructive' });
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (
    title: string,
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date,
    description?: string,
    reminder?: { time: Date; type: 'email' | 'in_app' | 'both' }
  ) => {
    if (!user) return null;

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        priority,
        description: description || null,
        due_date: dueDate?.toISOString() || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to add task', variant: 'destructive' });
      return null;
    }

    // Add reminder if provided
    if (reminder && task) {
      await addReminder(task.id, reminder.time, reminder.type);
    }

    setTasks([task as Task, ...tasks]);
    toast({ title: 'Task added', description: `"${title}" has been added to your list.` });
    return task;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
      return false;
    }

    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    return true;
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updates = {
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : null,
    };

    await updateTask(id, updates);
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
      return false;
    }

    setTasks(tasks.filter(t => t.id !== id));
    toast({ title: 'Task deleted', description: 'The task has been removed.' });
    return true;
  };

  const addReminder = async (taskId: string, reminderTime: Date, reminderType: 'email' | 'in_app' | 'both') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('task_reminders')
      .insert({
        task_id: taskId,
        user_id: user.id,
        reminder_time: reminderTime.toISOString(),
        reminder_type: reminderType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding reminder:', error);
      return null;
    }

    return data;
  };

  const getTaskReminders = async (taskId: string) => {
    const { data, error } = await supabase
      .from('task_reminders')
      .select('*')
      .eq('task_id', taskId)
      .order('reminder_time', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }

    return data as TaskReminder[];
  };

  const deleteReminder = async (reminderId: string) => {
    const { error } = await supabase
      .from('task_reminders')
      .delete()
      .eq('id', reminderId);

    return !error;
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    addReminder,
    getTaskReminders,
    deleteReminder,
    refetch: fetchTasks,
  };
};

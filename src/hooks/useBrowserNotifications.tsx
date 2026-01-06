import { useState, useEffect, useCallback } from 'react';

export const useBrowserNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      console.log('Notifications not available or not permitted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: 'https://cdn-icons-png.flaticon.com/512/2964/2964522.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2964/2964522.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const sendTaskReminder = useCallback((taskTitle: string) => {
    return sendNotification(`⏰ Task Reminder`, {
      body: `Don't forget: ${taskTitle}`,
      tag: 'task-reminder',
      requireInteraction: true,
    });
  }, [sendNotification]);

  const sendBreakEndReminder = useCallback((activity: 'games' | 'music') => {
    const messages = {
      games: "Time to get back to work! You've been playing for a while. 🎯",
      music: "Break time is over! Ready to continue being productive? 💪",
    };

    return sendNotification(`🔔 Break Reminder`, {
      body: messages[activity],
      tag: 'break-reminder',
      requireInteraction: true,
    });
  }, [sendNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    sendTaskReminder,
    sendBreakEndReminder,
  };
};

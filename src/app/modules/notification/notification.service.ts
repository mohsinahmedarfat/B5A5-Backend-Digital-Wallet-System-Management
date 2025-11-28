import { Notification } from "./notification.model";

const getNotifications = async () => {
  // populate the user field with user details
  const notifications = await Notification.find().populate(
    "user",
    "name email role isBlocked"
  );

  return notifications;
};

const getNotificationMe = async (userId: string) => {
  const notification = await Notification.find({ user: userId }).populate(
    "user",
    "name email"
  );
  return {
    data: notification,
  };
};

export const NotificationServices = {
  getNotifications,
  getNotificationMe
};
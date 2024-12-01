import { type GetNotificationListResponse } from "@agenda/proto/notification";

import "./Notifications.css";

import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { NotificationService } from "../../services/notification.service";
import socket from "../../socket";

interface OnNotificationData {
  id: string;
  action: string;
  error: string;
  eventId: number;
  message: string;
  userId: number;
  viewed: boolean;
}

const Notifications: React.FC = () => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<
    GetNotificationListResponse["notifications"]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notifications-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    if (user) {
      NotificationService.getAllUserNotifications(token, user.id)
        .then((response) => setNotifications(response))
        .catch((error) =>
          console.error("Failed to fetch notifications:", error),
        );
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, token, user]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      if (user?.id) {
        const room = `user-${user.id}`;
        socket.emit("joinRoom", room);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on(`notification`, (data: OnNotificationData) => {
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }
      onNotification(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
      socket.disconnect();
    };
  }, [user?.id]);

  const onNotification = (data: OnNotificationData) => {
    switch (data.action) {
      case "add": {
        setNotifications((previousNotifications) => [
          ...previousNotifications,
          {
            id: data.id,
            userId: data.userId,
            eventId: data.eventId,
            viewed: data.viewed,
          },
        ]);
        break;
      }
      case "remove": {
        setNotifications((previousNotifications) =>
          previousNotifications.filter(
            (notification) => notification.id !== data.id,
          ),
        );
        break;
      }
      case "update": {
        setNotifications((previousNotifications) =>
          previousNotifications.map((notification) =>
            notification.id === data.id
              ? { ...notification, viewed: data.viewed }
              : notification,
          ),
        );
        break;
      }

      default: {
        console.log(data);
        break;
      }
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    try {
      await NotificationService.deleteNotification(
        token,
        notificationId,
        user.id,
      );
      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const updateNotifications = async (
    notificationId: string,
    notificationViewed: boolean,
  ) => {
    if (!user) return;
    try {
      await NotificationService.updateNotifications(token, {
        notifications: [
          {
            id: notificationId,
            userId: user.id,
            viewed: !notificationViewed,
          },
        ],
      });
      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, viewed: !notification.viewed }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  return (
    <div className="notifications-container">
      <button className="toggle" onClick={toggleNotifications}>
        Notifications
        <span>
          {notifications.filter((notification) => !notification.viewed).length}
        </span>
      </button>

      <div className={`notifications ${isOpen ? "open" : "closed"}`}>
        {notifications.length === 0 ? (
          <p>Pas de notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification${notification.viewed ? " seen" : ""}`}
            >
              <button
                onClick={() =>
                  updateNotifications(notification.id, notification.viewed)
                }
              >
                {notification.viewed
                  ? "Marquer comme non lu"
                  : "Marquer comme lu"}
              </button>
              <p>Vous avez été ajouté à l&apos;évent {notification.eventId}</p>
              <button onClick={() => deleteNotification(notification.id)}>
                x
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

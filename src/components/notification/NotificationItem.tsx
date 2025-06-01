// components/notification/NotificationItem.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/types/notification";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react"; // Import the X icon

export const NotificationItem = ({ notification }: { notification: Notification }) => {
    const { deleteNotification } = useNotificationStore();
    const navigate = useNavigate();
    const [actor, setActor] = useState<{ fullName: string; avatar?: string } | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    console.log("Rendering notification:", notification);

    useEffect(() => {
        const fetchActorData = async () => {
            try {
                setLoadingUser(true);
                const actorId = notification.actor;

                if (actorId) {
                    const userData = await userService.getUserById(actorId);
                    setActor({
                        fullName: userData.fullName,
                        avatar: userData.avatar
                    });
                }
            } catch (error) {
                console.error("Failed to fetch actor data:", error);
                setActor({
                    fullName: "Unknown User",
                    avatar: undefined
                });
            } finally {
                setLoadingUser(false);
            }
        };

        fetchActorData();
    }, [notification]);

    if (!notification) {
        console.warn("Notification is undefined or null");
        return null;
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the notification click
        console.log("Deleting notification:", notification._id);
        try {
            await deleteNotification(notification._id);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleNotificationClick = () => {
        console.log("Notification clicked:", notification._id);
        if (notification.type.includes('Match')) {
            navigate('/matches');
        } else if (notification.type.includes('Friend')) {
            navigate('/friends');
        }
    };

    const getNotificationMessage = () => {
        try {
            const actorName = actor?.fullName || "Unknown user";

            switch (notification.type) {
                case 'MatchInvite':
                    return (
                        <div className="flex items-center gap-2">
                            <span>
                                <span className="font-medium">{actorName}</span> invited you to a match
                            </span>
                        </div>
                    );
                case 'MatchInviteAccepted':
                    return (
                        <span>
                            <span className="font-medium">{actorName}</span> accepted your match invitation
                        </span>
                    );
                case 'MatchCancelled':
                    return (
                        <span>
                            <span className="font-medium">{actorName}</span> cancelled the match
                        </span>
                    );
                case 'FriendRequest':
                    return (
                        <div className="flex items-center gap-2">
                            <span>
                                <span className="font-medium">{actorName}</span> sent you a friend request
                            </span>
                        </div>
                    );
                default:
                    return (
                        <span>
                            New notification from <span className="font-medium">{actorName}</span>
                        </span>
                    );
            }
        } catch (error) {
            console.error("Error rendering notification message:", error);
            return <span>Notification content couldn't be displayed</span>;
        }
    };

    if (loadingUser) {
        return (
            <div className="p-3 flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                </div>
            </div>
        );
    }

    const initials = actor?.fullName
        ? actor.fullName.split(' ').map(n => n[0]).join('')
        : '?';

    return (
        <div
            className="p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={handleNotificationClick}
        >
            <Avatar className="h-10 w-10 border-2 border-blue-200">
                <AvatarImage src={actor?.avatar} alt={actor?.fullName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700">
                    {getNotificationMessage()}
                </div>
                {notification.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                )}
            </div>
            {/* Delete button (red cross) */}
            <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                aria-label="Delete notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
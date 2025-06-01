// pages/notifications.tsx
import { Bell } from "lucide-react"
import PageLayout from '@/components/layout/PageLayout'
import { NotificationItem } from "@/components/notification/NotificationItem"
import { useEffect } from "react"
import { useNotificationStore } from "@/store/notificationStore"

export default function NotificationsPage() {
    const {
        notifications,
        isLoading,
        error,
        fetchNotifications,
        clearNotifications
    } = useNotificationStore()

    useEffect(() => {
        fetchNotifications()
        return () => {
            // Optional: Clear notifications when leaving the page
            // clearNotifications()
        }
    }, [fetchNotifications])

    if (isLoading) return <PageLayout>Loading notifications...</PageLayout>
    if (error) return <PageLayout>Error: {error}</PageLayout>

    return (
        <PageLayout>
            <div className="max-w-5xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-500" />
                            <h2 className="font-semibold text-gray-800">Notifications</h2>
                            {notifications.length > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={clearNotifications}
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
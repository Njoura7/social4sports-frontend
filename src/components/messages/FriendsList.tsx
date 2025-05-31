/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Loader2 } from 'lucide-react';
import { IFriend } from '@/services/friendService'; // Import your IFriend type

interface FriendsListProps {
    friends: IFriend[];
    searchText: string;
    onSearchChange: (text: string) => void;
    onFriendSelect: (friendId: string) => void;
    activeChat: string | null;
    messages: Record<string, any[]>;
    unreadCounts: Record<string, number>;
    onlineUsers: Set<string>;
    isLoading: boolean;
}

const FriendsList = ({
    friends,
    searchText,
    onSearchChange,
    onFriendSelect,
    activeChat,
    messages,
    unreadCounts,
    onlineUsers,
    isLoading,
}: FriendsListProps) => {
    const filteredFriends = useMemo(() => {
        if (!searchText.trim()) return friends;

        return friends.filter(friend =>
            friend.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [friends, searchText]);

    const getLastMessage = (friendId: string) => {
        const friendMessages = messages[friendId];
        if (!friendMessages || friendMessages.length === 0) return null;
        return friendMessages[friendMessages.length - 1];
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-center h-32">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Loading friends...</span>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-sport-blue" />
                <h2 className="font-semibold">Friends ({friends.length})</h2>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search friends..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredFriends.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                            {searchText ? 'No friends match your search' : 'No friends yet'}
                        </p>
                    </div>
                ) : (
                    filteredFriends.map((friend) => {
                        const lastMessage = getLastMessage(friend._id);
                        const unreadCount = unreadCounts[friend._id] || 0;
                        const isOnline = onlineUsers.has(friend._id);
                        const isActive = activeChat === friend._id;

                        return (
                            <div
                                key={friend._id}
                                onClick={() => onFriendSelect(friend._id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive
                                    ? 'bg-sport-blue/10 border border-sport-blue/20'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={friend.avatar} alt={friend.fullName} />
                                            <AvatarFallback className="bg-sport-blue/10 text-sport-blue">
                                                {getInitials(friend.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isOnline && (
                                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-sm truncate">
                                                {friend.fullName}
                                            </p>
                                            {unreadCount > 0 && (
                                                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </Badge>
                                            )}
                                        </div>

                                        {lastMessage ? (
                                            <p className="text-xs text-gray-500 truncate">
                                                {lastMessage.content}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">
                                                No messages yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

export default FriendsList;
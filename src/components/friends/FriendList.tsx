// src/components/friends/FriendList.tsx
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Friend } from '@/types/friend';
import { Link } from 'react-router-dom';

interface FriendListProps {
    friends: Friend[];
    loading: boolean;
}

export const FriendList = ({ friends, loading }: FriendListProps) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (friends.length === 0) {
        return <p className="text-center py-4 text-muted-foreground">No friends yet</p>;
    }

    return (
        <div className="space-y-4">
            {friends.map((friend) => (
                <Link to={`/users/${friend._id}`}>
                    <Card key={friend._id} className="p-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={friend.avatar} />
                                <AvatarFallback>{friend.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">{friend.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{friend.email}</p>
                                <p className="text-xs text-muted-foreground">
                                    Friends since: {new Date(friend.since).toLocaleDateString()}
                                </p>
                                {friend.system && (
                                    <p className="text-xs text-muted-foreground">
                                        System: {friend.system}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
};
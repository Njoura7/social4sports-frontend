// src/components/friends/SentRequestsList.tsx
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { FriendRequest } from '@/types/friend';

interface SentRequestsListProps {
    requests: FriendRequest[];
    loading: boolean;
}

export const SentRequestsList = ({
    requests,
    loading
}: SentRequestsListProps) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (requests.length === 0) {
        return <p className="text-center py-4 text-muted-foreground">No sent requests</p>;
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <Card key={request._id} className="p-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={request.recipient.avatar} />
                            <AvatarFallback>
                                {request.recipient.fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium">{request.recipient.fullName}</h3>
                            <p className="text-sm text-muted-foreground">
                                {request.recipient.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Sent: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                Status: {request.status}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
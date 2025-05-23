// src/components/friends/ReceivedRequestsList.tsx
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { FriendRequest } from '@/types/friend';
import { useAuth } from '@/contexts/AuthContext';
import { useFriendStore } from '@/store/friendStore';

interface ReceivedRequestsListProps {
  requests: FriendRequest[];
  loading: boolean;
}

export const ReceivedRequestsList = ({
  requests,
  loading
}: ReceivedRequestsListProps) => {
  const { user } = useAuth();
  const { respondRequest } = useFriendStore();
  const handleRespond = async (requestId: string, accept: boolean) => {
    if (!user?._id) return;
    await respondRequest(requestId, user._id, accept);
  };

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
    return <p className="text-center py-4 text-muted-foreground">No pending requests</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request._id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={request.requester.avatar} />
                <AvatarFallback>
                  {request.requester.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{request.requester.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {request.requester.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sent: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleRespond(request._id, true)}>
                Accept
              </Button>
              <Button onClick={() => handleRespond(request._id, false)}>
                Decline
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
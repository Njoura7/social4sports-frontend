import { useAuth } from '@/hooks/useAuth';
import { useFriendStore } from '@/store/friendStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

type ConnectionStatus = 'none' | 'pending-sent' | 'pending-received' | 'friends';

interface ConnectionButtonProps {
    targetUserId: string;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
}

export const ConnectionButton = ({
    targetUserId,
    className = '',
    size = 'default',
    variant = 'default',
}: ConnectionButtonProps) => {
    const { user } = useAuth();
    const {
        friends,
        sentRequests,
        receivedRequests,
        sendRequest,
        respondRequest,
        fetchFriends,
        fetchSentRequests,
        fetchReceivedRequests,
    } = useFriendStore();

    const [status, setStatus] = useState<ConnectionStatus>('none');
    const [loading, setLoading] = useState(false);

    const updateConnectionStatus = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            await Promise.all([
                fetchFriends(user._id),
                fetchSentRequests(user._id),
                fetchReceivedRequests(user._id),
            ]);

            const isFriend = friends.some(friend => friend._id === targetUserId);
            const sentRequest = sentRequests.some(req => req.recipient._id === targetUserId);
            const receivedRequest = receivedRequests.some(req => req.requester._id === targetUserId);

            if (isFriend) setStatus('friends');
            else if (sentRequest) setStatus('pending-sent');
            else if (receivedRequest) setStatus('pending-received');
            else setStatus('none');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(updateConnectionStatus, 100);
        return () => clearTimeout(timer);
    }, [user?._id, targetUserId]);

    const handleSendRequest = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            await sendRequest(user._id, targetUserId);
            setStatus('pending-sent');
            toast.success('Connection request sent');
        } catch {
            toast.error('Failed to send connection request');
        } finally {
            setLoading(false);
        }
    };

    const handleRespondRequest = async (accept: boolean) => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const request = receivedRequests.find(req => req.requester._id === targetUserId);
            if (!request) throw new Error('Request not found');

            await respondRequest(request._id, user._id, accept);
            setStatus(accept ? 'friends' : 'none');
            toast.success(accept ? 'Connection accepted' : 'Connection declined');
        } catch {
            toast.error(`Failed to ${accept ? 'accept' : 'decline'} connection`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && status === 'none') {
        return <Button variant={variant} size={size} className={className} disabled>Loading...</Button>;
    }

    const buttonMap = {
        'none': (
            <Button variant={variant} size={size} className={className} onClick={handleSendRequest} disabled={loading}>
                {loading ? 'Sending...' : 'Connect'}
            </Button>
        ),
        'pending-sent': (
            <Button variant="outline" size={size} className={className} disabled>
                Request Sent
            </Button>
        ),
        'pending-received': (
            <div className={`flex gap-2 ${className}`}>
                <Button size={size} onClick={() => handleRespondRequest(true)} disabled={loading}>
                    {loading ? 'Accepting...' : 'Accept'}
                </Button>
                <Button variant="outline" size={size} onClick={() => handleRespondRequest(false)} disabled={loading}>
                    Decline
                </Button>
            </div>
        ),
        'friends': (
            <Button variant="secondary" size={size} className={className} disabled>
                Friends
            </Button>
        ),
    };

    return buttonMap[status] ?? null;
};

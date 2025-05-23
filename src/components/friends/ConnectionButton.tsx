// src/components/ConnectionButton.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useFriendStore } from '@/store/friendStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ConnectionButtonProps {
    targetUserId: string;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
}

export const ConnectionButton = ({
    targetUserId,
    className,
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
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<ConnectionStatus>('none');

    // Determine the current connection status
    useEffect(() => {
        if (!user?._id) return;

        const checkStatus = async () => {
            setLoading(true);
            try {
                // Ensure we have fresh data
                await Promise.all([
                    fetchFriends(user._id),
                    fetchSentRequests(user._id),
                    fetchReceivedRequests(user._id),
                ]);

                // Check if already friends
                const isFriend = friends.some(friend => friend._id === targetUserId);
                if (isFriend) {
                    setStatus('friends');
                    return;
                }

                // Check if request was sent
                const sentRequest = sentRequests.find(req => req.recipient._id === targetUserId);
                if (sentRequest) {
                    setStatus('pending-sent');
                    return;
                }

                // Check if request was received
                const receivedRequest = receivedRequests.find(req => req.requester._id === targetUserId);
                if (receivedRequest) {
                    setStatus('pending-received');
                    return;
                }

                // No connection exists
                setStatus('none');
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [user?._id, targetUserId, friends, sentRequests, receivedRequests]);

    const handleSendRequest = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            await sendRequest(user._id, targetUserId);
            setStatus('pending-sent');
            toast.success('Connection request sent');
        } catch (error) {
            toast.error('Failed to send connection request');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const request = receivedRequests.find(req => req.requester._id === targetUserId);
            if (!request) throw new Error('Request not found');

            await respondRequest(request._id, user._id, true);
            setStatus('friends');
            toast.success('Connection accepted');
        } catch (error) {
            toast.error('Failed to accept connection');
        } finally {
            setLoading(false);
        }
    };

    const handleDeclineRequest = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const request = receivedRequests.find(req => req.requester._id === targetUserId);
            if (!request) throw new Error('Request not found');

            await respondRequest(request._id, user._id, false);
            setStatus('none');
            toast.success('Connection declined');
        } catch (error) {
            toast.error('Failed to decline connection');
        } finally {
            setLoading(false);
        }
    };

    if (loading && status === 'none') {
        return (
            <Button
                variant={variant}
                size={size}
                className={className}
                disabled
            >
                Loading...
            </Button>
        );
    }

    switch (status) {
        case 'none':
            return (
                <Button
                    variant={variant}
                    size={size}
                    className={className}
                    onClick={handleSendRequest}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Connect'}
                </Button>
            );

        case 'pending-sent':
            return (
                <Button
                    variant="outline"
                    size={size}
                    className={className}
                    disabled
                >
                    Request Sent
                </Button>
            );

        case 'pending-received':
            return (
                <div className={`flex gap-2 ${className}`}>
                    <Button
                        size={size}
                        onClick={handleAcceptRequest}
                        disabled={loading}
                    >
                        {loading ? 'Accepting...' : 'Accept'}
                    </Button>
                    <Button
                        variant="outline"
                        size={size}
                        onClick={handleDeclineRequest}
                        disabled={loading}
                    >
                        Decline
                    </Button>
                </div>
            );

        case 'friends':
            return (
                <Button
                    variant="secondary"
                    size={size}
                    className={className}
                    disabled
                >
                    Friends
                </Button>
            );

        default:
            return null;
    }
};

type ConnectionStatus =
    | 'none'
    | 'pending-sent'
    | 'pending-received'
    | 'friends';
import { useEffect, useRef, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/types/chat';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    currentUserId?: string;
}

const MessageList = ({ messages, isLoading, currentUserId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isMyMessage = useCallback((message: Message) => {
        return message.sender === currentUserId || message.sender === 'me';
    }, [currentUserId]);

    const formatTime = useCallback((date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    }, []);

    const getMessageKey = useCallback((message: Message, index: number) => {
        return message._id || `message-${index}-${message.createdAt}`;
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isLoading && messages.length === 0) {
        return (
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            </CardContent>
        );
    }

    if (messages.length === 0) {
        return (
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
            </CardContent>
        );
    }

    return (
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
                const isMine = isMyMessage(message);
                const messageKey = getMessageKey(message, index);

                return (
                    <div
                        key={messageKey}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg p-3 max-w-[80%] ${isMine
                                ? 'bg-sport-blue text-white'
                                : 'bg-gray-100 text-gray-900'
                                }`}
                        >
                            <p className="break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                {formatTime(message.createdAt)}
                                {isMine && message.readAt && (
                                    <span className="ml-1">✓✓</span>
                                )}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </CardContent>
    );
};

export default MessageList;
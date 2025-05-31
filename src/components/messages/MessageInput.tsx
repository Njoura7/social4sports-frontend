import { useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>;
    onTyping: (isTyping: boolean) => void;
    disabled?: boolean;
    isConnected: boolean;
}

const MessageInput = ({ onSendMessage, onTyping, disabled, isConnected }: MessageInputProps) => {
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleTyping = useCallback((text: string) => {
        const isTyping = text.trim().length > 0;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        onTyping(isTyping);

        if (isTyping) {
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 2000);
        }
    }, [onTyping]);

    const handleSendMessage = useCallback(async () => {
        if (!messageText.trim() || isSending) return;

        const content = messageText.trim();
        setMessageText('');
        setIsSending(true);

        try {
            await onSendMessage(content);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessageText(content);
        } finally {
            setIsSending(false);
        }
    }, [messageText, isSending, onSendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessageText(value);
        handleTyping(value);
    }, [handleTyping]);

    return (
        <div className="p-4 border-t border-gray-100 flex gap-2">
            <Input
                placeholder={isConnected ? "Type a message..." : "You can still type (messages will be sent when connected)"}
                value={messageText}
                onChange={handleInputChange}
                className="flex-grow"
                onKeyDown={handleKeyDown}
                disabled={disabled || isSending} // Remove isConnected from disabled condition
            />
            <Button
                className="bg-sport-blue hover:bg-sport-blue/90"
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSending || disabled}
            >
                {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
};

export default MessageInput;
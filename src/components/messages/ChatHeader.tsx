import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IFriend } from '@/services/friendService'; // Import your IFriend type

interface ChatHeaderProps {
    friend: IFriend;
    isOnline: boolean;
    isTyping: boolean;
}

const ChatHeader = ({ friend, isOnline, isTyping }: ChatHeaderProps) => {
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length > 1
            ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
            : parts[0].charAt(0);
    };

    return (
        <div className="p-4 border-b border-gray-100 flex items-center">
            <div className="relative">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatar} alt={friend.fullName} />
                    <AvatarFallback>
                        {getInitials(friend.fullName)}
                    </AvatarFallback>
                </Avatar>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                )}
            </div>
            <div className="ml-3">
                <h3 className="font-medium">{friend.fullName}</h3>
                {isTyping && (
                    <p className="text-xs text-gray-500 animate-pulse">typing...</p>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;
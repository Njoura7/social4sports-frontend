import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import useChatStore from '@/store/chatStore';
import useSocket from '@/hooks/useSocket';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useMessageHandlers } from '@/hooks/useMessageHandlers';
import { friendService, IFriend } from '@/services/friendService'; // Use your actual service

// Import components
import FriendsList from '@/components/messages/FriendsList';
import ChatHeader from '@/components/messages/ChatHeader';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import ConnectionStatus from '@/components/messages/ConnectionStatus';

const Messages = () => {
  const { user } = useAuth();
  const {
    activeChat,
    messages,
    unreadCounts,
    onlineUsers,
    typingUsers,
    isLoading,
    setActiveChat,
    fetchConversation,
  } = useChatStore();

  const { markMessagesRead, isConnected } = useSocket();
  const { handleSendMessage, handleTyping } = useMessageHandlers();

  // Local state for friends (use your friendService)
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  // Load friends using your existing service
  useEffect(() => {
    const loadFriends = async () => {
      if (!user?._id) return;

      setFriendsLoading(true);
      setFriendsError(null);

      try {
        console.log('Fetching friends using friendService for user:', user._id);
        const friendsData = await friendService.getFriends();
        console.log('Friends fetched successfully:', friendsData);
        setFriends(friendsData || []);
      } catch (error) {
        console.error('Failed to load friends:', error);
        setFriendsError('Failed to load friends');
        setFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };

    loadFriends();
  }, [user?._id]);

  // Memoized values
  const currentMessages = useMemo(() => {
    if (!activeChat || !messages[activeChat]) {
      return [];
    }
    return messages[activeChat].filter(msg => msg && msg._id);
  }, [activeChat, messages]);

  const activeFriend = useMemo(() => {
    return friends.find(f => f._id === activeChat);
  }, [friends, activeChat]);

  // Effects
  useEffect(() => {
    if (activeChat) {
      console.log('Active chat changed to:', activeChat);
      fetchConversation(activeChat).catch(console.error);

      if (isConnected) {
        markMessagesRead(activeChat);
      }
    }
  }, [activeChat, fetchConversation, markMessagesRead, isConnected]);

  // Event handlers
  const handleFriendSelect = useCallback((friendId: string) => {
    console.log('Selecting friend:', friendId);
    setActiveChat(friendId);
  }, [setActiveChat]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleRetryLoadFriends = useCallback(() => {
    const loadFriends = async () => {
      setFriendsLoading(true);
      setFriendsError(null);

      try {
        const friendsData = await friendService.getFriends();
        setFriends(friendsData || []);
      } catch (error) {
        console.error('Failed to load friends:', error);
        setFriendsError('Failed to load friends');
        setFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };

    loadFriends();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
          <ConnectionStatus isConnected={isConnected} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FriendsList
            friends={friends}
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onFriendSelect={handleFriendSelect}
            activeChat={activeChat}
            messages={messages}
            unreadCounts={unreadCounts}
            onlineUsers={onlineUsers}
            isLoading={friendsLoading}
          />

          {/* Chat area */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {activeChat && activeFriend ? (
                <>
                  <ChatHeader
                    friend={activeFriend}
                    isOnline={onlineUsers.has(activeChat)}
                    isTyping={typingUsers.has(activeChat)}
                  />

                  <MessageList
                    messages={currentMessages}
                    isLoading={isLoading}
                    currentUserId={user?._id}
                  />

                  <MessageInput
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    isConnected={isConnected}
                  />
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    {friendsLoading ? (
                      <p className="text-gray-600">Loading friends...</p>
                    ) : friendsError ? (
                      <div>
                        <p className="text-red-600 mb-2">{friendsError}</p>
                        <button
                          onClick={handleRetryLoadFriends}
                          className="px-4 py-2 bg-sport-blue text-white rounded hover:bg-sport-blue/90"
                        >
                          Retry
                        </button>
                      </div>
                    ) : friends.length === 0 ? (
                      <div>
                        <p className="text-gray-600 mb-2">No friends found</p>
                        <p className="text-sm text-gray-500">
                          Add some friends to start messaging!
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600">Select a friend to start messaging</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Messages;
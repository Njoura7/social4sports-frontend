import PageLayout from "@/components/layout/PageLayout";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { FriendList } from '@/components/friends/FriendList';
import { ReceivedRequestsList } from '@/components/friends/ReceivedRequestsList';
import { SentRequestsList } from '@/components/friends/SentRequestsList';
import { useAuth } from '@/contexts/AuthContext';

import { useFriendStore } from '@/store/friendStore';
import { useEffect } from 'react';

export default function FriendManagement() {
    const { user } = useAuth();
    const {
        friends,
        receivedRequests,
        sentRequests,
        fetchFriends,
        fetchReceivedRequests,
        fetchSentRequests,
        loading
    } = useFriendStore();

    useEffect(() => {
        if (!user?._id) return;

        fetchFriends(user._id);
        fetchReceivedRequests(user._id);
        fetchSentRequests(user._id);
    }, [user?._id, fetchFriends, fetchReceivedRequests, fetchSentRequests]);

    return (
        <PageLayout>
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Friend Management</h1>

                <Tabs defaultValue="friends" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="friends">
                            Friends ({friends.length})
                        </TabsTrigger>
                        <TabsTrigger value="received">
                            Received ({receivedRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="sent">
                            Sent ({sentRequests.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends">
                        <FriendList friends={friends} loading={loading} />
                    </TabsContent>

                    <TabsContent value="received">
                        <ReceivedRequestsList
                            requests={receivedRequests}
                            loading={loading}
                        />
                    </TabsContent>

                    <TabsContent value="sent">
                        <SentRequestsList
                            requests={sentRequests}
                            loading={loading}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </PageLayout>
    );
}
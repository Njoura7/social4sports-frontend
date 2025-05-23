// src/components/Profile.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/contexts/AuthContext';
import { ConnectionButton } from '@/components/friends/ConnectionButton';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { User, userService } from '@/services/userService';

const Profile = () => {
  const { id } = useParams();
  const { user: authUser, refreshUserById } = useAuth();
  const {
    stats,
    loading,
    fetchUserStats,

  } = useUserStore();


  // Determine which user to display
  const isOwnProfile = !id || id === authUser?._id;
  const [viewedUser, setViewedUser] = useState<User | null>(null); // Add local state for viewed user


  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          // For other users' profiles
          const userData = await userService.getUserById(id); // Directly fetch user data
          setViewedUser(userData);
          await Promise.all([
            fetchUserStats(id),
          ]);
        } else if (authUser?._id) {
          // For own profile
          await Promise.all([
            fetchUserStats(authUser._id),
          ]);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    loadData();
  }, [id, authUser?._id, fetchUserStats]);

  const profileUser = id ? viewedUser : authUser; // Use viewedUser for other profiles
  console.log("Profile User:", profileUser);
  if (!profileUser) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">Loading profile...</div>
      </PageLayout>
    );
  }

  const locationString = profileUser.location
    ? `(${profileUser.location.coordinates[1]}, ${profileUser.location.coordinates[0]})`
    : "Location not set";

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto animate-fade-in p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUser.avatar} alt={profileUser.fullName} />
                  <AvatarFallback>{profileUser.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{profileUser.fullName}</h1>
                    <p className="text-muted-foreground">{profileUser.email}</p>
                  </div>
                  {/* {!isOwnProfile && profileUser._id && (
                    <div className="mt-4 md:mt-0">
                      <ConnectionButton targetUserId={profileUser._id} />
                    </div>
                  )} */}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="secondary">
                    {profileUser.skillLevel || 'Beginner'}
                  </Badge>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{locationString}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
            <TabsTrigger value="matches" className="flex-1">Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Win Rate</span>
                          <span className="text-sm font-medium">{stats.winRate}%</span>
                        </div>
                        <Progress value={stats.winRate} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Matches Played</p>
                          <p className="text-2xl font-bold">{stats.matchesPlayed}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Points For</p>
                          <p className="text-2xl font-bold">{stats.averagePointsFor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Points Against</p>
                          <p className="text-2xl font-bold">{stats.averagePointsAgainst}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Longest Streak</p>
                          <p className="text-2xl font-bold">{stats.longestStreak}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  {isOwnProfile ? (
                    <Button onClick={() => fetchUserStats(authUser?._id || '')}>
                      Load Stats
                    </Button>
                  ) : (
                    'No stats available'
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent>
                to be used from different component
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
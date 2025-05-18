import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, MapPin, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  // Helper to build display object with fallbacks
  const buildDisplayUser = (user) => {
    if (!user) return null;
    return {
      name: user.fullName || "John Doe",
      username: user.email ? `@${user.email.split("@")[0]}` : "@johndoe",
      email: user.email || "",
      avatar: user.avatar || "avatar3.png",
      location: user.location ? `(${user.location.coordinates[1]}, ${user.location.coordinates[0]})` : "San Francisco, CA",
      skillLevel: user.skillLevel ? user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1) : "Intermediate",
      bio: "Ping pong enthusiast for 5+ years. Looking for challenging matches to improve my game!",
      playStyle: "All-Around Player",
      availability: "Evenings & Weekends",
      stats: {
        matchesPlayed: 47,
        winRate: 68,
        averageScore: "11-8",
        longestStreak: 7,
      },
      achievements: [
        { title: "First Win", description: "Won your first match", date: "Jun 2023" },
        { title: "Winning Streak", description: "Won 5 matches in a row", date: "Aug 2023" },
        { title: "Tournament Player", description: "Participated in a local tournament", date: "Sep 2023" },
      ],
      recentMatches: [
        {
          id: 1,
          opponent: "Sarah Williams",
          result: "Win",
          score: "11-7, 11-9, 7-11, 11-8",
          date: "Oct 15, 2023",
        },
        {
          id: 2,
          opponent: "Michael Chen",
          result: "Loss",
          score: "9-11, 11-7, 6-11, 7-11",
          date: "Oct 8, 2023",
        },
        {
          id: 3,
          opponent: "Alex Johnson",
          result: "Win",
          score: "11-9, 11-7, 11-6",
          date: "Oct 1, 2023",
        },
      ],
    };
  };

  const [displayUser, setDisplayUser] = useState(buildDisplayUser(currentUser));

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log("🔍 Fetching user by id:", id);
      userService.getUserById(id)
        .then((user) => {
          setProfileUser(user);
          setDisplayUser(buildDisplayUser(user));
          console.log("✅ Loaded user by id:", user);
        })
        .catch((err) => {
          setProfileUser(undefined);
          setDisplayUser(null);
          console.error("❌ Failed to load user by id:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setProfileUser(currentUser);
      setDisplayUser(buildDisplayUser(currentUser));
      console.log("👤 Showing current user profile:", currentUser);
    }
  }, [id, currentUser]);

  if (loading || !displayUser) return <div>Loading...</div>;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/${displayUser.avatar}`} alt={displayUser.name} />
                  <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{displayUser.name}</h1>
                    <p className="text-gray-600">{displayUser.email}</p>
                  </div>
                  {!isOwnProfile && (
                    <div className="mt-4 md:mt-0 flex justify-center md:justify-start space-x-2">
                      <Button className="bg-sport-blue hover:bg-sport-blue/90">
                        Connect
                      </Button>
                      <Button variant="outline">
                        Message
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3">
                  <Badge className="self-center md:self-auto">{displayUser.skillLevel}</Badge>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{displayUser.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Available: {displayUser.availability}</span>
                  </div>
                </div>
                <p className="mt-4">{displayUser.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
            <TabsTrigger value="matches" className="flex-1">Matches</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
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
                        <span className="text-sm font-medium">{displayUser.stats.winRate}%</span>
                      </div>
                      <Progress value={displayUser.stats.winRate} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Matches Played</p>
                        <p className="text-2xl font-bold">{displayUser.stats.matchesPlayed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Score</p>
                        <p className="text-2xl font-bold">{displayUser.stats.averageScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Longest Streak</p>
                        <p className="text-2xl font-bold">{displayUser.stats.longestStreak}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Playing Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>{displayUser.playStyle}</p>
                    <div>
                      <span className="text-sm font-medium">Strengths</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-50">Backhand</Badge>
                        <Badge variant="outline" className="bg-gray-50">Defense</Badge>
                        <Badge variant="outline" className="bg-gray-50">Consistency</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Equipment</span>
                      <p className="mt-1 text-sm">Butterfly Viscaria Blade with Dignics 09C rubbers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayUser.recentMatches.map((match) => (
                    <div key={match.id} className="flex justify-between border-b border-gray-100 pb-4 last:border-0">
                      <div>
                        <p className="font-medium">vs. {match.opponent}</p>
                        <p className="text-sm text-gray-600">{match.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={match.result === "Win" ? "default" : "destructive"}>
                          {match.result}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{match.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">View All Matches</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayUser.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-0.5 p-2 bg-yellow-50 rounded-full">
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;

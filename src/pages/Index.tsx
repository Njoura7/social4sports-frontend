
import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MessageSquare, Trophy } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <PageLayout>
      {!isLoggedIn ? (
        <div className="flex flex-col items-center max-w-3xl mx-auto mt-8 md:mt-20 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Connect with <span className="text-sport-blue">Sports</span> Enthusiasts Near You
          </h1>
          <p className="mt-6 text-xl text-center text-gray-600 max-w-xl">
            Find players, schedule matches, and track your progress all in one place. 
            Starting with ping pong, expanding to all sports.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8 bg-sport-blue hover:bg-sport-blue/90" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/learn-more">Learn More</Link>
            </Button>
          </div>
          <div className="mt-16 md:mt-24 w-full">
            <h2 className="text-2xl font-bold text-center mb-8">Why Social4Sports?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="sport-card hover-scale">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-sport-blue/10 rounded-full">
                    <User className="h-8 w-8 text-sport-blue" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Find Players</h3>
                  <p className="text-gray-600">
                    Connect with players of similar skill levels in your area
                  </p>
                </CardContent>
              </Card>
              <Card className="sport-card hover-scale">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-sport-green/10 rounded-full">
                    <MessageSquare className="h-8 w-8 text-sport-green" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Easy Communication</h3>
                  <p className="text-gray-600">
                    Coordinate matches with integrated messaging
                  </p>
                </CardContent>
              </Card>
              <Card className="sport-card hover-scale">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-sport-blue/10 rounded-full">
                    <Trophy className="h-8 w-8 text-sport-blue" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                  <p className="text-gray-600">
                    Record match results and monitor your improvement
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-6">Welcome back, John!</h1>
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
              <TabsTrigger value="requests">Match Requests</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">No recent activity to show.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">No pending match requests.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">No upcoming matches scheduled.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Players Near You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder for player recommendations */}
            <Card className="sport-card">
              <CardContent className="pt-6">
                <p className="text-gray-600">Connect to see nearby players</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Index;

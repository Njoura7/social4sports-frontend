
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send } from "lucide-react";

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Alex Johnson",
      lastMessage: "When are you available for a match?",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      lastMessage: "Great game yesterday!",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "Michael Chen",
      lastMessage: "Looking forward to our match on Saturday.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      lastMessage: "Are you available this weekend?",
      time: "2 days ago",
      unread: false,
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      text: "Hey there! Would you be interested in a match this week?",
      timestamp: "10:15 AM",
    },
    {
      id: 2,
      senderId: "me",
      text: "Sure, I'm available on Thursday evening or Saturday morning.",
      timestamp: "10:18 AM",
    },
    {
      id: 3,
      senderId: 1,
      text: "Thursday evening works for me. How about 7 PM?",
      timestamp: "10:20 AM",
    },
    {
      id: 4,
      senderId: "me",
      text: "Perfect! At the community center?",
      timestamp: "10:25 AM",
    },
    {
      id: 5,
      senderId: 1,
      text: "When are you available for a match?",
      timestamp: "10:30 AM",
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the server
      setMessageText("");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search messages" className="pl-9" />
                </div>
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 border-b border-gray-100 flex items-center cursor-pointer ${
                      activeChat === contact.id
                        ? "bg-sport-blue/5"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveChat(contact.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatar-${contact.id}.png`} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name.charAt(0)}
                        {contact.name.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{contact.name}</h3>
                        <span className="text-xs text-gray-500">
                          {contact.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 truncate max-w-[160px]">
                          {contact.lastMessage}
                        </p>
                        {contact.unread && (
                          <span className="h-2 w-2 bg-sport-blue rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-100 flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={`/avatar-${activeChat}.png`} 
                        alt={contacts.find(c => c.id === activeChat)?.name} 
                      />
                      <AvatarFallback>
                        {contacts.find(c => c.id === activeChat)?.name.charAt(0)}
                        {contacts.find(c => c.id === activeChat)?.name.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        {contacts.find(c => c.id === activeChat)?.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.senderId === "me"
                              ? "bg-sport-blue text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === "me"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-4 border-t border-gray-100 flex">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-grow"
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button 
                      className="ml-2 bg-sport-blue hover:bg-sport-blue/90"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600">Select a conversation to start messaging</p>
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

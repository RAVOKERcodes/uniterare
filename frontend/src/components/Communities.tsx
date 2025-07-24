import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Users, ArrowRight } from "lucide-react";

type Community = {
  id: string;
  name: string;
  description: string;
  members: number;
  isJoined: boolean;
};

const defaultCommunities: Community[] = [
  {
    id: '1',
    name: 'Rare Disease Warriors',
    description: 'A supportive community for patients and families affected by rare diseases',
    members: 1243,
    isJoined: false
  },
  {
    id: '2',
    name: 'Rare Disease Researchers',
    description: 'Connect with researchers and professionals in the rare disease field',
    members: 876,
    isJoined: false
  },
  {
    id: '3',
    name: 'Pediatric Rare Conditions',
    description: 'Support group for families with children affected by rare conditions',
    members: 1502,
    isJoined: false
  },
  {
    id: '4',
    name: 'Rare Disease Caregivers',
    description: 'Resources and support for those caring for loved ones with rare diseases',
    members: 945,
    isJoined: false
  },
];

interface CommunitiesProps {
  onBack: () => void;
}

export function Communities({ onBack }: CommunitiesProps) {
  const [communities, setCommunities] = useState<Community[]>(defaultCommunities);

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(communities.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: !community.isJoined } 
        : community
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 hover:bg-primary/10 transition-colors duration-200"
        >
          <ArrowRight className="w-4 h-4 mr-2 transform rotate-180" />
          Back to Home
        </Button>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            Rare Disease Communities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with others who understand your journey. Join supportive communities and share experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {communities.map((community) => (
            <Card key={community.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{community.name}</CardTitle>
                </div>
                <CardDescription>
                  {community.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {community.members.toLocaleString()} members
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant={community.isJoined ? "outline" : "default"} 
                  size="sm"
                  className="flex-1 transition-colors"
                  onClick={() => handleJoinCommunity(community.id)}
                >
                  {community.isJoined ? 'Joined' : 'Join Community'}
                </Button>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                  View More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

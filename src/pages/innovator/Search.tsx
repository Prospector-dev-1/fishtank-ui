import { useState } from "react";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search as SearchIcon, Filter, Play, Users, 
  Briefcase, User, TrendingUp 
} from "lucide-react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pitches");

  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="Search" showLogo={false} />
      
      <div className="p-4">
        {/* Search Input */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search innovations, people, opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pitches">Pitches</TabsTrigger>
            <TabsTrigger value="innovations">Innovations</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex gap-2 mt-4 mb-6 overflow-x-auto">
            <Badge variant="outline">All Categories</Badge>
            <Badge variant="outline">AI/ML</Badge>
            <Badge variant="outline">Climate Tech</Badge>
            <Badge variant="outline">FinTech</Badge>
            <Badge variant="outline">MVP Stage</Badge>
            <Badge variant="outline">Remote</Badge>
          </div>

          <TabsContent value="pitches" className="space-y-4">
            {searchQuery ? (
              // Search results
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">EcoTrack AI - 30s Teaser</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          AI-powered carbon tracking for enterprises
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">Climate Tech</Badge>
                          <Badge variant="secondary" className="text-xs">MVP</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Empty state
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Search Pitches</h3>
                <p className="text-muted-foreground">
                  Find innovative pitches by keyword, category, or stage
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="innovations" className="space-y-4">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Search Innovations</h3>
              <p className="text-muted-foreground">
                Discover groundbreaking innovations and projects
              </p>
            </div>
          </TabsContent>

          <TabsContent value="people" className="space-y-4">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Search People</h3>
              <p className="text-muted-foreground">
                Connect with innovators, co-founders, and creators
              </p>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Search Opportunities</h3>
              <p className="text-muted-foreground">
                Find collaboration opportunities and projects
              </p>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <div className="text-center py-12">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Search Teams</h3>
              <p className="text-muted-foreground">
                Discover teams working on interesting projects
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
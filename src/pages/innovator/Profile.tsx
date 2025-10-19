import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/innovator/ui/avatar";
import { Button } from "@/components/innovator/ui/button";
import { Badge } from "@/components/innovator/ui/badge";
import { Separator } from "@/components/innovator/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/innovator/ui/tabs";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { User, Mail, MapPin, Briefcase, Edit, Settings, Rocket, Video, Users, Lightbulb } from "lucide-react";
import { toast } from "@/components/innovator/ui/use-toast";
import { EmptyState } from "@/components/innovator/ui/empty-state";
import { Skeleton } from "@/components/innovator/ui/skeleton";
export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    innovations: 0,
    pitches: 0,
    connections: 0,
    teams: 0
  });
  const [innovations, setInnovations] = useState<any[]>([]);
  const [pitches, setPitches] = useState<any[]>([]);
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      setProfile(data);

      // Load stats and data
      const [innovationsData, pitchesData, connectionsData, teamsData] = await Promise.all([supabase.from("innovations").select("*").eq("user_id", user.id), supabase.from("pitches").select("*").eq("user_id", user.id), supabase.from("connections").select("*").or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`).eq("status", "accepted"), supabase.from("team_members").select("*, teams(*)").eq("user_id", user.id)]);
      setInnovations(innovationsData.data || []);
      setPitches(pitchesData.data || []);
      setStats({
        innovations: innovationsData.data?.length || 0,
        pitches: pitchesData.data?.length || 0,
        connections: connectionsData.data?.length || 0,
        teams: teamsData.data?.length || 0
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>;
  }
  if (!profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>;
  }
  return <div className="min-h-screen bg-background pb-16">
      <FishtankHeader title="Profile" showLogo={false} showProfile={false} />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "User"} />
                  <AvatarFallback>{profile.full_name?.split(' ').map((n: string) => n[0]).join('') || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.full_name || "No name set"}</CardTitle>
                  <CardDescription>{profile.role || "No role set"}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => navigate("/profile/edit")}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.innovations}</p>
                  <p className="text-xs text-muted-foreground">Innovations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pitches}</p>
                  <p className="text-xs text-muted-foreground">Pitches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.connections}</p>
                  <p className="text-xs text-muted-foreground">Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.teams}</p>
                  <p className="text-xs text-muted-foreground">Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          
          <Button onClick={() => navigate("/tank")} variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Create Pitch
          </Button>
          {stats.innovations > 0 && <Button onClick={() => navigate("/analytics")} variant="outline">
              View Analytics
            </Button>}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" className="mx-[6px]">Overview</TabsTrigger>
            <TabsTrigger value="innovations" className="mx-[12px]">Innovations</TabsTrigger>
            <TabsTrigger value="pitches">Public Profile</TabsTrigger>
            
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.location && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>}
                  {profile.company && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.company}</span>
                    </div>}
                </div>

                {profile.bio && <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    </div>
                  </>}

                {profile.website && <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Website</h3>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  </>}

                {profile.skills && profile.skills.length > 0 && <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string, idx: number) => <Badge key={idx} variant="secondary">{skill}</Badge>)}
                      </div>
                    </div>
                  </>}

                {profile.interests && profile.interests.length > 0 && <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string, idx: number) => <Badge key={idx} variant="outline">{interest}</Badge>)}
                      </div>
                    </div>
                  </>}

                {profile.seeking && profile.seeking.length > 0 && <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.seeking.map((seek: string, idx: number) => <Badge key={idx} variant="default">{seek}</Badge>)}
                      </div>
                    </div>
                  </>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="innovations">
            <Card>
              
              <CardContent>
                {innovations.length === 0 ? <EmptyState icon={Lightbulb} title="No innovations yet" description="Start creating your first innovation to showcase your ideas" action={{
                label: "Create Innovation",
                onClick: () => navigate("/innovator/tank")
              }} /> : <div className="grid gap-4 md:grid-cols-2">
                    {innovations.map(innovation => <Card key={innovation.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/innovator/tank`)}>
                        <CardHeader>
                          <CardTitle className="text-lg">{innovation.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{innovation.tagline}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant={innovation.status === 'published' ? 'default' : 'secondary'}>
                              {innovation.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(innovation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pitches">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                
              </CardHeader>
              <CardContent>
                {pitches.length === 0 ? <EmptyState icon={Video} title="No pitches yet" description="Create your first video pitch to share your innovation with investors" action={{
                label: "Create Pitch",
                onClick: () => navigate("/tank")
              }} /> : <div className="grid gap-4 md:grid-cols-2">
                    {pitches.map(pitch => <Card key={pitch.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        
                        
                      </Card>)}
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest activities on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState icon={Users} title="Activity timeline coming soon" description="We're working on showing your recent activities and interactions" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}
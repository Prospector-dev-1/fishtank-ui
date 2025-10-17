import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Linkedin, Twitter, GraduationCap, Briefcase, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockTeamProfiles, mockStartups } from '@/data/mockData';

export default function TeamMemberProfile() {
  const { id, memberId } = useParams();
  const navigate = useNavigate();

  const startup = mockStartups.find(s => s.id === id);
  const profile = mockTeamProfiles.find(p => p.id === memberId);

  if (!startup || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-bold mb-2">Profile not found</h1>
          <Button onClick={() => navigate(`/startup/${id}`)}>Back to Startup</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-effect border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/startup/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {startup.name}
          </Button>
          <h1 className="text-h2 font-semibold truncate mx-4">{profile.name}</h1>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="container-safe space-y-6">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-h1 font-bold mb-1">{profile.name}</h2>
                  <p className="text-h3 text-primary font-semibold mb-2">{profile.role}</p>
                  <p className="text-muted-foreground">at {startup.name}</p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-2">
                  {profile.social.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${profile.social.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                  {profile.social.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {profile.social.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Expertise & Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="glass-subtle">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4 pb-4 last:pb-0">
                  <div className="glass-subtle rounded-lg p-4">
                    <h4 className="font-semibold text-foreground">{exp.position}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                    <p className="text-body leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.education.map((edu, index) => (
                <div key={index} className="glass-subtle rounded-lg p-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-primary font-medium">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-body leading-relaxed">{achievement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
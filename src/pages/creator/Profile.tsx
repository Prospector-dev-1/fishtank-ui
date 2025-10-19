import { useState, useEffect } from "react";
import { Edit, ExternalLink, Plus, MapPin, DollarSign, Clock, Star, Camera, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IOSHeader } from "@/components/creator/ui/ios-header";
import { IOSButton } from "@/components/creator/ui/ios-button";
import { IOSCard, IOSCardContent, IOSCardHeader, IOSCardTitle, IOSCardDescription } from "@/components/creator/ui/ios-card";
import { IOSList, IOSListItem, IOSListSection } from "@/components/creator/ui/ios-list";
import { IOSBadge } from "@/components/creator/ui/ios-badge";
import { IOSEmptyState } from "@/components/creator/ui/ios-empty-state";
import { IOSSkeleton } from "@/components/creator/ui/ios-skeleton";
import { IOSChip } from "@/components/creator/ui/ios-chip";
import { IOSInput } from "@/components/creator/ui/ios-input";
import { Label } from "@/components/creator/ui/label";
import ProfileSettings from "@/components/creator/ProfileSettings";
import { ServiceModal } from "@/components/creator/ServiceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/creator/ui/tabs";
import { currentCreator } from "@/lib/creator/mockData";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Use mock data instead of Supabase
      setProfileData({
        full_name: currentCreator.name,
        avatar_url: currentCreator.avatar,
        bio: currentCreator.bio,
        location: "San Francisco, CA",
        hourly_rate: 85,
        years_experience: 5,
        availability_status: 'available'
      });

      // Map services from mock data
      setServices(currentCreator.services.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: s.price,
        delivery_days: parseInt(s.timeline.split('-')[0]),
        active: true
      })));

      // Set skills from mock data
      setSkills(currentCreator.skills);

      // Map past projects from mock data
      setPastProjects(currentCreator.portfolio.map(p => ({
        id: p.id,
        title: p.title,
        image_url: p.thumbnail,
        description: p.category
      })));

    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleServiceSaved = () => {
    loadProfileData();
  };

  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-background">
        <IOSHeader largeTitle="Profile" />
        <div className="px-4 space-y-6">
          <div className="text-center space-y-4">
            <IOSSkeleton className="h-24 w-24 rounded-full mx-auto" />
            <IOSSkeleton className="h-6 w-32 mx-auto" />
            <IOSSkeleton className="h-4 w-48 mx-auto" />
          </div>
          <IOSSkeleton className="h-32 rounded-xl" />
          <IOSSkeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <IOSHeader 
        largeTitle="Profile"
        rightAction={
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="touch-target flex items-center justify-center text-muted-foreground active:opacity-60 transition-opacity duration-120"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    toast.success("Profile updated successfully!");
                  }}
                  className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120"
                >
                  <Check className="h-5 w-5" strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120"
                >
                  <Edit className="h-5 w-5" strokeWidth={2} />
                </button>
                <ProfileSettings />
              </>
            )}
          </div>
        }
      />

      {/* Profile Header Card */}
      <div className="px-4 mb-6">
        <IOSCard className="overflow-hidden">
          <div className="relative h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10" />
          <div className="px-4 pb-4 -mt-12">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt={profileData.full_name}
                  className="h-24 w-24 rounded-full ring-4 ring-background"
                />
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
                {!isEditing && (
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-background" />
                )}
              </div>

              {/* Name & Status */}
              <div className="flex-1 min-w-0 pb-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <IOSInput
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      placeholder="Full Name"
                      className="text-title-3"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-title-2 font-bold text-foreground truncate">
                      {profileData.full_name}
                    </h2>
                    <p className="text-subhead text-muted-foreground truncate">
                      @{user?.email?.split('@')[0]}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="mt-4 space-y-2">
                <Label className="text-caption-1 text-muted-foreground">Bio</Label>
                <textarea
                  value={profileData.bio || ''}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-body resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
                />
              </div>
            ) : profileData.bio ? (
              <p className="text-body text-foreground mt-4 leading-relaxed">
                {profileData.bio}
              </p>
            ) : null}

            {/* Meta Info */}
            {isEditing ? (
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-caption-1 text-muted-foreground">Location</Label>
                  <IOSInput
                    value={profileData.location || ''}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-caption-1 text-muted-foreground">Hourly Rate</Label>
                    <IOSInput
                      type="number"
                      value={profileData.hourly_rate || ''}
                      onChange={(e) => setProfileData({...profileData, hourly_rate: parseInt(e.target.value)})}
                      placeholder="85"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-caption-1 text-muted-foreground">Experience (years)</Label>
                    <IOSInput
                      type="number"
                      value={profileData.years_experience || ''}
                      onChange={(e) => setProfileData({...profileData, years_experience: parseInt(e.target.value)})}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-4">
                {profileData.location && (
                  <div className="flex items-center gap-1 text-subhead text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.hourly_rate && (
                  <div className="flex items-center gap-1 text-subhead text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${profileData.hourly_rate}/hr</span>
                  </div>
                )}
                {profileData.years_experience && (
                  <div className="flex items-center gap-1 text-subhead text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{profileData.years_experience} years</span>
                  </div>
                )}
              </div>
            )}

            {/* Availability Badge */}
            {profileData.availability_status && (
              <div className="mt-4">
                <IOSBadge
                  variant={profileData.availability_status === 'available' ? 'success' : 'warning'}
                  size="lg"
                >
                  {profileData.availability_status === 'available' ? 'Available for work' : 'Busy'}
                </IOSBadge>
              </div>
            )}
          </div>
        </IOSCard>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-title-3 font-semibold mb-3 px-1">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <IOSChip key={skill} label={skill} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "services"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("past-projects")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "past-projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Past Projects
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 space-y-4">
        {activeTab === "services" && (
          <>
            {services.length === 0 ? (
              <IOSEmptyState
                title="No services yet"
                description="Add your first service to start attracting clients"
                action={{
                  label: "Add Service",
                  onClick: handleAddService,
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-between px-1 mb-2">
                  <h3 className="text-title-3 font-semibold">Your Services</h3>
                  <button
                    onClick={handleAddService}
                    className="text-primary text-subhead font-medium active:opacity-60 transition-opacity duration-120"
                  >
                    Add New
                  </button>
                </div>
                <IOSList inset>
                  {services.map(service => (
                    <IOSListItem
                      key={service.id}
                      title={service.title}
                      subtitle={`$${service.price} • ${service.delivery_days} days`}
                      onClick={() => handleEditService(service)}
                      chevron
                      icon={
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                      }
                      trailing={
                        <IOSBadge variant={service.active ? 'success' : 'default'}>
                          {service.active ? 'Active' : 'Inactive'}
                        </IOSBadge>
                      }
                    />
                  ))}
                </IOSList>
              </>
            )}
          </>
        )}

        {activeTab === "past-projects" && (
          <>
            {pastProjects.length === 0 ? (
              <IOSEmptyState
                title="No past projects"
                description="Showcase your work by adding past projects"
                action={{
                  label: "Add Past Project",
                  onClick: () => navigate('/creator/edit-profile'),
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {pastProjects.map(item => (
                  <IOSCard 
                    key={item.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-220 active:scale-98"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <ExternalLink className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="text-callout font-semibold truncate">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-caption-1 text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </IOSCard>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ServiceModal
        open={serviceModalOpen}
        onOpenChange={setServiceModalOpen}
        service={editingService}
        creatorId={user?.id || ''}
        onSave={() => {
          loadProfileData();
          setServiceModalOpen(false);
        }}
      />
    </div>
  );
}
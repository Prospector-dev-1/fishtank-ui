import { useState, useEffect } from "react";
import { Edit, ExternalLink, Plus, MapPin, DollarSign, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IOSHeader } from "@/components/ui/ios-header";
import { IOSButton } from "@/components/ui/ios-button";
import { IOSCard, IOSCardContent, IOSCardHeader, IOSCardTitle, IOSCardDescription } from "@/components/ui/ios-card";
import { IOSList, IOSListItem, IOSListSection } from "@/components/ui/ios-list";
import { IOSBadge } from "@/components/ui/ios-badge";
import { IOSEmptyState } from "@/components/ui/ios-empty-state";
import { IOSSkeleton } from "@/components/ui/ios-skeleton";
import { IOSChip } from "@/components/ui/ios-chip";
import ProfileSettings from "@/components/ProfileSettings";
import { ServiceModal } from "@/components/ServiceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfileData(profile);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('creator_id', user.id);

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Load skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('creator_skills')
        .select('skill_id, skills(name)')
        .eq('creator_id', user.id);

      if (skillsError) throw skillsError;
      setSkills(skillsData?.map((s: any) => s.skills?.name).filter(Boolean) || []);

      // Load portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('creator_id', user.id);

      if (portfolioError) throw portfolioError;
      setPortfolio(portfolioData || []);

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
            <button
              onClick={() => navigate('/edit-profile')}
              className="touch-target flex items-center justify-center text-primary active:opacity-60 transition-opacity duration-120"
            >
              <Edit className="h-5 w-5" strokeWidth={2} />
            </button>
            <ProfileSettings />
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
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-background" />
              </div>

              {/* Name & Status */}
              <div className="flex-1 min-w-0 pb-2">
                <h2 className="text-title-2 font-bold text-foreground truncate">
                  {profileData.full_name}
                </h2>
                <p className="text-subhead text-muted-foreground truncate">
                  @{user?.email?.split('@')[0]}
                </p>
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <p className="text-body text-foreground mt-4 leading-relaxed">
                {profileData.bio}
              </p>
            )}

            {/* Meta Info */}
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
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-2 px-4 rounded-lg text-subhead font-semibold transition-all duration-180 ${
              activeTab === "portfolio"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:opacity-60"
            }`}
          >
            Portfolio
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

        {activeTab === "portfolio" && (
          <>
            {portfolio.length === 0 ? (
              <IOSEmptyState
                title="No portfolio items"
                description="Showcase your work by adding portfolio items"
                action={{
                  label: "Add Portfolio Item",
                  onClick: () => navigate('/edit-profile'),
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {portfolio.map(item => (
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
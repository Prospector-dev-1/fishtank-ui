import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/creator/ui/button";
import { Input } from "@/components/creator/ui/input";
import { Textarea } from "@/components/creator/ui/textarea";
import { Label } from "@/components/creator/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/creator/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/creator/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    location: "",
    email: "",
    availability_status: "available",
    hourly_rate: "",
    project_rate: "",
    years_experience: "",
    avatar_url: "",
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
          location: data.location || "",
          email: data.email || "",
          availability_status: data.availability_status || "available",
          hourly_rate: data.hourly_rate?.toString() || "",
          project_rate: data.project_rate?.toString() || "",
          years_experience: data.years_experience?.toString() || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          email: formData.email,
          availability_status: formData.availability_status,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          project_rate: formData.project_rate ? parseFloat(formData.project_rate) : null,
          years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
          avatar_url: formData.avatar_url,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pb-20 pt-6 max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                value={formData.years_experience}
                onChange={(e) => handleChange('years_experience', e.target.value)}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="availability_status">Availability Status</Label>
              <Select
                value={formData.availability_status}
                onValueChange={(value) => handleChange('availability_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => handleChange('hourly_rate', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="project_rate">Project Rate ($)</Label>
              <Input
                id="project_rate"
                type="number"
                value={formData.project_rate}
                onChange={(e) => handleChange('project_rate', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

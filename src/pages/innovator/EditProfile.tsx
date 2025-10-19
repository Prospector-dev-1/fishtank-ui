import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Button } from "@/components/innovator/ui/button";
import { Input } from "@/components/innovator/ui/input";
import { Label } from "@/components/innovator/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/innovator/ui/card";
import { Separator } from "@/components/innovator/ui/separator";
import { Switch } from "@/components/innovator/ui/switch";
import { Shield, Mail, Lock, Bell, Eye, UserCog, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function EditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    connectionRequests: true,
    pitchUpdates: true,
    marketingEmails: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public" as "public" | "connections" | "private",
    showEmail: false,
    showPhone: false,
    showActivityStatus: true,
    allowMessages: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/innovator/auth");
        return;
      }

      // Load user data
      setUserData({
        email: user.email || "",
        phone: user.phone || "",
      });

      // Load settings from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_settings, privacy_settings")
        .eq("id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error - ignore it for new profiles
        throw error;
      }

      if (data) {
        if (data.notification_settings) {
          setNotificationSettings({ ...notificationSettings, ...data.notification_settings });
        }
        if (data.privacy_settings) {
          setPrivacySettings({ ...privacySettings, ...data.privacy_settings });
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load account settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: userData.email,
      });

      if (error) throw error;

      toast.success("Email update initiated. Please check your new email for verification.");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          notification_settings: notificationSettings,
          privacy_settings: privacySettings,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/innovator/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <FishtankHeader title="Account Settings" showLogo={false} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        
        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <CardDescription>Manage your private account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleUpdateEmail}
                  disabled={userData.email === ""}
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You'll need to verify any new email address
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
              </div>

              <Button 
                type="submit"
                disabled={!passwordData.newPassword || !passwordData.confirmPassword}
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Privacy Settings</CardTitle>
            </div>
            <CardDescription>Control who can see your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email on Profile</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow others to see your email address
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, showEmail: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Phone Number</Label>
                  <p className="text-xs text-muted-foreground">
                    Display your phone number on your profile
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showPhone}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, showPhone: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Activity Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Display when you're online and active
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showActivityStatus}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, showActivityStatus: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Let other users send you direct messages
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowMessages}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, allowMessages: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get real-time alerts on your device
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Message Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Alert when you receive new messages
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.messageNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, messageNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Connection Requests</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify when someone wants to connect
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.connectionRequests}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, connectionRequests: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pitch Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Updates on your pitch views and engagement
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pitchUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, pitchUpdates: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Product updates and news from us
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security & Account Actions</CardTitle>
            </div>
            <CardDescription>Security options and account management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Separator />
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            <Separator />
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Settings"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/innovator/profile")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

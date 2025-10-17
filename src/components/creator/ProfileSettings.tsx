import { useState } from "react";
import { Settings as SettingsIcon, Shield, CreditCard, HelpCircle, LogOut, Moon, Sun, Globe, Bell, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/creator/ui/use-toast";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [showEarnings, setShowEarnings] = useState(true);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/creator/auth");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out",
      });
    }
  };
  
  const sections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { 
          label: 'Email Notifications', 
          description: 'Receive updates via email',
          toggle: { value: emailNotifications, onChange: setEmailNotifications }
        },
        { 
          label: 'Push Notifications', 
          description: 'Mobile and browser notifications',
          toggle: { value: pushNotifications, onChange: setPushNotifications }
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { 
          label: 'Private Profile', 
          description: 'Only show profile to invited clients',
          toggle: { value: profilePrivate, onChange: setProfilePrivate }
        },
        { 
          label: 'Show Earnings', 
          description: 'Display earnings publicly',
          toggle: { value: showEarnings, onChange: setShowEarnings }
        },
        { label: 'Change Password', description: 'Update your account password', action: () => console.log('Change password') },
        { label: 'Two-Factor Authentication', description: 'Add extra security to your account', action: () => console.log('2FA'), badge: 'Recommended' }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: CreditCard,
      items: [
        { label: 'Payout Methods', description: 'Manage how you receive payments', action: () => console.log('Payout methods') },
        { label: 'Tax Information', description: 'Update tax forms and documentation', action: () => console.log('Tax info') },
        { label: 'Transaction History', description: 'View all your earnings and fees', action: () => navigate('/creator/earnings') },
        { label: 'Subscription Plans', description: 'Upgrade for premium features', action: () => console.log('Plans'), badge: 'Free Plan' }
      ]
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {/* Settings Sections */}
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{item.label}</p>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        {item.toggle ? (
                          <Switch
                            checked={item.toggle.value}
                            onCheckedChange={item.toggle.onChange}
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={item.action}
                            className="text-xs"
                          >
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < section.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Appearance Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Language</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred language</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Globe className="h-4 w-4 mr-1" />
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Help Center
              </Button>
              <Separator />
              <Button variant="ghost" className="w-full justify-start text-sm">
                Contact Support
              </Button>
              <Separator />
              <Button variant="ghost" className="w-full justify-start text-sm">
                Community Guidelines
              </Button>
              <Separator />
              <Button variant="ghost" className="w-full justify-start text-sm">
                Terms of Service
              </Button>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card>
            <CardContent className="p-4">
              <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* App Version */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">Creator Platform v1.2.0</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { Camera, Moon, Sun, Bell, Shield, LogOut, Settings, Globe, Mail, HardDrive, User, Lock, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/investor/ui/card';
import { Button } from '@/components/investor/ui/button';
import { Input } from '@/components/investor/ui/input';
import { Label } from '@/components/investor/ui/label';
import { Switch } from '@/components/investor/ui/switch';
import { Chip } from "@/components/investor/ui/chip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/investor/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/investor/ui/select';
import { Separator } from '@/components/investor/ui/separator';
import { mockUser } from "@/data/investor/mockData";
import { useToast } from "@/components/investor/ui/use-toast";

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(user.preferences.darkMode);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved.",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: darkMode ? "Light mode enabled" : "Dark mode enabled",
      description: "Theme preference saved.",
    });
  };

  const handleSettingsSave = () => {
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated.",
    });
  };

  const sectors = ['Fintech', 'HealthTech', 'AI', 'CleanTech', 'EdTech', 'Enterprise', 'Consumer'];
  const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-safe py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-h1 font-bold">Profile</h1>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="glass-card border-0 w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      {/* Appearance */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">APPEARANCE</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <div>
                              <Label>Dark Mode</Label>
                              <p className="text-sm text-muted-foreground">
                                Toggle between light and dark themes
                              </p>
                            </div>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      {/* Notifications */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">NOTIFICATIONS</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-5 h-5" />
                            <div>
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Get notified about new startups and updates
                              </p>
                            </div>
                          </div>
                          <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5" />
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive weekly digest emails
                              </p>
                            </div>
                          </div>
                          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                        </div>
                      </div>

                      <Separator />

                      {/* Privacy & Security */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">PRIVACY & SECURITY</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5" />
                            <div>
                              <Label>Privacy Mode</Label>
                              <p className="text-sm text-muted-foreground">
                                Hide your activity from other investors
                              </p>
                            </div>
                          </div>
                          <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
                        </div>
                        <Button variant="outline" className="w-full justify-start">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Manage Account
                        </Button>
                      </div>

                      <Separator />

                      {/* Data & Storage */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">DATA & STORAGE</h3>
                        <Button variant="outline" className="w-full justify-start">
                          <HardDrive className="w-4 h-4 mr-2" />
                          Clear Cache
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Globe className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                      </div>

                      <Separator />

                      {/* Support & Legal */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">SUPPORT & LEGAL</h3>
                        <Button variant="outline" className="w-full justify-start">
                          <Bell className="w-4 h-4 mr-2" />
                          Support Center
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Privacy Policy
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Terms of Service
                        </Button>
                      </div>

                      <Separator />

                      {/* Danger Zone */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-destructive">DANGER ZONE</h3>
                        <Button variant="destructive" className="w-full justify-start">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>

                      <Button onClick={handleSettingsSave} className="w-full mt-6">
                        Save Changes
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card className="glass-card border-0">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {isEditing && (
                <Button 
                  size="sm" 
                  className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3 max-w-xs mx-auto">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={user.title}
                    onChange={(e) => setUser({ ...user, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            )}

            {/* Investment Statistics */}
            {!isEditing && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Investments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">$2.5M</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">4.2x</div>
                  <div className="text-sm text-muted-foreground">Avg Return</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Preferred Sectors</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {sectors.map((sector) => (
                  <Chip
                    key={sector}
                    variant={user.preferences.sectors.includes(sector) ? "primary" : "secondary"}
                    size="sm"
                    className={isEditing ? "cursor-pointer" : ""}
                    onClick={() => {
                      if (isEditing) {
                        const newSectors = user.preferences.sectors.includes(sector)
                          ? user.preferences.sectors.filter(s => s !== sector)
                          : [...user.preferences.sectors, sector];
                        setUser({
                          ...user,
                          preferences: { ...user.preferences, sectors: newSectors }
                        });
                      }
                    }}
                  >
                    {sector}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Preferred Stages</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {stages.map((stage) => (
                  <Chip
                    key={stage}
                    variant={user.preferences.stages.includes(stage) ? "primary" : "secondary"}
                    size="sm"
                    className={isEditing ? "cursor-pointer" : ""}
                    onClick={() => {
                      if (isEditing) {
                        const newStages = user.preferences.stages.includes(stage)
                          ? user.preferences.stages.filter(s => s !== stage)
                          : [...user.preferences.stages, stage];
                        setUser({
                          ...user,
                          preferences: { ...user.preferences, stages: newStages }
                        });
                      }
                    }}
                  >
                    {stage}
                  </Chip>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Support
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
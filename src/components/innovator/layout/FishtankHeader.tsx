import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Fish, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

export function FishtankHeader({ 
  title, 
  showLogo = true, 
  showProfile = true,
  onSearch, 
  searchPlaceholder 
}: { 
  title?: string; 
  showLogo?: boolean;
  showProfile?: boolean;
  onSearch?: (query: string) => void | React.Dispatch<React.SetStateAction<string>>; 
  searchPlaceholder?: string; 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<{ avatar_url?: string; full_name?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isNetworkPage = location.pathname === '/network';

  useEffect(() => {
    if (showProfile) {
      loadUserProfile();
    }
  }, [showProfile]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const getInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, role')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);

    if (!error) {
      setSearchResults(data || []);
      setIsSearchOpen(true);
    }
  };

  const handleProfileClick = (profileId: string) => {
    navigate(`/user/${profileId}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {showLogo && (
            <div className="flex items-center gap-2">
              <Fish className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Fishtank</span>
            </div>
          )}
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isNetworkPage && (
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search innovators..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </PopoverTrigger>
              {isSearchOpen && searchQuery.length >= 2 && (
                <PopoverContent className="w-64 p-2" align="start">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => handleProfileClick(profile.id)}
                          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {profile.full_name || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {profile.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">No innovators found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                    </div>
                  )}
                </PopoverContent>
              )}
            </Popover>
          )}

          {showProfile && (
            <button
              onClick={() => navigate('/innovator/profile')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

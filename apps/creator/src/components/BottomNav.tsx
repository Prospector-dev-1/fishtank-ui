import { Home, Search, MessageCircle, User, Briefcase, Handshake, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/discover", icon: Briefcase, label: "Discover" },
  { path: "/network", icon: Users, label: "Network" },
  { path: "/inbox", icon: MessageCircle, label: "Inbox" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 ios-frosted border-t border-border/30 safe-bottom">
      <div className="flex items-stretch justify-around max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1",
                "pt-2 pb-1 transition-all duration-180",
                "touch-target min-w-0",
                isActive 
                  ? "text-primary" 
                  : "text-gray-500 active:text-gray-600 dark:text-gray-400 dark:active:text-gray-300"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon 
                  className={cn(
                    "h-6 w-6 mb-0.5 transition-transform duration-120",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className={cn(
                  "text-caption-2 font-medium transition-opacity duration-180",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { useNavigation } from "@/contexts/NavigationContext";
import { cn } from "@/lib/utils";

export function Layout() {
  const { isNavVisible } = useNavigation();
  
  return (
    <div className="min-h-screen bg-background">
      <main className={cn(
        "transition-all duration-280",
        isNavVisible ? "pb-[calc(68px+env(safe-area-inset-bottom))]" : ""
      )}>
        <Outlet />
      </main>
      {isNavVisible && <BottomNav />}
    </div>
  );
}
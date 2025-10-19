import { useAuth } from "@/contexts/AuthContext";
import { Community } from "@/components/creator/Community";
import { IOSHeader } from "@/components/creator/ui/ios-header";

export default function Network() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* iOS Header */}
      <IOSHeader largeTitle="Network" />

      {/* Community Content */}
      <div className="px-4">
        <Community />
      </div>
    </div>
  );
}
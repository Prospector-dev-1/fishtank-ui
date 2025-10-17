import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="pb-20 pt-6 max-w-md mx-auto">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Settings have been moved to your Profile page. Use the settings icon in the top right corner of your profile to access all settings.</p>
      </div>
    </div>
  );
}
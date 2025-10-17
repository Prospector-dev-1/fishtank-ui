import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentCreator } from "@/lib/creator/mockData";

export default function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost" 
      size="icon"
      className="absolute top-4 right-4 rounded-full"
      onClick={() => navigate('/creator/profile')}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={currentCreator.avatar} alt={currentCreator.name} />
        <AvatarFallback>{currentCreator.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </Button>
  );
}
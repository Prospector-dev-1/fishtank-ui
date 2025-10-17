import React from 'react';
import { Star, MessageCircle, Handshake, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Creator } from "@/lib/creator/creatorTypes";
import { useNavigate } from 'react-router-dom';

interface CreatorCardProps {
  creator: Creator;
  onMessage: (creatorId: string) => void;
  onCollaborate: (creatorId: string) => void;
}

export function CreatorCard({ creator, onMessage, onCollaborate }: CreatorCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/creators/${creator.id}`);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessage(creator.id);
  };

  const handleCollaborate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCollaborate(creator.id);
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/90 transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={creator.avatarUrl}
          alt={creator.name}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-neutral-100 truncate">
              {creator.name}
            </h3>
            <Badge 
              variant={creator.availability === 'open' ? 'default' : 'secondary'}
              className={creator.availability === 'open' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
            >
              {creator.availability === 'open' ? 'Available' : 'Busy'}
            </Badge>
          </div>
          <p className="text-sm text-neutral-300 mb-2">{creator.headline}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{creator.rating}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{creator.responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {creator.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs border-neutral-600 text-neutral-300">
              {skill}
            </Badge>
          ))}
          {creator.skills.length > 4 && (
            <Badge variant="outline" className="text-xs border-neutral-600 text-neutral-400">
              +{creator.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Compensation */}
      <div className="mb-4 text-sm text-neutral-300">
        <div className="flex items-center gap-2 flex-wrap">
          {creator.compensation.includes('hourly') && creator.hourlyRate && (
            <span className="text-primary font-medium">${creator.hourlyRate}/hr</span>
          )}
          {creator.compensation.includes('equity') && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Equity
            </Badge>
          )}
          {creator.compensation.includes('commission') && (
            <Badge variant="outline" className="text-xs border-accent/30 text-accent">
              Commission
            </Badge>
          )}
          {creator.compensation.includes('fixed') && (
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
              Fixed
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 px-3"
          onClick={handleMessage}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-3"
          onClick={handleCollaborate}
        >
          <Handshake className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
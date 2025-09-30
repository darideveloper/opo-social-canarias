import React from 'react';
import { Badge, Avatar, AvatarImage, AvatarFallback, Progress } from '../ui';
import type { UserData } from '../../types/navigation';

interface ProfileSummaryProps {
  userData: UserData;
  totalTopics?: number;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ userData, totalTopics = 42 }) => {
  const getSubscriptionBadgeVariant = () => {
    switch (userData.subscription) {
      case 'Anual Pro':
        return 'default' as const;
      case 'Mensual':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const progressPercentage = userData.completedTopics ? (userData.completedTopics.length / totalTopics) * 100 : 0;

  return (
    <div className="px-4 py-4 border-b">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={userData.photoURL || undefined} alt={`Avatar de ${userData.name}`} />
          <AvatarFallback className="text-sm font-medium">
            {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{userData.name}</p>
          <Badge variant={getSubscriptionBadgeVariant()} className="text-xs">
            {userData.subscription}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progreso General</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-yellow-600">🪙</span>
          <span className="font-medium">{userData.gofitos}</span>
          <span className="text-muted-foreground">Gofitos</span>
        </div>
        <div className="text-muted-foreground">
          {userData.completedTopics?.length || 0}/{totalTopics} temas
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;

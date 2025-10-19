import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type PermissionLevel = 'founder' | 'co_founder' | 'member' | 'collaborator';

interface TeamPermissions {
  permissionLevel: PermissionLevel | null;
  isFounder: boolean;
  isCoFounder: boolean;
  isMember: boolean;
  isCollaborator: boolean;
  canEditInnovation: boolean;
  canDeleteInnovation: boolean;
  canManageTeam: boolean;
  canCreatePitch: boolean;
  canViewAnalytics: boolean;
  canAccessTankUI: boolean;
  isLoading: boolean;
}

export const useTeamPermissions = (innovationId: string | undefined): TeamPermissions => {
  const [permissions, setPermissions] = useState<TeamPermissions>({
    permissionLevel: null,
    isFounder: false,
    isCoFounder: false,
    isMember: false,
    isCollaborator: false,
    canEditInnovation: false,
    canDeleteInnovation: false,
    canManageTeam: false,
    canCreatePitch: false,
    canViewAnalytics: false,
    canAccessTankUI: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!innovationId) {
      // Keep loading true until we have an innovationId
      setPermissions(prev => ({ ...prev, isLoading: true }));
      return;
    }

    const loadPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPermissions(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Check if this is a mock innovation (starts with 'innovation_')
        const isMockInnovation = innovationId.startsWith('innovation_');
        
        if (isMockInnovation) {
          // Grant founder permissions for mock innovations
          console.log('🎯 Mock innovation detected - granting founder permissions', {
            innovationId,
            userId: user.id
          });
          setPermissions({
            permissionLevel: 'founder',
            isFounder: true,
            isCoFounder: false,
            isMember: false,
            isCollaborator: false,
            canEditInnovation: true,
            canDeleteInnovation: true,
            canManageTeam: true,
            canCreatePitch: true,
            canViewAnalytics: true,
            canAccessTankUI: true,
            isLoading: false,
          });
          return;
        }

        // Check if user is the founder (innovation owner)
        const { data: innovation } = await supabase
          .from('innovations')
          .select('user_id')
          .eq('id', innovationId)
          .single();

        if (innovation?.user_id === user.id) {
          console.log('🎯 User is innovation owner - granting founder permissions', {
            innovationId,
            userId: user.id,
            ownerId: innovation.user_id
          });
          setPermissions({
            permissionLevel: 'founder',
            isFounder: true,
            isCoFounder: false,
            isMember: false,
            isCollaborator: false,
            canEditInnovation: true,
            canDeleteInnovation: true,
            canManageTeam: true,
            canCreatePitch: true,
            canViewAnalytics: true,
            canAccessTankUI: true,
            isLoading: false,
          });
          return;
        }

        console.log('⚠️ User is NOT innovation owner, checking team membership', {
          innovationId,
          userId: user.id,
          ownerId: innovation?.user_id
        });

        // Check team member permission level
        const { data: teamMember } = await supabase
          .from('team_members')
          .select('permission_level')
          .eq('innovation_id', innovationId)
          .eq('user_id', user.id)
          .maybeSingle();

        const level = (teamMember as any)?.permission_level as PermissionLevel || null;

        console.log('👥 Team member permissions loaded', {
          innovationId,
          userId: user.id,
          permissionLevel: level,
          canCreatePitch: level === 'co_founder' || level === 'member'
        });

        setPermissions({
          permissionLevel: level,
          isFounder: false,
          isCoFounder: level === 'co_founder',
          isMember: level === 'member',
          isCollaborator: level === 'collaborator',
          canEditInnovation: level === 'co_founder',
          canDeleteInnovation: false,
          canManageTeam: level === 'co_founder',
          canCreatePitch: level === 'co_founder' || level === 'member',
          canViewAnalytics: level === 'co_founder' || level === 'member',
          canAccessTankUI: level !== 'collaborator' && level !== null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadPermissions();
  }, [innovationId]);

  return permissions;
};

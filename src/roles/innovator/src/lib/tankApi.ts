// Simplified Tank API using Supabase directly
import { supabase } from '@/integrations/supabase/client';
import type { Innovation, Pitch } from '@/types';

// View tracking
export async function recordView(type: 'innovation' | 'pitch', id: string) {
  try {
    // Update views_count in the appropriate table
    if (type === 'innovation') {
      const { data } = await supabase
        .from('innovations')
        .select('metrics')
        .eq('id', id)
        .single();
      
      const currentMetrics = (data?.metrics as any) || {};
      const newMetrics = {
        ...currentMetrics,
        views: (currentMetrics.views || 0) + 1
      };

      await supabase
        .from('innovations')
        .update({ metrics: newMetrics })
        .eq('id', id);
    }
  } catch (error) {
    console.error('Error recording view:', error);
  }
}

// Innovation API
export const innovationAPI = {
  async getPrimaryInnovation(): Promise<Innovation | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // First, try to get user's own innovations
      const { data: ownInnovations, error: ownError } = await supabase
        .from('innovations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (ownError) throw ownError;
      
      if (ownInnovations && ownInnovations.length > 0) {
        return ownInnovations[0] as unknown as Innovation;
      }

      // If no own innovations, check team memberships
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('innovation_id')
        .eq('user_id', user.id)
        .limit(1);

      if (teamError) throw teamError;
      
      if (!teamMembers || teamMembers.length === 0) return null;

      // Get the innovation details
      const { data: teamInnovation, error: innovationError } = await supabase
        .from('innovations')
        .select('*')
        .eq('id', teamMembers[0].innovation_id)
        .single();

      if (innovationError) throw innovationError;
      
      return teamInnovation as unknown as Innovation;
    } catch (error) {
      console.error('Error getting primary innovation:', error);
      return null;
    }
  },

  async getAllInnovations(): Promise<Innovation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('innovations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Innovation[];
    } catch (error) {
      console.error('Error getting innovations:', error);
      return [];
    }
  }
};

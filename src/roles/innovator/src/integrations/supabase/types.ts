export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          opportunity_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          max_attendees: number | null
          start_time: string
          title: string
          type: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          start_time: string
          title: string
          type: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          start_time?: string
          title?: string
          type?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      innovations: {
        Row: {
          category: string | null
          company_name: string
          competitive_advantage: string | null
          created_at: string
          current_funding: number | null
          faqs: Json | null
          full_description: string | null
          funding_goal: number | null
          id: string
          image_url: string | null
          is_published: boolean | null
          market_size: string | null
          metrics: Json | null
          pitch_deck_url: string | null
          problem_statement: string | null
          solution: string | null
          stage: string | null
          status: string | null
          tagline: string | null
          tags: string[] | null
          team_description: string | null
          thumbnail_url: string | null
          title: string
          traction: string | null
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          company_name?: string
          competitive_advantage?: string | null
          created_at?: string
          current_funding?: number | null
          faqs?: Json | null
          full_description?: string | null
          funding_goal?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          market_size?: string | null
          metrics?: Json | null
          pitch_deck_url?: string | null
          problem_statement?: string | null
          solution?: string | null
          stage?: string | null
          status?: string | null
          tagline?: string | null
          tags?: string[] | null
          team_description?: string | null
          thumbnail_url?: string | null
          title: string
          traction?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          company_name?: string
          competitive_advantage?: string | null
          created_at?: string
          current_funding?: number | null
          faqs?: Json | null
          full_description?: string | null
          funding_goal?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          market_size?: string | null
          metrics?: Json | null
          pitch_deck_url?: string | null
          problem_statement?: string | null
          solution?: string | null
          stage?: string | null
          status?: string | null
          tagline?: string | null
          tags?: string[] | null
          team_description?: string | null
          thumbnail_url?: string | null
          title?: string
          traction?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "innovations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string
          id: string
          title: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          read_by: string[] | null
          sender_id: string
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          read_by?: string[] | null
          sender_id: string
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          read_by?: string[] | null
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          created_at: string
          created_by: string
          deadline: string | null
          description: string | null
          id: string
          location: string | null
          remote_ok: boolean | null
          skills_required: string[] | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deadline?: string | null
          description?: string | null
          id?: string
          location?: string | null
          remote_ok?: boolean | null
          skills_required?: string[] | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deadline?: string | null
          description?: string | null
          id?: string
          location?: string | null
          remote_ok?: boolean | null
          skills_required?: string[] | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_analytics: {
        Row: {
          avg_watch_time: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          id: string
          pitch_id: string
          unique_viewers: number | null
          views: number | null
        }
        Insert: {
          avg_watch_time?: number | null
          created_at?: string
          date: string
          engagement_rate?: number | null
          id?: string
          pitch_id: string
          unique_viewers?: number | null
          views?: number | null
        }
        Update: {
          avg_watch_time?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          pitch_id?: string
          unique_viewers?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pitch_analytics_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          caption: string | null
          created_at: string
          deck_url: string | null
          description: string | null
          funding_goal: number | null
          funding_raised: number | null
          hashtags: string[] | null
          id: string
          innovation_id: string
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          visibility: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          deck_url?: string | null
          description?: string | null
          funding_goal?: number | null
          funding_raised?: number | null
          hashtags?: string[] | null
          id?: string
          innovation_id: string
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          visibility?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          deck_url?: string | null
          description?: string | null
          funding_goal?: number | null
          funding_raised?: number | null
          hashtags?: string[] | null
          id?: string
          innovation_id?: string
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pitches_innovation_id_fkey"
            columns: ["innovation_id"]
            isOneToOne: false
            referencedRelation: "innovations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          interests: string[] | null
          location: string | null
          role: string | null
          seeking: string[] | null
          skills: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          role?: string | null
          seeking?: string[] | null
          skills?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          role?: string | null
          seeking?: string[] | null
          skills?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          id: string
          innovation_id: string
          invited_by_user_id: string
          invited_user_id: string
          permission_level:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          innovation_id: string
          invited_by_user_id: string
          invited_user_id: string
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          innovation_id?: string
          invited_by_user_id?: string
          invited_user_id?: string
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_innovation_id_fkey"
            columns: ["innovation_id"]
            isOneToOne: false
            referencedRelation: "innovations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          innovation_id: string | null
          joined_at: string
          permission_level:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role: string | null
          team_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          innovation_id?: string | null
          joined_at?: string
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role?: string | null
          team_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          innovation_id?: string | null
          joined_at?: string
          permission_level?:
            | Database["public"]["Enums"]["permission_level"]
            | null
          role?: string | null
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_innovation_id_fkey"
            columns: ["innovation_id"]
            isOneToOne: false
            referencedRelation: "innovations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thought_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          thought_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          thought_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          thought_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thought_comments_thought_id_fkey"
            columns: ["thought_id"]
            isOneToOne: false
            referencedRelation: "thoughts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thought_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thought_likes: {
        Row: {
          created_at: string
          id: string
          thought_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          thought_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          thought_id?: string
          user_id?: string
        }
        Relationships: []
      }
      thoughts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          likes_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thoughts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_participants_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_direct_message_thread: {
        Args: { participant_ids: string[] }
        Returns: string
      }
      get_user_permission_level: {
        Args: { _innovation_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["permission_level"]
      }
      is_thread_participant: {
        Args: { thread_uuid: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      permission_level:
        | "admin"
        | "member"
        | "collaborator"
        | "founder"
        | "co_founder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      permission_level: [
        "admin",
        "member",
        "collaborator",
        "founder",
        "co_founder",
      ],
    },
  },
} as const

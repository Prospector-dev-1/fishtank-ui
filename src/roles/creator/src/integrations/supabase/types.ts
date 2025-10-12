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
      contracts: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          id: string
          project_id: string
          signed_nda: boolean | null
          start_date: string | null
          startup_id: string
          status: Database["public"]["Enums"]["contract_status"] | null
          title: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_id: string
          signed_nda?: boolean | null
          start_date?: string | null
          startup_id: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          title: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_id?: string
          signed_nda?: boolean | null
          start_date?: string | null
          startup_id?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          title?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_skills: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          skill_id: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_skills_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string
          creator_id: string
          id: string
          milestone_id: string | null
          payment_date: string | null
          status: string | null
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string
          creator_id: string
          id?: string
          milestone_id?: string | null
          payment_date?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          milestone_id?: string | null
          payment_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      endorsements: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          endorser_id: string
          id: string
          rating: number | null
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          endorser_id: string
          id?: string
          rating?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          endorser_id?: string
          id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "endorsements_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          milestones: Json
          nda_required: boolean | null
          note: string | null
          role: string
          split_pct: number | null
          status: string
          to_creator_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          milestones?: Json
          nda_required?: boolean | null
          note?: string | null
          role: string
          split_pct?: number | null
          status?: string
          to_creator_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          milestones?: Json
          nda_required?: boolean | null
          note?: string | null
          role?: string
          split_pct?: number | null
          status?: string
          to_creator_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          amount: number
          approved_at: string | null
          contract_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["milestone_status"] | null
          submission_notes: string | null
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          contract_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["milestone_status"] | null
          submission_notes?: string | null
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          contract_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["milestone_status"] | null
          submission_notes?: string | null
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          image_url: string | null
          project_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          hourly_rate: number | null
          id: string
          location: string | null
          project_rate: number | null
          social_links: Json | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          hourly_rate?: number | null
          id: string
          location?: string | null
          project_rate?: number | null
          social_links?: Json | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          location?: string | null
          project_rate?: number | null
          social_links?: Json | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          required_skills: string[] | null
          startup_id: string
          status: string | null
          timeline_weeks: number | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          required_skills?: string[] | null
          startup_id: string
          status?: string | null
          timeline_weeks?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          required_skills?: string[] | null
          startup_id?: string
          status?: string | null
          timeline_weeks?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          cover_letter: string
          created_at: string
          creator_id: string
          id: string
          project_id: string
          proposed_rate: number
          proposed_timeline_weeks: number
          status: Database["public"]["Enums"]["proposal_status"] | null
          updated_at: string
        }
        Insert: {
          cover_letter: string
          created_at?: string
          creator_id: string
          id?: string
          project_id: string
          proposed_rate: number
          proposed_timeline_weeks: number
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string
        }
        Update: {
          cover_letter?: string
          created_at?: string
          creator_id?: string
          id?: string
          project_id?: string
          proposed_rate?: number
          proposed_timeline_weeks?: number
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string
          creator_id: string
          delivery_days: number | null
          description: string | null
          id: string
          image_url: string | null
          offers_commission: boolean | null
          offers_equity: boolean | null
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          creator_id: string
          delivery_days?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          offers_commission?: boolean | null
          offers_equity?: boolean | null
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          creator_id?: string
          delivery_days?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          offers_commission?: boolean | null
          offers_equity?: boolean | null
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          founding_date: string | null
          funding_stage: Database["public"]["Enums"]["funding_stage"] | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          team_size: number | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          founding_date?: string | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"] | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          founding_date?: string | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"] | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_members_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          team_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          team_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      thought_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          thought_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          thought_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          thought_id?: string
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
        Relationships: [
          {
            foreignKeyName: "thought_likes_thought_id_fkey"
            columns: ["thought_id"]
            isOneToOne: false
            referencedRelation: "thoughts"
            referencedColumns: ["id"]
          },
        ]
      }
      thoughts: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_creator: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "creator" | "startup" | "admin"
      contract_status: "pending" | "active" | "completed" | "cancelled"
      funding_stage:
        | "pre_seed"
        | "seed"
        | "series_a"
        | "series_b"
        | "series_c"
        | "public"
      milestone_status:
        | "pending"
        | "in_progress"
        | "submitted"
        | "approved"
        | "rejected"
      proposal_status: "pending" | "accepted" | "rejected" | "withdrawn"
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
      app_role: ["creator", "startup", "admin"],
      contract_status: ["pending", "active", "completed", "cancelled"],
      funding_stage: [
        "pre_seed",
        "seed",
        "series_a",
        "series_b",
        "series_c",
        "public",
      ],
      milestone_status: [
        "pending",
        "in_progress",
        "submitted",
        "approved",
        "rejected",
      ],
      proposal_status: ["pending", "accepted", "rejected", "withdrawn"],
    },
  },
} as const

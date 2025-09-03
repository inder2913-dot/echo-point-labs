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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      custom_industries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          starter_template: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          starter_template?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          starter_template?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_industry_profiles: {
        Row: {
          created_at: string
          custom_industry_id: string
          department: string
          hardware_cpu: string
          hardware_graphics: string
          hardware_graphics_capacity: string | null
          hardware_ram: string
          hardware_storage: string
          id: string
          level: string
          role: string
          source_profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_industry_id: string
          department: string
          hardware_cpu?: string
          hardware_graphics?: string
          hardware_graphics_capacity?: string | null
          hardware_ram?: string
          hardware_storage?: string
          id?: string
          level: string
          role: string
          source_profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_industry_id?: string
          department?: string
          hardware_cpu?: string
          hardware_graphics?: string
          hardware_graphics_capacity?: string | null
          hardware_ram?: string
          hardware_storage?: string
          id?: string
          level?: string
          role?: string
          source_profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_industry_profiles_custom_industry_id_fkey"
            columns: ["custom_industry_id"]
            isOneToOne: false
            referencedRelation: "custom_industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_industry_profiles_source_profile_id_fkey"
            columns: ["source_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_data: {
        Row: {
          created_at: string
          data: Json
          id: string
          project_id: string
          step_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          project_id: string
          step_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          project_id?: string
          step_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          organization_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          organization_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          organization_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          baseline_id: string | null
          created_at: string
          department: string
          description: string | null
          hardware_cpu: string
          hardware_graphics: string
          hardware_graphics_capacity: string | null
          hardware_ram: string
          hardware_storage: string
          id: string
          industry: string | null
          is_custom: boolean
          level: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          baseline_id?: string | null
          created_at?: string
          department: string
          description?: string | null
          hardware_cpu?: string
          hardware_graphics?: string
          hardware_graphics_capacity?: string | null
          hardware_ram?: string
          hardware_storage?: string
          id?: string
          industry?: string | null
          is_custom?: boolean
          level: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          baseline_id?: string | null
          created_at?: string
          department?: string
          description?: string | null
          hardware_cpu?: string
          hardware_graphics?: string
          hardware_graphics_capacity?: string | null
          hardware_ram?: string
          hardware_storage?: string
          id?: string
          industry?: string | null
          is_custom?: boolean
          level?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_baseline_id_fkey"
            columns: ["baseline_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

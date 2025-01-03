export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_assignments: {
        Row: {
          created_at: string
          id: string
          job_id: string | null
          lights_role: Database["public"]["Enums"]["lights_role"] | null
          sound_role: Database["public"]["Enums"]["sound_role"] | null
          status: string | null
          technician_id: string | null
          video_role: Database["public"]["Enums"]["video_role"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id?: string | null
          lights_role?: Database["public"]["Enums"]["lights_role"] | null
          sound_role?: Database["public"]["Enums"]["sound_role"] | null
          status?: string | null
          technician_id?: string | null
          video_role?: Database["public"]["Enums"]["video_role"] | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string | null
          lights_role?: Database["public"]["Enums"]["lights_role"] | null
          sound_role?: Database["public"]["Enums"]["sound_role"] | null
          status?: string | null
          technician_id?: string | null
          video_role?: Database["public"]["Enums"]["video_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "job_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          job_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          job_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_notes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          color: string | null
          created_at: string
          departments: Database["public"]["Enums"]["department"][] | null
          description: string | null
          end_time: string
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string | null
          start_time: string
          title: string
          tour_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          departments?: Database["public"]["Enums"]["department"][] | null
          description?: string | null
          end_time: string
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          start_time: string
          title: string
          tour_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          departments?: Database["public"]["Enums"]["department"][] | null
          description?: string | null
          end_time?: string
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          start_time?: string
          title?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      technicians: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["department"]
          dni: string | null
          email: string
          id: string
          name: string
          phone: string | null
          residencia: string | null
        }
        Insert: {
          created_at?: string
          department?: Database["public"]["Enums"]["department"]
          dni?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          residencia?: string | null
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["department"]
          dni?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          residencia?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_test_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      department: "sound" | "lights" | "video"
      job_role:
        | "Responsable de Sonido"
        | "Tecnico Especialista"
        | "Tecnico de Sonido"
        | "Auxiliar de Sonido"
      job_type: "single" | "tour"
      lights_role:
        | "Responsable de Iluminacion"
        | "Tecnico especialista"
        | "Tecnico de Iluminacion"
        | "Auxiliar de Iluminacion"
      sound_role:
        | "Responsable de Sonido"
        | "Tecnico Especialista"
        | "Tecnico de Sonido"
        | "Auxiliar de Sonido"
      user_role: "management" | "logistics" | "technician"
      video_role:
        | "Responsable de Video"
        | "Tecnico de Video"
        | "Operador/Realizador de Video"
        | "Operador de Camara"
        | "Auxiliar de Video"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

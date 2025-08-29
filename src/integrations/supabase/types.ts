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
      accessories: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          org_id: string
          price_cents: number
          stock: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          org_id: string
          price_cents: number
          stock?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          org_id?: string
          price_cents?: number
          stock?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessories_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      accessory_order_items: {
        Row: {
          accessory_id: string
          created_at: string
          id: string
          order_id: string
          price_cents: number
          qty: number
        }
        Insert: {
          accessory_id: string
          created_at?: string
          id?: string
          order_id: string
          price_cents: number
          qty?: number
        }
        Update: {
          accessory_id?: string
          created_at?: string
          id?: string
          order_id?: string
          price_cents?: number
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "accessory_order_items_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessory_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "accessory_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      accessory_orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          status: string | null
          store_id: string
          total_cents: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string | null
          store_id: string
          total_cents: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string | null
          store_id?: string
          total_cents?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessory_orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      bike_models: {
        Row: {
          active: boolean | null
          brand: string
          colors: string[] | null
          created_at: string
          id: string
          image_urls: string[] | null
          model: string
          org_id: string | null
          specs: Json | null
          updated_at: string
          year: number | null
        }
        Insert: {
          active?: boolean | null
          brand: string
          colors?: string[] | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          model: string
          org_id?: string | null
          specs?: Json | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          active?: boolean | null
          brand?: string
          colors?: string[] | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          model?: string
          org_id?: string | null
          specs?: Json | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bike_models_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      bikes: {
        Row: {
          bike_model_id: string
          color: string
          created_at: string
          id: string
          last_maintenance_at: string | null
          notes: string | null
          odometer: number | null
          plate: string | null
          status: string | null
          store_id: string
          updated_at: string
          vin: string | null
        }
        Insert: {
          bike_model_id: string
          color: string
          created_at?: string
          id?: string
          last_maintenance_at?: string | null
          notes?: string | null
          odometer?: number | null
          plate?: string | null
          status?: string | null
          store_id: string
          updated_at?: string
          vin?: string | null
        }
        Update: {
          bike_model_id?: string
          color?: string
          created_at?: string
          id?: string
          last_maintenance_at?: string | null
          notes?: string | null
          odometer?: number | null
          plate?: string | null
          status?: string | null
          store_id?: string
          updated_at?: string
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bikes_bike_model_id_fkey"
            columns: ["bike_model_id"]
            isOneToOne: false
            referencedRelation: "bike_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bikes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          org_id: string
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          name: string
          org_id: string
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          org_id?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchises_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_cents: number
          boleto_url: string | null
          created_at: string
          due_at: string | null
          gateway: string | null
          gateway_payment_id: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          pix_copy_paste: string | null
          pix_qr_code: string | null
          rental_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          boleto_url?: string | null
          created_at?: string
          due_at?: string | null
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          rental_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          boleto_url?: string | null
          created_at?: string
          due_at?: string | null
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          rental_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          active: boolean | null
          created_at: string
          franchise_id: string | null
          id: string
          org_id: string
          role: string
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          franchise_id?: string | null
          id?: string
          org_id: string
          role?: string
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          franchise_id?: string | null
          id?: string
          org_id?: string
          role?: string
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          created_at: string
          document_id: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string
          document_id: string | null
          driver_license: string | null
          full_name: string
          id: string
          is_staff: boolean | null
          phone: string | null
          serasa_score: number | null
          serasa_status: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          document_id?: string | null
          driver_license?: string | null
          full_name: string
          id?: string
          is_staff?: boolean | null
          phone?: string | null
          serasa_score?: number | null
          serasa_status?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          document_id?: string | null
          driver_license?: string | null
          full_name?: string
          id?: string
          is_staff?: boolean | null
          phone?: string | null
          serasa_score?: number | null
          serasa_status?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      rental_plans: {
        Row: {
          active: boolean | null
          base_price_cents: number
          created_at: string
          deposit_cents: number | null
          description: string | null
          duration_qty: number
          duration_type: string
          id: string
          name: string
          org_id: string
          price_rules: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          base_price_cents: number
          created_at?: string
          deposit_cents?: number | null
          description?: string | null
          duration_qty?: number
          duration_type: string
          id?: string
          name: string
          org_id: string
          price_rules?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          base_price_cents?: number
          created_at?: string
          deposit_cents?: number | null
          description?: string | null
          duration_qty?: number
          duration_type?: string
          id?: string
          name?: string
          org_id?: string
          price_rules?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_plans_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          bike_id: string
          created_at: string
          deposit_cents: number | null
          end_at: string
          id: string
          km_end: number | null
          km_start: number | null
          pickup_notes: string | null
          price_cents: number
          rental_plan_id: string
          return_notes: string | null
          start_at: string
          status: string | null
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bike_id: string
          created_at?: string
          deposit_cents?: number | null
          end_at: string
          id?: string
          km_end?: number | null
          km_start?: number | null
          pickup_notes?: string | null
          price_cents: number
          rental_plan_id: string
          return_notes?: string | null
          start_at: string
          status?: string | null
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bike_id?: string
          created_at?: string
          deposit_cents?: number | null
          end_at?: string
          id?: string
          km_end?: number | null
          km_start?: number | null
          pickup_notes?: string | null
          price_cents?: number
          rental_plan_id?: string
          return_notes?: string | null
          start_at?: string
          status?: string | null
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_bike_id_fkey"
            columns: ["bike_id"]
            isOneToOne: false
            referencedRelation: "available_bikes_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_bike_id_fkey"
            columns: ["bike_id"]
            isOneToOne: false
            referencedRelation: "bikes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_rental_plan_id_fkey"
            columns: ["rental_plan_id"]
            isOneToOne: false
            referencedRelation: "rental_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          active: boolean | null
          address: string
          city: string
          created_at: string
          franchise_id: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          state: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address: string
          city: string
          created_at?: string
          franchise_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          state: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string
          created_at?: string
          franchise_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      twofa_codes: {
        Row: {
          channel: string
          code: string
          consumed: boolean | null
          created_at: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          channel: string
          code: string
          consumed?: boolean | null
          created_at?: string
          expires_at: string
          id?: string
          user_id: string
        }
        Update: {
          channel?: string
          code?: string
          consumed?: boolean | null
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          used?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      available_bikes_public: {
        Row: {
          brand: string | null
          city: string | null
          color: string | null
          id: string | null
          image_urls: string[] | null
          model: string | null
          odometer: number | null
          specs: Json | null
          state: string | null
          status: string | null
          store_name: string | null
          year: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_available_bikes_public: {
        Args: Record<PropertyKey, never>
        Returns: {
          brand: string | null
          city: string | null
          color: string | null
          id: string | null
          image_urls: string[] | null
          model: string | null
          odometer: number | null
          specs: Json | null
          state: string | null
          status: string | null
          store_name: string | null
          year: number | null
        }[]
      }
      get_user_org_ids: {
        Args: { user_uuid: string }
        Returns: {
          franchise_id: string
          org_id: string
          role: string
          store_id: string
        }[]
      }
      is_user_staff: {
        Args: { user_uuid: string }
        Returns: boolean
      }
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

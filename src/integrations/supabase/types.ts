export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          credit_limit: number | null
          customer_tier: Database["public"]["Enums"]["customer_tier"] | null
          customer_type: Database["public"]["Enums"]["customer_type"] | null
          email: string | null
          gstin: string | null
          id: string
          last_order_date: string | null
          outstanding_amount: number | null
          pan: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          total_orders: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          credit_limit?: number | null
          customer_tier?: Database["public"]["Enums"]["customer_tier"] | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email?: string | null
          gstin?: string | null
          id?: string
          last_order_date?: string | null
          outstanding_amount?: number | null
          pan?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          total_orders?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          credit_limit?: number | null
          customer_tier?: Database["public"]["Enums"]["customer_tier"] | null
          customer_type?: Database["public"]["Enums"]["customer_type"] | null
          email?: string | null
          gstin?: string | null
          id?: string
          last_order_date?: string | null
          outstanding_amount?: number | null
          pan?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          total_orders?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      dispatch_orders: {
        Row: {
          actual_delivery: string | null
          courier_name: string | null
          created_at: string
          created_by: string | null
          delivery_address: string
          dispatch_date: string
          dispatch_number: string
          estimated_delivery: string | null
          id: string
          order_id: string
          status: Database["public"]["Enums"]["dispatch_status"]
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          delivery_address: string
          dispatch_date?: string
          dispatch_number: string
          estimated_delivery?: string | null
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["dispatch_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          delivery_address?: string
          dispatch_date?: string
          dispatch_number?: string
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["dispatch_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_line1: string
          avatar_url: string | null
          blood_group: string | null
          city: string
          created_at: string | null
          created_by: string | null
          date_of_birth: string
          department: string
          designation: string
          emergency_contact_name: string
          emergency_contact_phone: string
          employee_code: string
          employment_type: string
          full_name: string
          gender: string
          id: string
          joining_date: string
          marital_status: string | null
          personal_email: string | null
          personal_phone: string
          pincode: string
          reports_to: string | null
          state: string
          updated_at: string | null
        }
        Insert: {
          address_line1: string
          avatar_url?: string | null
          blood_group?: string | null
          city: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth: string
          department: string
          designation: string
          emergency_contact_name: string
          emergency_contact_phone: string
          employee_code?: string
          employment_type: string
          full_name: string
          gender: string
          id?: string
          joining_date: string
          marital_status?: string | null
          personal_email?: string | null
          personal_phone: string
          pincode: string
          reports_to?: string | null
          state: string
          updated_at?: string | null
        }
        Update: {
          address_line1?: string
          avatar_url?: string | null
          blood_group?: string | null
          city?: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string
          department?: string
          designation?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          employee_code?: string
          employment_type?: string
          full_name?: string
          gender?: string
          id?: string
          joining_date?: string
          marital_status?: string | null
          personal_email?: string | null
          personal_phone?: string
          pincode?: string
          reports_to?: string | null
          state?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_variants: {
        Row: {
          color: string
          created_at: string
          description: string | null
          fabric_id: string
          gsm: string | null
          id: string
          rate_per_meter: number | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          fabric_id: string
          gsm?: string | null
          id?: string
          rate_per_meter?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          fabric_id?: string
          gsm?: string | null
          id?: string
          rate_per_meter?: number | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          color: string
          created_at: string
          description: string | null
          gsm: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          gsm?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          gsm?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          current_stock: number
          id: string
          item_code: string
          item_name: string
          last_purchase_date: string | null
          maximum_stock: number | null
          minimum_stock: number
          rate_per_unit: number
          supplier_contact: string | null
          supplier_name: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_stock?: number
          id?: string
          item_code: string
          item_name: string
          last_purchase_date?: string | null
          maximum_stock?: number | null
          minimum_stock?: number
          rate_per_unit: number
          supplier_contact?: string | null
          supplier_name?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_stock?: number
          id?: string
          item_code?: string
          item_name?: string
          last_purchase_date?: string | null
          maximum_stock?: number | null
          minimum_stock?: number
          rate_per_unit?: number
          supplier_contact?: string | null
          supplier_name?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          product_id: string | null
          quantity: number
          total_price: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          product_id?: string | null
          quantity: number
          total_price?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          product_id?: string | null
          quantity?: number
          total_price?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_amount: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          order_id: string | null
          paid_amount: number | null
          status: string
          subtotal: number
          tax_amount: number
          terms_and_conditions: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          balance_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          balance_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          attachments: string[] | null
          category_image_url: string | null
          color: string | null
          created_at: string
          fabric_id: string | null
          gsm: string | null
          id: string
          mockup_images: string[] | null
          order_id: string
          product_category_id: string | null
          product_description: string | null
          product_id: string | null
          quantity: number
          reference_images: string[] | null
          remarks: string | null
          size_type_id: string | null
          sizes_quantities: Json | null
          specifications: Json | null
          total_price: number
          unit_price: number
        }
        Insert: {
          attachments?: string[] | null
          category_image_url?: string | null
          color?: string | null
          created_at?: string
          fabric_id?: string | null
          gsm?: string | null
          id?: string
          mockup_images?: string[] | null
          order_id: string
          product_category_id?: string | null
          product_description?: string | null
          product_id?: string | null
          quantity: number
          reference_images?: string[] | null
          remarks?: string | null
          size_type_id?: string | null
          sizes_quantities?: Json | null
          specifications?: Json | null
          total_price: number
          unit_price: number
        }
        Update: {
          attachments?: string[] | null
          category_image_url?: string | null
          color?: string | null
          created_at?: string
          fabric_id?: string | null
          gsm?: string | null
          id?: string
          mockup_images?: string[] | null
          order_id?: string
          product_category_id?: string | null
          product_description?: string | null
          product_id?: string | null
          quantity?: number
          reference_images?: string[] | null
          remarks?: string | null
          size_type_id?: string | null
          sizes_quantities?: Json | null
          specifications?: Json | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          advance_amount: number | null
          balance_amount: number | null
          created_at: string
          created_by: string | null
          customer_id: string
          delivery_date: string | null
          expected_delivery_date: string | null
          final_amount: number
          gst_amount: number | null
          gst_rate: number | null
          id: string
          notes: string | null
          order_date: string
          order_number: string
          payment_channel: string | null
          reference_id: string | null
          sales_manager: string | null
          status: Database["public"]["Enums"]["order_status"]
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          advance_amount?: number | null
          balance_amount?: number | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          delivery_date?: string | null
          expected_delivery_date?: string | null
          final_amount?: number
          gst_amount?: number | null
          gst_rate?: number | null
          id?: string
          notes?: string | null
          order_date?: string
          order_number: string
          payment_channel?: string | null
          reference_id?: string | null
          sales_manager?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          advance_amount?: number | null
          balance_amount?: number | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          delivery_date?: string | null
          expected_delivery_date?: string | null
          final_amount?: number
          gst_amount?: number | null
          gst_rate?: number | null
          id?: string
          notes?: string | null
          order_date?: string
          order_number?: string
          payment_channel?: string | null
          reference_id?: string | null
          sales_manager?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_image_url: string | null
          category_images: Json | null
          category_name: string
          created_at: string
          description: string | null
          fabrics: string[] | null
          id: string
          updated_at: string
        }
        Insert: {
          category_image_url?: string | null
          category_images?: Json | null
          category_name: string
          created_at?: string
          description?: string | null
          fabrics?: string[] | null
          id?: string
          updated_at?: string
        }
        Update: {
          category_image_url?: string | null
          category_images?: Json | null
          category_name?: string
          created_at?: string
          description?: string | null
          fabrics?: string[] | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      production_orders: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          efficiency_percentage: number | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          order_id: string
          production_number: string
          stage: Database["public"]["Enums"]["production_stage"]
          start_date: string | null
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          efficiency_percentage?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          order_id: string
          production_number: string
          stage?: Database["public"]["Enums"]["production_stage"]
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          efficiency_percentage?: number | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          order_id?: string
          production_number?: string
          stage?: Database["public"]["Enums"]["production_stage"]
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category: string
          code: string
          cost_price: number | null
          created_at: string
          description: string | null
          hsn_code: string | null
          id: string
          name: string
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          base_price: number
          category: string
          code: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          hsn_code?: string | null
          id?: string
          name: string
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          code?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          hsn_code?: string | null
          id?: string
          name?: string
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quality_checks: {
        Row: {
          check_date: string
          checked_by: string | null
          created_at: string
          defects_found: string[] | null
          id: string
          notes: string | null
          order_id: string
          pass_percentage: number | null
          production_order_id: string | null
          rework_required: boolean | null
          status: Database["public"]["Enums"]["quality_status"]
        }
        Insert: {
          check_date?: string
          checked_by?: string | null
          created_at?: string
          defects_found?: string[] | null
          id?: string
          notes?: string | null
          order_id: string
          pass_percentage?: number | null
          production_order_id?: string | null
          rework_required?: boolean | null
          status?: Database["public"]["Enums"]["quality_status"]
        }
        Update: {
          check_date?: string
          checked_by?: string | null
          created_at?: string
          defects_found?: string[] | null
          id?: string
          notes?: string | null
          order_id?: string
          pass_percentage?: number | null
          production_order_id?: string | null
          rework_required?: boolean | null
          status?: Database["public"]["Enums"]["quality_status"]
        }
        Relationships: [
          {
            foreignKeyName: "quality_checks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_checks_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      size_types: {
        Row: {
          available_sizes: string[]
          created_at: string
          id: string
          size_name: string
          updated_at: string
        }
        Insert: {
          available_sizes?: string[]
          created_at?: string
          id?: string
          size_name: string
          updated_at?: string
        }
        Update: {
          available_sizes?: string[]
          created_at?: string
          id?: string
          size_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      customer_tier: "bronze" | "silver" | "gold" | "platinum"
      customer_type:
        | "Retail"
        | "Wholesale"
        | "Corporate"
        | "B2B"
        | "B2C"
        | "Enterprise"
      customer_Type: "Retail" | "Wholesale" | "Ecommerce" | "Staff"
      dispatch_status: "pending" | "packed" | "shipped" | "delivered"
      order_status:
        | "pending"
        | "confirmed"
        | "in_production"
        | "quality_check"
        | "completed"
        | "cancelled"
      production_stage:
        | "cutting"
        | "stitching"
        | "embroidery"
        | "packaging"
        | "completed"
      quality_status: "pending" | "passed" | "failed" | "rework"
      user_role:
        | "admin"
        | "sales manager"
        | "production manager"
        | "graphic & printing"
        | "procurement manager"
        | "cutting master"
        | "qc manager"
        | "packaging & dispatch manager"
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
      customer_tier: ["bronze", "silver", "gold", "platinum"],
      customer_type: [
        "Retail",
        "Wholesale",
        "Corporate",
        "B2B",
        "B2C",
        "Enterprise",
      ],
      customer_Type: ["Retail", "Wholesale", "Ecommerce", "Staff"],
      dispatch_status: ["pending", "packed", "shipped", "delivered"],
      order_status: [
        "pending",
        "confirmed",
        "in_production",
        "quality_check",
        "completed",
        "cancelled",
      ],
      production_stage: [
        "cutting",
        "stitching",
        "embroidery",
        "packaging",
        "completed",
      ],
      quality_status: ["pending", "passed", "failed", "rework"],
      user_role: [
        "admin",
        "sales manager",
        "production manager",
        "graphic & printing",
        "procurement manager",
        "cutting master",
        "qc manager",
        "packaging & dispatch manager",
      ],
    },
  },
} as const

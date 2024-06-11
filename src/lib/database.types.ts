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
      highlights: {
        Row: {
          created_at: string
          creator_address: string
          highlight_signature: string
          id: number
          position: number
          price_paid: number
          slot_hours: number
          start_time: string
          token_id: string
        }
        Insert: {
          created_at?: string
          creator_address: string
          highlight_signature: string
          id?: number
          position: number
          price_paid: number
          slot_hours: number
          start_time?: string
          token_id: string
        }
        Update: {
          created_at?: string
          creator_address?: string
          highlight_signature?: string
          id?: number
          position?: number
          price_paid?: number
          slot_hours?: number
          start_time?: string
          token_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_creator_address_fkey"
            columns: ["creator_address"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_address"]
          },
          {
            foreignKeyName: "highlights_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          create_signature: string
          created_at: string
          description: string
          id: string
          image: string
          lp_matured: boolean
          metadata_uri: string
          name: string
          owner: string
          symbol: string
          views: number
        }
        Insert: {
          create_signature: string
          created_at?: string
          description: string
          id: string
          image: string
          lp_matured?: boolean
          metadata_uri: string
          name: string
          owner: string
          symbol: string
          views?: number
        }
        Update: {
          create_signature?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          lp_matured?: boolean
          metadata_uri?: string
          name?: string
          owner?: string
          symbol?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "tokens_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_address"]
          },
        ]
      }
      trades: {
        Row: {
          amount: number
          created_at: string
          id: number
          price: string
          token_traded: string
          trade_signature: string
          trade_type: Database["public"]["Enums"]["trade_type"] | null
          trader_address: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          price: string
          token_traded: string
          trade_signature: string
          trade_type?: Database["public"]["Enums"]["trade_type"] | null
          trader_address: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          price?: string
          token_traded?: string
          trade_signature?: string
          trade_type?: Database["public"]["Enums"]["trade_type"] | null
          trader_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_token_traded_fkey"
            columns: ["token_traded"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_trader_address_fkey"
            columns: ["trader_address"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_address"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          full_name: string
          updated_at: string
          user_address: string
        }
        Insert: {
          created_at?: string
          full_name: string
          updated_at?: string
          user_address: string
        }
        Update: {
          created_at?: string
          full_name?: string
          updated_at?: string
          user_address?: string
        }
        Relationships: []
      }
      whishlist: {
        Row: {
          created_at: string
          id: number
          token_id: string
          trade_type: Database["public"]["Enums"]["trade_type"] | null
          user_address: string
        }
        Insert: {
          created_at?: string
          id?: number
          token_id: string
          trade_type?: Database["public"]["Enums"]["trade_type"] | null
          user_address: string
        }
        Update: {
          created_at?: string
          id?: number
          token_id?: string
          trade_type?: Database["public"]["Enums"]["trade_type"] | null
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "whishlist_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whishlist_user_address_fkey"
            columns: ["user_address"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_address"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_highlight: {
        Args: {
          p_highlight_signature: string
          p_price_paid: number
          p_position: number
          p_slot_hours: number
          p_token_id: string
          p_creator_address: string
        }
        Returns: {
          created_at: string
          creator_address: string
          highlight_signature: string
          id: number
          position: number
          price_paid: number
          slot_hours: number
          start_time: string
          token_id: string
        }[]
      }
      fetch_highlights_by_position: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fetch_lp_matured_tokens: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          symbol: string
          image: string
          metadata_uri: string
          description: string
          owner: string
          views: number
          trade_count: number
          total_supply: number
          wishlist_count: number
        }[]
      }
      fetch_ohlc_data: {
        Args: {
          token_id_input: string
          interval_seconds: number
        }
        Returns: {
          token_id: string
          time_interval: string
          open: number
          high: number
          low: number
          close: number
        }[]
      }
      fetch_popular_tokens_with_trades: {
        Args: {
          min_trade_count: number
        }
        Returns: {
          id: string
          name: string
          symbol: string
          image: string
          metadata_uri: string
          description: string
          owner: string
          trade_count: number
          total_supply: number
          wishlist_count: number
          views: number
        }[]
      }
      fetch_token_data_with_counts: {
        Args: {
          p_token_id: string
        }
        Returns: Json
      }
      fetch_token_data_with_trades_and_counts: {
        Args: {
          p_token_id: string
        }
        Returns: Json
      }
      fetch_token_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          symbol: string
          image: string
          owner: string
          metadata_uri: string
          description: string
          views: number
          created_at: string
          trade_count: number
          total_supply: number
          wishlist_count: number
        }[]
      }
      fetch_user_tokens: {
        Args: {
          user_address: string
        }
        Returns: {
          id: string
          name: string
          symbol: string
          image: string
          metadata_uri: string
          description: string
          views: number
          created_at: string
          trade_count: number
          total_supply: number
          wishlist_count: number
        }[]
      }
      fetch_user_trade_data: {
        Args: {
          p_user_address: string
        }
        Returns: {
          user_address: string
          total_trade_count: number
          sell_trade_count: number
          buy_trade_count: number
          total_tokens_created: number
        }[]
      }
      fetch_user_wishlisted_tokens: {
        Args: {
          user_addr: string
        }
        Returns: {
          id: string
          name: string
          symbol: string
          image: string
          metadata_uri: string
          description: string
          owner: string
          views: number
          trade_count: number
          total_supply: number
          wishlist_count: number
        }[]
      }
      increment_token_views: {
        Args: {
          p_token_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      trade_type: "buy_tokens" | "sell_tokens"
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

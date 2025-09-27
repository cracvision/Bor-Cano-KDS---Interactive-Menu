
export type BadgeType = 'vegan' | 'gluten_free' | 'spicy' | 'chef_special';

export interface MenuOption {
  option_id: string;
  name: string;
  price_delta?: number;
  icon?: string;
}

export interface OptionGroup {
  group_id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  min?: number;
  max?: number;
  options: MenuOption[];
}

export interface MenuItem {
  item_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  photo_url: string;
  audio_url: string;
  is_special: boolean;
  badges: BadgeType[];
  visible: boolean;
  option_groups: OptionGroup[];
}

export interface MenuCategory {
  category_id: string;
  name: string;
  position: number;
  visible: boolean;
}

export interface SelectedOption {
    group_id: string;
    group_name: string;
    option_id: string;
    option_name: string;
    price_delta: number;
}

export interface CartItem {
    id: string; // Unique ID for this specific item in the cart
    menuItem: MenuItem;
    qty: number;
    options: SelectedOption[];
    notes: string;
}

export interface GuestOrder {
    seat: number;
    items: CartItem[];
}

export interface OrderPayload {
  order_id: string;
  table_id: string;
  channel: 'menu';
  customer_name: string; // Mocked
  priority: 'normal';
  notes: string;
  allergies: string[];
  guests: {
    seat: string;
    items: {
      item_id: string;
      name: string;
      qty: number;
      price_unit: number;
      options: SelectedOption[];
      notes: string;
    }[];
  }[];
  totals: {
    subtotal: number;
    taxes: number;
    service_charge: number;
    total: number;
  };
}

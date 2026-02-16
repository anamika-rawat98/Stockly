//Auth API types
export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginData = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type InventoryData = {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  minQuantity: number;
};

export type InventoryResponseData = {
  _id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  minQuantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ShoppingData = {
  name?: string;
  quantity: number;
  unit?: string;
  inventoryItemId?: string;
};

export type PurchaseItemData = {
  expiryDate?: string;
  ismoving: boolean;
};

export type ShoppingResponseData = {
  _id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  isAutoAdded?: boolean;
  createdAt: string;
  updatedAt: string;
};

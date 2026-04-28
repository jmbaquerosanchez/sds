export type Review = {
  id: string;
  productId: string;
  user: string;
  rating: number;
  registeredTimestamp: string; // ISO date string
  avatar: string;
  comment: string;
}
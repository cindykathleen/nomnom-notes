export interface Dish {
  name: string;
  note: string;
  rating: number;
  imageUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  visited: boolean;
  imageUrl: string;
  dishes: Dish[];
}

export interface List {
  uuid: string;
  name: string;
  description: string;
  imageUrl: string;
  restaurants: Restaurant[];
}

export type Lists = List[];
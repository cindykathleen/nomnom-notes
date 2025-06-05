export interface Place {
  id: string;
  name: string;
  mapsUri: string;
  address: string;
  photo: string;
  type: string;
}

export interface Dish {
  name: string;
  note: string;
  rating: number;
  imageUrl: string;
}
export interface Restaurant extends Place {
  rating: number;
  description: string;
  visited: boolean;
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
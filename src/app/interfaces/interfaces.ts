export interface Place {
  id: string;
  name: string;
  type: string;
  address: string;
  mapsUri: string;
  photo: string
}

export interface Dish {
  name: string;
  note: string;
  rating: number;
  photo: string;
  photoUrl: string;
}
export interface Restaurant extends Place {
  photoUrl: string;
  rating: number;
  description: string;
  dishes: Dish[];
  dateAdded: Date;
}

export interface List {
  uuid: string;
  name: string;
  description: string;
  photo: string;
  photoUrl: string;
  restaurants: Restaurant[];
}

export type Lists = List[];
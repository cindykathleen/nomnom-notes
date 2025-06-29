import { Binary } from 'mongodb';

export type Lists = List[];

export interface List {
  _id: string;
  index: number;
  name: string;
  description: string;
  photoId: string;
  photoUrl: string;
  restaurants: string[];
}
export interface Place {
  _id: string;
  name: string;
  type: string;
  address: string;
  mapsUrl: string;
  photoId: string
}

export interface Restaurant extends Place {
  photoUrl: string;
  rating: number;
  description: string;
  dateAdded: Date;
  dishes: string[];
}

export interface Dish {
  _id: string;
  index: number;
  name: string;
  note: string;
  rating: number;
  photoId: string;
  photoUrl: string;
}

export interface SearchResult {
  _id: string;
  result: Place[];
}

export interface Photo {
  _id: string;
  data: Binary;
}
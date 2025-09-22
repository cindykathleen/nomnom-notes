import { Binary } from 'mongodb';

export interface User {
  _id: string;
  name: string;
  email: string;
  lists: string[];
  searchRate: Date[];
  mapRate: Date[];
}

export interface List {
  _id: string;
  owner: string;
  visibility: 'private' | 'public';
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
  location: {
    latitude: number;
    longitude: number;
  };
  mapsUrl: string;
  photoId: string
}

export interface Restaurant extends Place {
  photoUrl: string;
  reviews: Review[];
  dishes: string[];
  dateAdded: Date;
}

export interface Dish {
  _id: string;
  index: number;
  name: string;
  reviews: Review[];
  photoId: string;
  photoUrl: string;
}

export interface Review {
  _id: string;
  createdBy: string;
  name: string;
  rating: number;
  note: string;
}

export interface SearchResult {
  _id: string;
  result: Place[];
}

export interface Photo {
  _id: string;
  data: Binary;
}

export interface Invitation {
  _id: string;
  listId: string;
  invitedBy: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  usedBy: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  lists: string[];
  searchRate: Date[];
  mapRate: Date[];
  photoUrl: string;
  location: string;
  profilePrivacy: boolean;
}

export interface List {
  _id: string;
  owner: string;
  visibility: 'private' | 'public';
  name: string;
  description: string;
  photoUrl: string;
  restaurants: string[];
  dateAdded: Date;
  dateUpdated: Date;
}
export interface Place {
  _id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  mapsUrl: string;
  photoUrl: string;
}

export interface Restaurant extends Place {
  reviews: Review[];
  dishes: string[];
  dateAdded: Date;
  dateUpdated: Date;
}

export interface Dish {
  _id: string;
  index: number;
  name: string;
  reviews: Review[];
  photoUrl: string;
  dateAdded: Date;
  dateUpdated: Date;
}

export interface Review {
  _id: string;
  createdBy: string;
  name: string;
  rating: number;
  note: string;
}

export type SearchQueryResult =
  | { kind: 'error'; message: string }
  | { kind: 'success'; places: Place[] };

export interface SearchResult {
  _id: string;
  result: Place[];
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
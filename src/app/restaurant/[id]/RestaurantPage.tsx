'use client';

import { useState, useEffect } from 'react';
import { Nav } from '@/app/components/Nav';
import { RestaurantListing } from '@/app/components/RestaurantListing';
import { Restaurant } from '@/app/interfaces/interfaces';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function RestaurantPage({ id }: { id: string }) {
  const [restaurant, setRestaurant] = useState<Restaurant>();
  
    useEffect(() => {
      const fetchRestaurant = async () => {
        const response = await fetch(`/api/database/restaurants?id=${id}`);
        const data = await response.json();
        setRestaurant(data);
      }
  
      fetchRestaurant();
    }, []);

  return (
    // Wrap the entire application in the DndProvider for drag-and-drop functionality
    <DndProvider backend={HTML5Backend}>
      <div>
        <Nav />
        {restaurant && <RestaurantListing currRestaurant={restaurant} />}
      </div>
    </DndProvider>
  );
}
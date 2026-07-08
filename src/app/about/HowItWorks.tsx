'use client';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Using <img> instead of Image from next/image because 
// there are no optimization benefits for animated GIFs,
// it naturally supports dynamic CSS fluid aspect-ratios

export default function HowItWorks() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 xl:gap-8">
      <h2 className="page-heading mt-8 xl:mt-12">How It Works</h2>
      <Swiper modules={[Navigation, Pagination]} slidesPerView={1}
        navigation pagination={{ clickable: true }}>
        <SwiperSlide>
          <img src="/images/how-it-works/01_create-list.gif" alt="GIF of a test user creating a list" />
          <p>Create custom lists</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/how-it-works/02_add-rate-restaurant.gif" alt="GIF of a test user adding/rating a restaurant" />
          <p>Add restaurants to your lists and rate them</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/how-it-works/03_add-rate-dish.gif" alt="GIF of a test user adding/rating a dish" />
          <p>Add dishes you've tried to each restaurant and rate them</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/how-it-works/04_collaborate.png" alt="Screenshot of users collaborating on the list" />
          <p>Collaborate on your lists</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/how-it-works/05_profile.png" alt="Screenshot of a user's profile" />
          <p>View your profile</p>
        </SwiperSlide>
        {/* <SwiperSlide>
          <img src="/images/how-it-works/" alt="" />
          <p>Follow your friends</p>
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
}
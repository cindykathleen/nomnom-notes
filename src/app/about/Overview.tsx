import Image from 'next/image';

export default function Overview() {
  return (
    <div className="flex flex-col items-center gap-8 xl:gap-12">
      <div className="flex flex-col items-center gap-2 xl:gap-4">
        <h2>Discover the Features</h2>
        <p className="description pb-2">Explore the tools that help you organize, remember, and share your favorite dining experiences.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:gap-12">
        <div className="flex items-center">
          <Image src="/images/home-features_720x540.png" alt="A screenshot of NomNom Notes in a monitor" width={720} height={540} 
            className="rounded-2xl" />
        </div>
        <div className="flex flex-col justify-center gap-4 xl:gap-8">
          <ul className="checklist">
            {[
              "Create custom restaurant lists",
              "Keep track of every restaurant you've visited and every dish you've tried",
              "Rate and review your favorites so you'll always remember them",
              "Collaborate on shared lists with friends",
              "See where your friends have been dining",
            ].map((item) => (
              <li key={item}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
                  className="shrink-0 size-7 text-darkpink xl:size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
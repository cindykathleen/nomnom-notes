import Image from 'next/image';

export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center gap-8 xl:gap-12">
      <div className="flex flex-col items-center gap-2 xl:gap-4">
        <h2>See How It Works</h2>
        <p className="description pb-2">Follow the journey from creating your first list to documenting memorable dining experiences.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex-cards">
          <div className="flex-card">
            <Image src="/images/how-it-works/01_list.png" alt="NomNom Notes create a list" width={2560} height={1293} className="rounded-[10px]" />
            <div>
              <h4>Create a Custom List</h4>
              <p className="description-sm">Give your list a name, description, and cover photo. Share it publicly with anyone or keep it private for your own collection.</p>
            </div>
          </div>
          <div className="flex-card">
            <Image src="/images/how-it-works/02_restaurant.png" alt="NomNom Notes add a restaurant" width={2560} height={1292} className="rounded-[10px]" />
            <div>
              <h4>Add Restaurants</h4>
              <p className="description-sm">Search for restaurants with Google Places and organize them into your personalized lists.</p>
            </div>
          </div>
          <div className="flex-card">
            <Image src="/images/how-it-works/03_dish.png" alt="NomNom Notes add a dish" width={2560} height={1293} className="rounded-[10px]" />
            <div>
              <h4>Document Your Experience</h4>
              <p className="description-sm">Record the dishes you've tried with photos, ratings, and reviews so you'll always remember your favorites.</p>
            </div>
          </div>
        </div>
        <div className="flex-cards">
          <div className="flex-card">
            <Image src="/images/how-it-works/04_collaborate.png" alt="NomNom Notes share list" width={2560} height={1292} className="rounded-[10px]" />
            <div>
              <h4>Collaborate with Friends</h4>
              <p className="description-sm">Invite friends to contribute to shared lists and build collections of your favorite restaurants together.</p>
            </div>
          </div>
          <div className="flex-card">
            <Image src="/images/how-it-works/05_profile.png" alt="NomNom Notes profile page" width={2560} height={1293} className="rounded-[10px]" />
            <div>
              <h4>Build Your Food Journal</h4>
              <p className="description-sm">Your profile automatically showcases the restaurants you've visited, dishes you've loved, reviews you've written, and lists you've created.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
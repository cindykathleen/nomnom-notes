export default function HowItWorks() {
  return (
    <div className="h-full flex flex-col justify-center gap-12">
      <h2 className="page-heading text-center">How It Works</h2>
      <div className="grid grid-cols-3 place-content-center gap-8 xl:gap-12">
        <div className="cards-outline"></div>
        <div className="cards-outline"></div>
        <div className="cards-outline"></div>
      </div>
    </div>
  );
}
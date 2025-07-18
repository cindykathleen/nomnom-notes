interface Props {
  rating: number;
}

export const RatingDisplay: React.FC<Props> = ({ rating }) => {
  let wholeStars = Math.floor(rating);
  const stars = [];

  for (let i = 0; i < wholeStars; i++) {
    stars.push(
      <svg key={stars.length} xmlns="http://www.w3.org/2000/svg" fill="var(--color-blue-900)" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-blue-900)" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    );
  }

  if (rating - wholeStars !== 0) {
    stars.push(
      <svg key={stars.length} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
        <path fill="var(--color-blue-900)" d="M12 2.25l-3.09 7.43-7.16.57 5.42 4.65L5.03 22 12 18.27V2.25Z" />
        <path fill="none" stroke="var(--color-blue-900)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    );
  }

  for (let i = 0; i < 5 - wholeStars - (rating - wholeStars !== 0 ? 1 : 0); i++) {
    stars.push(
      <svg key={stars.length} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-blue-900)" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    );
  }

  return (
    <div className="flex">
      {stars}
    </div>
  );
};
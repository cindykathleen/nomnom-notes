import { useState } from 'react';

interface Props {
  currRating: number;
  setNewRating: (newRating: number) => void;
}

export const RatingSystem: React.FC<Props> = ({ currRating, setNewRating }) => {
  const [updatedRating, setUpdatedRating] = useState<number>(currRating);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverHalf, setHoverHalf] = useState<number | null>(null);

  const handleClick = (i: number, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const isHalf = mouseX < width / 2 ? 0 : 1; // Left half = 0, Right half = 1
    const newRating = i + (isHalf ? 1 : 0.5);
    setUpdatedRating(newRating);
    setNewRating(newRating);
  };

  return (
    <div className="flex" onMouseLeave={() => { setHoverIndex(null); setHoverHalf(null); }}>
      {[...Array(5)].map((_, i) => {
        const isHovering = hoverIndex !== null;
        const ratingToShow = isHovering ? hoverIndex + (hoverHalf ? 1 : 0.5) : updatedRating ?? 0;

        const leftHalf = ratingToShow >= i + 0.5;
        const rightHalf = ratingToShow >= i + 1;

        return (
          <div key={i} className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6 cursor-pointer"
            onMouseMove={(e) => {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - left;
              setHoverIndex(i);
              setHoverHalf(mouseX < width / 2 ? 0 : 1); // Left half = 0, Right half = 1
            }}
            onClick={(e) => { handleClick(i, e) }}>
            {/* Left half */}
            <path
              className={`pointer-events-auto transition-all duration-200 ${leftHalf ? "fill-darkpink" : "fill-transparent"}`}
              d="M12 2.25L8.91 9.68l-7.16.57 5.42 4.65L5.03 22 12 18.27V2.25Z"
            />
            {/* Right half */}
            <path
              className={`pointer-events-auto transition-all duration-200 ${rightHalf ? "fill-darkpink" : "fill-transparent"}`}
              d="M12 2.25v16.02L18.97 22l-2.14-7.1 5.42-4.65-7.16-.57L12 2.25Z"
            />
            {/* Outline */}
            <path className="pointer-events-none" fill="none" stroke="var(--color-darkpink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </div>
        );
      })}
    </div>
  );
};
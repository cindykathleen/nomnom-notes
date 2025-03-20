import { Dish } from "../interfaces/interfaces";
import { RatingDisplay } from "./RatingDisplay";
interface Props {
  dish: Dish;
}

export const DishCard: React.FC<Props> = ({ dish }) => {
  return (
    <div className="flex flex-col px-6 py-4 border border-gray-200 rounded-lg">
      {dish.imageUrl !== undefined && (
        <div>
          <img src={dish.imageUrl} alt={dish.name} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">{dish.name}</h3>
        <RatingDisplay rating={dish.rating} />
        <p>{dish.note}</p>
      </div>
    </div>
  );
};
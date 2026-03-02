import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="flex gap-4 rounded-xl border bg-white p-4">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="font-medium text-slate-800">{item.title}</h4>
          <p className="text-sm text-slate-500">${item.price}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
            <button onClick={onDecrease}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center">{item.quantity}</span>
            <button onClick={onIncrease}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Remove */}
          <button onClick={onRemove} className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

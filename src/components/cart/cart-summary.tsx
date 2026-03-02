type Props = {
  subtotal: number;
};

export default function CartSummary({ subtotal }: Props) {
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="sticky top-24 rounded-xl border bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <button className="mt-5 w-full rounded-xl bg-indigo-600 py-2 text-white hover:bg-indigo-700">
        Proceed to Checkout
      </button>
    </div>
  );
}

/**
 * Thin wrapper around the Razorpay Checkout script loaded in index.html.
 * Resolves once Checkout is opened; calls onSuccess with the handler payload.
 */
type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type OpenArgs = {
  key: string;
  orderId: string;
  amount: number;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (resp: RazorpayResponse) => void;
  onDismiss?: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export async function openRazorpay(args: OpenArgs) {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK failed to load. Please refresh and try again.");
  }
  const rzp = new window.Razorpay({
    key: args.key,
    order_id: args.orderId,
    amount: args.amount,
    currency: "INR",
    name: args.name,
    description: args.description,
    prefill: args.prefill,
    theme: { color: "#16183A" },
    handler: (resp: RazorpayResponse) => args.onSuccess(resp),
    modal: { ondismiss: () => args.onDismiss?.() },
  });
  rzp.open();
}

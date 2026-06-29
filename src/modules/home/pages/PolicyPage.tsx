import { useStoreSettings } from "@/modules/settings/hooks/useSettings";

type Block = { heading: string; body: string[] };
type Policy = { title: string; intro: string; blocks: (s: ContactInfo) => Block[] };
type ContactInfo = { name: string; email: string; phone: string; address: string };

/* India-focused storefront policy templates, derived from the live store rules
   (7-day returns, COD, free shipping over ₹4,999, Razorpay). Contact details are
   pulled from store settings. Review with your own counsel before going live. */
const POLICIES: Record<string, Policy> = {
  privacy: {
    title: "Privacy Policy",
    intro: "How we collect, use and protect your personal information.",
    blocks: (s) => [
      {
        heading: "Information We Collect",
        body: [
          "When you shop with us we collect the details you provide — your name, email, phone number, and shipping/billing address — along with order details and, where relevant, account information.",
          "Payment information is handled securely by our payment partner (Razorpay). We do not store your full card or banking details on our servers.",
        ],
      },
      {
        heading: "How We Use Your Information",
        body: [
          "To process and deliver your orders, provide customer support, send order updates, handle returns, and improve our products and website. With your consent, we may send offers and new-arrival updates, which you can opt out of at any time.",
        ],
      },
      {
        heading: "Sharing Your Information",
        body: [
          "We share information only as needed to run the store — for example with delivery partners to ship your order and with Razorpay to process payments. We do not sell your personal data to third parties.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use cookies to keep your cart, remember preferences, and understand how the site is used so we can improve it. You can control cookies through your browser settings.",
        ],
      },
      {
        heading: "Data Security & Your Rights",
        body: [
          "We take reasonable measures to protect your information. You may request access to, correction of, or deletion of your personal data by contacting us.",
          `Questions about your privacy? Email ${s.email} or call ${s.phone}.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "The terms that govern your use of our website and purchases.",
    blocks: (s) => [
      {
        heading: "Acceptance of Terms",
        body: [
          `By using ${s.name} and placing an order, you agree to these Terms & Conditions. Please read them carefully.`,
        ],
      },
      {
        heading: "Products & Pricing",
        body: [
          "All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We try to display product colours and details as accurately as possible; slight variation may occur due to screen settings and the handcrafted nature of the garments.",
          "We reserve the right to correct pricing errors and to update or discontinue products at any time.",
        ],
      },
      {
        heading: "Orders & Payment",
        body: [
          "Placing an order is an offer to buy; order confirmation does not guarantee acceptance, and we may cancel an order due to stock or pricing issues, with a full refund where payment was made.",
          "We accept secure online payments via Razorpay (cards, UPI, net banking) and Cash on Delivery where available.",
        ],
      },
      {
        heading: "Shipping, Returns & Refunds",
        body: [
          "Delivery, returns and refunds are governed by our Shipping Policy and Returns & Refunds Policy, which form part of these terms.",
        ],
      },
      {
        heading: "Intellectual Property & Liability",
        body: [
          "All content on this site — images, text and branding — is owned by us and may not be used without permission.",
          "To the extent permitted by law, our liability for any claim is limited to the value of the order. These terms are governed by the laws of India.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "Easy 7-day returns so you can shop with confidence.",
    blocks: (s) => [
      {
        heading: "7-Day Return Window",
        body: [
          "You can request a return within 7 days of delivery if the item doesn't fit or isn't right for you.",
        ],
      },
      {
        heading: "Return Conditions",
        body: [
          "Items must be unworn, unwashed and undamaged, with all original tags and packaging intact.",
          "For hygiene reasons, customised/altered items and certain innerwear may not be eligible for return.",
        ],
      },
      {
        heading: "How to Return",
        body: [
          `Contact us at ${s.email} or ${s.phone} with your order number. We'll arrange a pickup or share return instructions.`,
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Once we receive and inspect your return, your refund is processed within 5–7 business days to your original payment method. For Cash on Delivery orders, refunds are made via bank transfer or UPI.",
          "Prefer a different size or style? We're happy to arrange an exchange, subject to availability.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Fast, reliable delivery across India.",
    blocks: () => [
      {
        heading: "Delivery Coverage & Charges",
        body: [
          "We deliver pan-India. Shipping is free on orders above ₹4,999; a flat shipping fee of ₹199 applies to orders below that.",
        ],
      },
      {
        heading: "Dispatch & Delivery Time",
        body: [
          "Orders are processed and dispatched within 1–3 business days. Delivery typically takes 3–7 business days depending on your location.",
        ],
      },
      {
        heading: "Cash on Delivery",
        body: [
          "Cash on Delivery (COD) is available on eligible orders across most serviceable pin codes.",
        ],
      },
      {
        heading: "Order Tracking",
        body: [
          "Once your order ships, you can follow its progress any time from the Track Order page using your order number.",
        ],
      },
    ],
  },
};

export function PolicyPage({ which }: { which: keyof typeof POLICIES }) {
  const { data: settings } = useStoreSettings();
  const policy = POLICIES[which];
  const contact: ContactInfo = {
    name: settings?.storeName || "ALQAIRA",
    email: settings?.supportEmail || "support@alqaira.com",
    phone: settings?.supportPhone || "our support line",
    address: settings?.addressLine || "India",
  };
  const blocks = policy.blocks(contact);

  return (
    <div className="aq-page">
      <section className="aq-grain relative overflow-hidden bg-navy py-24 text-center text-white">
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="eyebrow text-gold-light">Policies</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">{policy.title}</h1>
          <div className="mx-auto mt-5 h-px w-14 bg-gold" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70">{policy.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl space-y-10 px-4 py-16 md:px-6">
        {blocks.map((b) => (
          <div key={b.heading}>
            <h2 className="font-display text-2xl text-foreground">{b.heading}</h2>
            <div className="mt-3 aq-rule" />
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {b.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

# Stripe setup — make the pricing page charge money

The pricing page (`pricing.html`) uses **Stripe Payment Links** — hosted,
secure checkout with zero backend. Do this once and subscriptions are live.

## A. Test mode first (toggle top-right of the Stripe dashboard → "Test mode" ON)

1. **Create products** — Stripe → *Product catalog → Add product*. Make three:
   - **Blackbeam OS — Starter**
   - **Blackbeam OS — Crew**
   - **Blackbeam OS — Pro**

2. **Add two prices to each** (Add another price):
   | Product | Monthly | Annual |
   |---------|---------|--------|
   | Starter | $99 / mo recurring | $990 / yr recurring |
   | Crew    | $249 / mo recurring | $2,490 / yr recurring |
   | Pro     | $499 / mo recurring | $4,990 / yr recurring |
   Set each to **Recurring**. (Adjust the numbers to whatever we land on.)

3. **Add a free trial** (optional but recommended): on each price, set a
   14-day trial under *Advanced → Free trial*.

4. **Create a Payment Link per price** — Stripe → *Payment links → New*:
   pick the product + price → **Create**. You'll get 6 links total, e.g.
   `https://buy.stripe.com/test_abc123`.

## B. Paste the 6 links into `pricing.html`
Find the three `.plan-cta` buttons and replace the placeholders:
```html
data-link-monthly="https://buy.stripe.com/test_STARTER_MONTHLY"
data-link-annual="https://buy.stripe.com/test_STARTER_ANNUAL"
```
…and the same for Crew and Pro. (Send them to me and I'll wire + push them.)

## C. Test the whole flow
- Click a plan → you land on Stripe checkout.
- Use test card `4242 4242 4242 4242`, any future date, any CVC/ZIP.
- Confirm the subscription appears in Stripe → *Customers*.

## D. Go live
- Flip **Test mode OFF**, recreate the products/prices/links in live mode
  (or use the "copy to live" option), and swap the 6 URLs for the live ones.
- Before real charges you'll need to **activate your account**: business
  details + a bank account for payouts (Stripe → *Activate payments*).

## Later: subscription management + gating
Payment Links get you *paid*. To then **gate the OS by plan** (only paid orgs
get in, upgrades/downgrades, cancellations), add:
- a **Stripe webhook** → n8n/Supabase to set `orgs.plan` on `checkout.session.completed`,
- the **Stripe Customer Portal** for self-serve plan changes.
That's a Phase-2 item once the first customers are flowing.

> I can't create your Stripe account or handle card/bank details — that part is
> yours. Everything on the site side is built and waiting for the 6 links.

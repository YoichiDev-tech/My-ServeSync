# ServeSync billing setup

## Multi-currency Checkout (Issue #7)

Checkout supports USD, EUR, and GBP through Stripe Price IDs. Create recurring monthly prices in Stripe for each plan/currency combination, then configure these server-side environment variables in Vercel:

- USD (existing): STRIPE_PRICE_ID_COUNTER and STRIPE_PRICE_ID_KITCHEN
- EUR: STRIPE_PRICE_ID_COUNTER_EUR and STRIPE_PRICE_ID_KITCHEN_EUR
- GBP: STRIPE_PRICE_ID_COUNTER_GBP and STRIPE_PRICE_ID_KITCHEN_GBP

The checkout API intentionally fails with a clear configuration response when a selected currency's price is not configured. It never silently charges a different currency. The frontend displays the final recurring amount from Stripe Checkout for EUR/GBP because the amount is defined by the actual Stripe Price, not by a hard-coded currency conversion.

Before enabling a currency in production, verify that the configured price is recurring, uses the expected amount and currency, and belongs to the correct Stripe product. Test each plan/currency pair in Stripe test mode first.

## Group-tier custom pricing (Issue #8)

Group pricing is intentionally negotiated per customer rather than assigned a public fixed amount.

1. In Stripe Dashboard, create a Payment Link for the agreed recurring custom price.
2. Set the post-payment redirect to: /register?plan=group&session_id={CHECKOUT_SESSION_ID}
3. Add metadata: plan = group.
4. Send the unique link to the customer.
5. After the customer completes checkout and their account is activated, deactivate the Payment Link if it was intended for one customer only.
6. Do not reuse one customer's custom link for another customer unless the terms and amount are identical.

The /trial page's "Contact Us for Group Pricing" link opens an email draft with the information needed to start the conversation. The manual Stripe process is deliberately documented rather than represented as automated in-app Group checkout.

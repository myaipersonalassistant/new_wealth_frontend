import { createCheckoutSession } from '../server/services/stripeService.js';

/**
 * Create Stripe checkout session
 * POST /api/create-checkout-session
 */
export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      productType,
      quantity = 1,
      amount,
      currency = 'gbp',
      customerData,
      metadata = {},
      successUrl,
      cancelUrl,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0',
      });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'successUrl and cancelUrl are required',
      });
    }

    // Create line items for checkout session
    const lineItems = [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: productType === 'book' 
              ? 'Build Wealth Through Property - Book' 
              : 'Product',
            description: productType === 'book'
              ? 'Physical book with UK shipping. All proceeds go to charity.'
              : 'Product purchase',
            images: productType === 'book'
              ? ['https://d64gsuwffb70l.cloudfront.net/6973e5e8bbb2ae01621a037e_1770743948016_23a5e51b.png']
              : [],
          },
          unit_amount: Math.round((amount / quantity) * 100), // Convert to pence per unit
        },
        quantity: quantity,
      },
    ];

    // Add shipping address collection if customer data includes shipping
    const sessionMetadata = {
      ...metadata,
      productType: productType || 'book',
    };

    const session = await createCheckoutSession({
      lineItems,
      successUrl,
      cancelUrl,
      metadata: sessionMetadata,
      customerEmail: customerData?.email,
      shippingAddressCollection: customerData?.shipping
        ? {
            allowed_countries: ['GB'],
          }
        : undefined,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
}


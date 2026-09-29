import { ProductReview } from '../types/ecommerce';

export const INITIAL_REVIEWS: Record<string, ProductReview[]> = {
  'prod-01': [
    {
      id: 'rev-01-1',
      productId: 'prod-01',
      author: 'Vikramaditya S.',
      city: 'Bengaluru, KA',
      rating: 5,
      date: '2 days ago',
      title: 'Masterpiece craftsmanship & astonishing build',
      comment:
        'The titanium weight is perfectly balanced. Sapphire glass has zero reflection under harsh sunlight and the automatic movement keeps time to the exact second. Packaging and warranty card were top-notch.',
      verifiedPurchase: true,
      helpfulCount: 24,
      recommended: true,
      tag: 'Verified Luxury Buyer',
    },
    {
      id: 'rev-01-2',
      productId: 'prod-01',
      author: 'Rohit Kulkarni',
      city: 'Mumbai, MH',
      rating: 5,
      date: '1 week ago',
      title: 'Looks even more stunning in person than pictures',
      comment:
        'Fast 24-hour Blue Dart delivery. Wore this to a board meeting and received multiple compliments on the dial finish. Worth every single rupee.',
      verifiedPurchase: true,
      helpfulCount: 17,
      recommended: true,
      tag: 'Verified Purchaser',
    },
    {
      id: 'rev-01-3',
      productId: 'prod-01',
      author: 'Ananya Sharma',
      city: 'New Delhi, DL',
      rating: 4,
      date: '2 weeks ago',
      title: 'Exceptional quality, bracelet adjustment needed',
      comment:
        'The watch itself is a 10/10. I had to remove two links for my wrist size which was easy with the included pin tool. Highly recommend Vanguard timepieces.',
      verifiedPurchase: true,
      helpfulCount: 9,
      recommended: true,
      tag: 'Verified Purchaser',
    },
  ],
  'prod-02': [
    {
      id: 'rev-02-1',
      productId: 'prod-02',
      author: 'Arjun Mehta',
      city: 'Hyderabad, TS',
      rating: 5,
      date: '3 days ago',
      title: 'ANC beats headphones costing double the price!',
      comment:
        'Flight noise and traffic are completely silenced. The 3D Spatial audio on Apple Music Lossless and Spotify is phenomenal. 45 hours battery life is genuine - haven’t charged in 4 days.',
      verifiedPurchase: true,
      helpfulCount: 38,
      recommended: true,
      tag: 'Verified Audiophile',
    },
    {
      id: 'rev-02-2',
      productId: 'prod-02',
      author: 'Pooja Iyer',
      city: 'Chennai, TN',
      rating: 5,
      date: '6 days ago',
      title: 'Super soft ear cushions and crystal clear mic',
      comment:
        'Use these for 8-hour work calls and evening gaming sessions. Zero ear fatigue or headband pressure. Seamless dual-device Bluetooth pairing with MacBook and iPhone.',
      verifiedPurchase: true,
      helpfulCount: 21,
      recommended: true,
      tag: 'Verified Purchaser',
    },
  ],
  'prod-03': [
    {
      id: 'rev-03-1',
      productId: 'prod-03',
      author: 'Karan Singhal',
      city: 'Gurugram, HR',
      rating: 5,
      date: '4 days ago',
      title: 'Pure Mongolian Cashmere luxury feel',
      comment:
        'The drape and hand-feel are incredible. Breathable yet warm enough for light winters and air-conditioned lounges. Fits true to size with a modern silhouette.',
      verifiedPurchase: true,
      helpfulCount: 14,
      recommended: true,
      tag: 'Verified Purchaser',
    },
  ],
};

// Generic fallback reviews generator for any product
export function generateDefaultReviews(productId: string, productName: string, productCategory: string): ProductReview[] {
  if (INITIAL_REVIEWS[productId]) {
    return INITIAL_REVIEWS[productId];
  }

  return [
    {
      id: `rev-${productId}-1`,
      productId,
      author: 'Rishi Varma',
      city: 'Bengaluru, KA',
      rating: 5,
      date: 'Just recently',
      title: `Superb quality ${productCategory.toLowerCase()} item!`,
      comment: `The ${productName} completely surpassed my expectations. Build quality, finish, and materials are genuine premium grade. Arrived in sealed original tamper-proof box with invoice.`,
      verifiedPurchase: true,
      helpfulCount: 15,
      recommended: true,
      tag: 'Verified Purchaser',
    },
    {
      id: `rev-${productId}-2`,
      productId,
      author: 'Neha Deshmukh',
      city: 'Pune, MH',
      rating: 5,
      date: '5 days ago',
      title: 'Worth the price, seamless delivery',
      comment: `Delivered within 48 hours across India. The attention to detail is evident right from the packaging. Would definitely order again from Brand Bazaar!`,
      verifiedPurchase: true,
      helpfulCount: 11,
      recommended: true,
      tag: 'Verified Purchaser',
    },
    {
      id: `rev-${productId}-3`,
      productId,
      author: 'Aditya Sen',
      city: 'Kolkata, WB',
      rating: 4,
      date: '1 week ago',
      title: 'Very satisfying purchase',
      comment: `Great value and pristine finish. Exactly as pictured in the catalog description. Highly recommended.`,
      verifiedPurchase: true,
      helpfulCount: 7,
      recommended: true,
      tag: 'Verified Purchaser',
    },
  ];
}

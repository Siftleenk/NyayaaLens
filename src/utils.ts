import type { Case, RightsCard, DarkPatternResult } from './types';

// ─── localStorage helpers ───────────────────────────────────────────────────

const CASES_KEY = 'nyaya_lens_cases';

export function loadCases(): Case[] {
  try {
    const raw = localStorage.getItem(CASES_KEY);
    return raw ? JSON.parse(raw) : getDefaultCases();
  } catch {
    return getDefaultCases();
  }
}

export function saveCases(cases: Case[]): void {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

export function generateId(): string {
  return `case_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Default demo cases ──────────────────────────────────────────────────────

function getDefaultCases(): Case[] {
  return [
    {
      id: 'case_demo_1',
      title: 'Defective Smartphone — Flipkart',
      company: 'Flipkart',
      product: 'OnePlus 12R',
      amount: 35999,
      purchaseDate: '2024-09-15',
      category: 'defective-product',
      description: 'Phone screen developed dead pixels within 2 weeks of purchase. Company refused to replace under warranty.',
      desiredResolution: 'Full replacement or complete refund',
      status: 'in-progress',
      complaint: '',
      createdAt: '2024-09-28T10:30:00Z',
      updatedAt: '2024-10-05T14:22:00Z',
      notes: 'Sent email to support. Awaiting escalation response.',
    },
    {
      id: 'case_demo_2',
      title: 'Hidden Subscription Charges — Swiggy One',
      company: 'Swiggy',
      product: 'Swiggy One Membership',
      amount: 1199,
      purchaseDate: '2024-10-01',
      category: 'hidden-charges',
      description: 'Was charged for annual membership renewal without explicit consent. Auto-renewal was hidden in fine print.',
      desiredResolution: 'Full refund of renewal charge',
      status: 'open',
      complaint: '',
      createdAt: '2024-10-10T09:00:00Z',
      updatedAt: '2024-10-10T09:00:00Z',
      notes: '',
    },
    {
      id: 'case_demo_3',
      title: 'Misleading Product Description — Amazon',
      company: 'Amazon India',
      product: 'Memory Foam Mattress',
      amount: 12499,
      purchaseDate: '2024-08-20',
      category: 'misleading-ad',
      description: 'Product listed as "100% memory foam" but delivered item contained only 2-inch memory foam layer over spring base.',
      desiredResolution: 'Full refund with free return pickup',
      status: 'resolved',
      complaint: '',
      createdAt: '2024-08-25T11:15:00Z',
      updatedAt: '2024-09-12T16:40:00Z',
      notes: 'Resolved after National Consumer Helpline complaint. Full refund received.',
    },
  ];
}

// ─── Complaint Generator ─────────────────────────────────────────────────────

export function generateComplaintText(params: {
  company: string;
  product: string;
  amount: number;
  purchaseDate: string;
  category: string;
  description: string;
  desiredResolution: string;
}): string {
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const purchaseDateFormatted = new Date(params.purchaseDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const categoryMap: Record<string, string> = {
    'defective-product': 'Defective Product / Manufacturing Defect',
    'refund-dispute': 'Refund Not Received / Wrongful Deduction',
    'misleading-ad': 'Misleading Advertisement / False Representation',
    'hidden-charges': 'Hidden Charges / Unauthorized Deduction',
    'warranty-dispute': 'Warranty Claim Denial',
    'ecommerce': 'E-Commerce Related Grievance',
    'service-failure': 'Deficiency in Service',
    'other': 'Consumer Grievance',
  };

  const subject = categoryMap[params.category] || 'Consumer Grievance';

  return `Date: ${date}

To,
The Grievance Officer,
${params.company}
[Company Address]

Subject: Formal Consumer Complaint — ${subject} — ${params.product}

Respected Sir/Madam,

I, the undersigned, am writing this formal complaint letter to bring to your attention a serious consumer grievance in accordance with the Consumer Protection Act, 2019, and the Consumer Protection (E-Commerce) Rules, 2020.

DETAILS OF PURCHASE:
• Product/Service: ${params.product}
• Company/Seller: ${params.company}
• Date of Purchase: ${purchaseDateFormatted}
• Amount Paid: ₹${params.amount.toLocaleString('en-IN')}
• Nature of Complaint: ${subject}

DESCRIPTION OF GRIEVANCE:
${params.description}

Under Section 2(7) of the Consumer Protection Act, 2019, I am a "consumer" as I have purchased the above product/service for personal use. The actions of your company constitute a deficiency in service and/or an unfair trade practice as defined under Section 2(11) and Section 2(47) of the Act.

RELIEF SOUGHT:
${params.desiredResolution}

I request you to resolve this matter within 15 days of receiving this complaint. Failure to do so will compel me to escalate this matter to:
1. The National Consumer Helpline (NCH) — 1800-11-4000
2. The District Consumer Disputes Redressal Commission
3. The National Consumer Disputes Redressal Commission (NCDRC)

I expect a written acknowledgment of this complaint within 48 hours.

Yours sincerely,
[Your Full Name]
[Your Address]
[Your Phone Number]
[Your Email Address]

Enclosures:
1. Copy of purchase invoice/receipt
2. Photographs/screenshots of the defect (if applicable)
3. Previous correspondence with the company (if any)
4. Any other relevant documents`;
}

// ─── Dark Pattern Detector ───────────────────────────────────────────────────

export function analyzeDarkPatterns(text: string, selectedBehaviours: string[]): DarkPatternResult[] {
  const lowerText = text.toLowerCase();

  const patterns: DarkPatternResult[] = [
    {
      pattern: 'Drip Pricing',
      description: 'Additional charges revealed only at the final checkout step, inflating the total price beyond what was initially advertised.',
      risk: 'high',
      recommendation: 'Document the original price shown. Under Consumer Protection Act 2019, advertised price must be the final price. File a complaint citing "unfair trade practice" (Section 2(47)).',
      detected: lowerText.includes('convenience fee') || lowerText.includes('processing fee') || lowerText.includes('platform fee') || lowerText.includes('handling charges') || selectedBehaviours.includes('drip-pricing'),
    },
    {
      pattern: 'Fake Urgency / Scarcity',
      description: 'Countdown timers, "only X left" alerts, or "limited offer" tags designed to pressure immediate purchases without genuine scarcity.',
      risk: 'medium',
      recommendation: 'Ignore artificial urgency. Compare prices across platforms. Report to ASCI (Advertising Standards Council of India) if claim is demonstrably false.',
      detected: lowerText.includes('only') && (lowerText.includes('left') || lowerText.includes('remaining')) || lowerText.includes('limited time') || lowerText.includes('expires in') || lowerText.includes('hurry') || selectedBehaviours.includes('fake-urgency'),
    },
    {
      pattern: 'Forced Action / Roach Motel',
      description: 'Easy to sign up but deliberately difficult to cancel, unsubscribe, or get a refund. Navigation is intentionally confusing.',
      risk: 'high',
      recommendation: 'Document every step of the cancellation attempt. Under the Consumer Protection Act, a service that is deliberately difficult to cancel is an unfair trade practice.',
      detected: lowerText.includes('cancel anytime') || lowerText.includes('no cancellation') || lowerText.includes('non-refundable') || selectedBehaviours.includes('forced-action'),
    },
    {
      pattern: 'Sneaking / Pre-ticked Extras',
      description: 'Items added to cart without explicit consent, pre-ticked checkboxes for insurance, donations, or add-ons.',
      risk: 'high',
      recommendation: 'Always review your cart before payment. Any pre-ticked item added without consent violates Consumer Protection (E-Commerce) Rules, 2020, Rule 6(5).',
      detected: lowerText.includes('added to cart') || lowerText.includes('recommended') || lowerText.includes('auto-added') || selectedBehaviours.includes('sneaking'),
    },
    {
      pattern: 'Disguised Advertisements',
      description: 'Paid promotions presented as organic search results, editorial content, or user reviews without clear disclosure.',
      risk: 'medium',
      recommendation: 'Under ASCI guidelines, all sponsored content must be clearly labelled. Report undisclosed ads to ASCI at ascionline.in.',
      detected: lowerText.includes('sponsored') || lowerText.includes('promoted') || lowerText.includes('ad') || selectedBehaviours.includes('disguised-ads'),
    },
    {
      pattern: 'Difficult Cancellation',
      description: 'Subscription or service cancellation requires excessive steps, phone calls, or is hidden behind multiple menus.',
      risk: 'high',
      recommendation: 'Under the Consumer Protection (E-Commerce) Rules, 2020, cancellation must be as easy as subscription. Document the process and file with National Consumer Helpline.',
      detected: lowerText.includes('call to cancel') || lowerText.includes('contact support to cancel') || selectedBehaviours.includes('difficult-cancellation'),
    },
  ];

  return patterns.filter(p => p.detected || selectedBehaviours.includes(p.pattern.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-')));
}

// ─── Consumer Rights Data ────────────────────────────────────────────────────

export const rightsData: RightsCard[] = [
  {
    id: 'defective-products',
    title: 'Defective Products',
    category: 'Product Rights',
    icon: '🛡️',
    summary: 'You have the right to receive products free from manufacturing defects.',
    explanation: 'Under the Consumer Protection Act, 2019, if a product has a manufacturing defect, you are entitled to a replacement, repair, or full refund. The seller/manufacturer cannot evade liability by blaming misuse unless they can prove it. The burden of proof shifts to the manufacturer if the defect is apparent within the warranty period.',
    nextSteps: [
      'Document the defect with photos and videos immediately',
      'Write a formal complaint to the company within 30 days of discovering the defect',
      'Escalate to the National Consumer Helpline (1800-11-4000) if unresolved within 15 days',
      'File a case with the District Consumer Commission for defects under ₹1 crore',
    ],
    evidenceChecklist: [
      'Original purchase invoice/receipt',
      'Photos and videos of the defect',
      'Product packaging (do not discard)',
      'Warranty card (if provided)',
      'All written communications with the company',
      'Report from an authorized service centre (if available)',
    ],
    officialSource: 'Consumer Protection Act, 2019 — Section 2(10)',
    sourceUrl: 'https://consumeraffairs.nic.in/consumer-protection-act-2019',
    relevantLaw: 'Consumer Protection Act, 2019',
  },
  {
    id: 'refund-disputes',
    title: 'Refund Disputes',
    category: 'Financial Rights',
    icon: '💰',
    summary: 'You have the right to receive timely refunds for cancelled orders or returned products.',
    explanation: 'Under the Consumer Protection (E-Commerce) Rules, 2020, e-commerce entities must process refunds within 7 working days of receiving the returned product or accepting the cancellation. Arbitrary deductions from refunds without clear prior disclosure are illegal and constitute unfair trade practice.',
    nextSteps: [
      'Cancel the order/return the product through official channels',
      'Note the expected refund date communicated by the company',
      'If refund is delayed, send a written reminder with a 7-day deadline',
      'File a complaint with the e-commerce platform\'s grievance officer',
      'Escalate to NCH or your bank for a chargeback if still unresolved',
    ],
    evidenceChecklist: [
      'Cancellation/return confirmation email or SMS',
      'Courier receipt (proof of return delivery)',
      'Bank/UPI/card statements showing payment',
      'Screenshots of all chat/email with company',
      'Order ID and payment transaction ID',
    ],
    officialSource: 'Consumer Protection (E-Commerce) Rules, 2020 — Rule 6',
    sourceUrl: 'https://consumeraffairs.nic.in',
    relevantLaw: 'Consumer Protection (E-Commerce) Rules, 2020',
  },
  {
    id: 'ecommerce-problems',
    title: 'E-Commerce Problems',
    category: 'Digital Rights',
    icon: '🛒',
    summary: 'E-commerce platforms have strict legal obligations to protect your interests.',
    explanation: 'The Consumer Protection (E-Commerce) Rules, 2020 mandates that every e-commerce entity must appoint a grievance officer, display their contact information, and resolve complaints within 48 hours of receipt and redress within 1 month. Marketplace platforms are also liable for seller conduct in certain circumstances.',
    nextSteps: [
      'Contact the platform\'s Grievance Officer (contact info must be on the website)',
      'File a complaint on the platform within the defined window',
      'If unresolved in 1 month, escalate to NCH at consumerhelpline.gov.in',
      'File a case with the appropriate Consumer Commission',
    ],
    evidenceChecklist: [
      'Order confirmation and invoice',
      'Product listing screenshots (with seller name)',
      'Delivery receipt or non-delivery proof',
      'Photos of received items (if different from listing)',
      'All communications with seller and platform',
    ],
    officialSource: 'Consumer Protection (E-Commerce) Rules, 2020',
    sourceUrl: 'https://consumeraffairs.nic.in',
    relevantLaw: 'Consumer Protection (E-Commerce) Rules, 2020',
  },
  {
    id: 'misleading-ads',
    title: 'Misleading Advertisements',
    category: 'Advertising Rights',
    icon: '📢',
    summary: 'Advertisements must be truthful. You are protected from false and misleading claims.',
    explanation: 'Under the Consumer Protection Act, 2019, a "misleading advertisement" is explicitly illegal. This includes false claims about a product, exaggerated benefits, hiding material facts, and endorsements without genuine usage. The Central Consumer Protection Authority (CCPA) can impose penalties on manufacturers and advertisers for misleading ads.',
    nextSteps: [
      'Screenshot the misleading advertisement with the date and source',
      'Compare advertised claims with the actual product received',
      'File a complaint with CCPA at ccpa-india.nic.in',
      'Report to ASCI (Advertising Standards Council of India) at ascionline.in',
      'Include the complaint in your formal case to the Consumer Commission',
    ],
    evidenceChecklist: [
      'Screenshot/recording of the advertisement (with date)',
      'Original product received (photographs)',
      'Product specifications from the ad vs. actual',
      'Expert opinion (if available)',
      'Purchase invoice',
    ],
    officialSource: 'Consumer Protection Act, 2019 — Section 2(28) & Section 21',
    sourceUrl: 'https://ccpa-india.nic.in',
    relevantLaw: 'Consumer Protection Act, 2019',
  },
  {
    id: 'hidden-charges',
    title: 'Hidden Charges',
    category: 'Financial Rights',
    icon: '💳',
    summary: 'You cannot be charged more than the published price. Hidden fees are illegal.',
    explanation: 'Any charge not disclosed at the point of purchase is an unfair trade practice under the Consumer Protection Act, 2019. This includes convenience fees disclosed only at checkout, unexpected delivery charges, and auto-renewal charges. The maximum retail price (MRP) is the maximum you can be legally charged for a product.',
    nextSteps: [
      'Document the original price displayed vs. final amount charged',
      'Request a full itemized receipt from the company',
      'Demand an explanation for each additional charge in writing',
      'If unauthorized charges are found, request a refund immediately',
      'File with NCH if refund is denied',
    ],
    evidenceChecklist: [
      'Screenshots of original pricing displayed',
      'Final invoice showing all charges',
      'Bank statement showing the actual deduction',
      'Communications requesting explanation of charges',
    ],
    officialSource: 'Consumer Protection Act, 2019 — Section 2(47)',
    sourceUrl: 'https://consumeraffairs.nic.in',
    relevantLaw: 'Consumer Protection Act, 2019',
  },
  {
    id: 'warranty-disputes',
    title: 'Warranty Disputes',
    category: 'Product Rights',
    icon: '📋',
    summary: 'Warranty terms must be honored. You cannot be denied valid warranty service.',
    explanation: 'A warranty is a legally binding contract. If a company refuses valid warranty claims, conditions warranty on unauthorized repairs, or provides inadequate service under warranty, this constitutes deficiency in service. Under the Consumer Protection Act, you can claim compensation for mental agony and harassment in addition to the repair/replacement.',
    nextSteps: [
      'Send a formal written request for warranty service',
      'Give the company a 15-day deadline for resolution',
      'If denied, escalate to the brand\'s national customer care head',
      'File with Consumer Commission if warranty is still denied',
    ],
    evidenceChecklist: [
      'Original purchase invoice with purchase date',
      'Warranty card with terms and conditions',
      'Service request number or job card from service centre',
      'Written denial of warranty claim',
      'Photos of the defect',
    ],
    officialSource: 'Consumer Protection Act, 2019 — Section 2(34)',
    sourceUrl: 'https://consumeraffairs.nic.in',
    relevantLaw: 'Consumer Protection Act, 2019',
  },
];

// ─── Format helpers ──────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    'open': 'bg-blue-50 text-blue-700 border border-blue-200',
    'in-progress': 'bg-amber-50 text-amber-700 border border-amber-200',
    'resolved': 'bg-green-50 text-green-700 border border-green-200',
    'closed': 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return map[status] || map['open'];
}

export function riskColor(risk: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    'high': { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-500/30' },
    'medium': { bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-500/30' },
    'low': { bg: 'bg-green-950/30', text: 'text-green-400', border: 'border-green-500/30' },
  };
  return map[risk] || map['low'];
}

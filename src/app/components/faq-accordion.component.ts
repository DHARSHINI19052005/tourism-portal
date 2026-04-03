import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-accordion.component.html',
  styleUrl: './faq-accordion.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'visible',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class FAQAccordionComponent implements OnInit {
  faqs: FAQItem[] = [];

  ngOnInit(): void {
    this.initializeFAQs();
  }

  private initializeFAQs(): void {
    this.faqs = [
      {
        id: 1,
        question: 'How do I book a flight on the platform?',
        answer: 'To book a flight, visit our homepage, enter your departure and arrival cities, select your travel dates, and choose from available flights. You can filter by price, duration, or airline, then proceed to checkout with your payment details.',
        isOpen: false
      },
      {
        id: 2,
        question: 'What is your cancellation policy?',
        answer: 'Our cancellation policy varies by booking type:\n• Free cancellation if cancelled 7+ days before travel\n• 50% refund if cancelled 3-6 days before travel\n• 25% refund if cancelled within 3 days\n• Non-refundable bookings have no cancellation option\n\nRefunds are processed within 7-10 business days.',
        isOpen: false
      },
      {
        id: 3,
        question: 'How long does it take to process a refund?',
        answer: 'Refunds are typically processed within 7-10 business days after approval. The time depends on your bank and payment method. You can track your refund status in the "My Bookings" section using your booking ID.',
        isOpen: false
      },
      {
        id: 4,
        question: 'Can I modify my travel dates after booking?',
        answer: 'Yes, you can modify dates for most bookings. Simply go to "My Bookings," select the booking you want to modify, and change your dates. You may need to pay the fare difference or receive a refund. Modifications are free for flexible bookings.',
        isOpen: false
      },
      {
        id: 5,
        question: 'What is included in the baggage allowance?',
        answer: 'Standard baggage allowance depends on your airline:\n• Economy: Usually 20-23kg check-in baggage + 7kg carry-on\n• Business/Premium: Up to 30-40kg check-in baggage\n\nYou can add extra baggage during booking. Excess baggage charges apply at check-in if limits are exceeded.',
        isOpen: false
      },
      {
        id: 6,
        question: 'Do you offer travel insurance?',
        answer: 'Yes! We offer comprehensive travel insurance covering:\n• Trip cancellation\n• Medical emergencies abroad\n• Lost luggage\n• Flight delays\n• Emergency evacuation\n\nInsurance can be added at checkout for your desired coverage level.',
        isOpen: false
      },
      {
        id: 7,
        question: 'What payment methods do you accept?',
        answer: 'We accept multiple payment methods:\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• Digital Wallets (Google Pay, Apple Pay, Amazon Pay)\n• Net Banking (all major Indian banks)\n• UPI\n• Buy Now, Pay Later (EMI options available)',
        isOpen: false
      },
      {
        id: 8,
        question: 'How do I apply for a visa?',
        answer: 'We offer visa assistance for multiple countries:\n1. Select your destination\n2. Check visa requirements for your nationality\n3. Upload required documents\n4. We process your application\n5. Receive your visa approval\n\nProcessing time varies by country (typically 5-20 business days).',
        isOpen: false
      },
      {
        id: 9,
        question: 'What are your best travel deals?',
        answer: 'Current offers include:\n• 20% off domestic flights on select dates\n• 30% off 4+ star hotels for stays over 3 nights\n• Free travel insurance with bookings over ₹50,000\n• Exclusive member discounts (up to 25%)\n• Seasonal packages and flash sales\n\nSubscribe to our newsletter for exclusive offers!',
        isOpen: false
      },
      {
        id: 10,
        question: 'Do you offer group bookings and discounts?',
        answer: 'Yes! We offer special group rates for:\n• Corporate travel: 10% discount for 10+ travelers\n• Family packages: 15% discount for family groups\n• University tours: 20% discount for student groups\n• Wedding travel: Customized packages with dedicated support\n\nContact our group travel team for personalized quotes.',
        isOpen: false
      },
      {
        id: 11,
        question: 'How can I contact customer support?',
        answer: 'You can reach our support team:\n• 24/7 AI Chatbot: Available in the chat window\n• Phone: +91-XXXX-XXXX-XX (toll-free)\n• Email: support@tourismdeveloper.com\n• Live Chat: Available during business hours\n• Social Media: @TourismlDeveloper on Instagram & Twitter\n\nWe aim to respond within 24 hours.',
        isOpen: false
      },
      {
        id: 12,
        question: 'Is the platform secure for booking?',
        answer: 'Yes, our platform is highly secure:\n• SSL encryption for all transactions\n• PCI-DSS compliance for payment processing\n• Your data is never shared with third parties\n• Secure login with two-factor authentication available\n• Regular security audits and updates\n\nBook with confidence knowing your information is protected!',
        isOpen: false
      }
    ];
  }

  toggleFAQ(faq: FAQItem): void {
    faq.isOpen = !faq.isOpen;
  }

  getToggleState(isOpen: boolean): string {
    return isOpen ? 'expanded' : 'collapsed';
  }

  padNumber(num: number): string {
    return String(num).padStart(2, '0');
  }
}

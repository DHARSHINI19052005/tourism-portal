import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from '../components/chatbot.component';
import { ContactFormComponent } from '../components/contact-form.component';
import { ChatbotService } from '../services/chatbot.service';

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  details: string[];
  actionText: string;
  actionFn?: () => void;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ChatbotComponent, ContactFormComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  contactOptions: ContactOption[] = [];
  faqs = [
    {
      id: 'track',
      question: 'How can I track my booking?',
      answer: 'You can track your booking using your Booking ID in the "Track Booking" section or use our AI assistant for instant updates.'
    },
    {
      id: 'refund',
      question: 'What is your refund policy?',
      answer: 'We offer full refunds up to 7 days before travel. After that, a cancellation fee applies. Contact our team for exceptions.'
    },
    {
      id: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, digital wallets, and net banking options for your convenience.'
    },
    {
      id: 'visa',
      question: 'Do you assist with visa requirements?',
      answer: 'Yes! Our travel experts provide comprehensive visa guidance for over 150 countries. Use "Ask Travel Assistant" for visa info.'
    },
    {
      id: 'support',
      question: 'Is customer support available 24/7?',
      answer: 'Absolutely! Our support team and AI assistant are available round the clock to help with any travel concerns.'
    }
  ];

  expandedFaq: string | null = null;
  revealedOptionId: string | null = null;
  mailMessageVisible = false;
  phoneMessageVisible = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.initializeContactOptions();
  }

  private initializeContactOptions(): void {
    this.contactOptions = [
      {
        id: 'email',
        title: 'Email Support',
        subtitle: '24-Hour Response',
        icon: '✉️',
        details: ['support@travelportal.com', '24-hour guaranteed response', 'Detailed assistance provided'],
        actionText: 'Send Email'
      },
      {
        id: 'phone',
        title: '24/7 Priority Support',
        subtitle: 'Speak to Expert',
        icon: '📞',
        details: ['Dedicated travel expert', 'Multi-language support', 'Instant problem resolution'],
        actionText: 'Call Now'
      },
      {
        id: 'chat',
        title: 'Live Chat Support',
        subtitle: 'Instant Assistance',
        icon: '💬',
        details: ['AI + Human fallback', 'Real-time responses', 'Smart travel recommendations'],
        actionText: 'Open Chat'
      }
    ];
  }

  sendEmailSupport(): void {
    // Open mail client as a fallback if user wants to directly send
    window.location.href = 'mailto:support@travelportal.com?subject=Travel Support Request';
  }

  callSupport(): void {
    window.location.href = 'tel:+918800XXX000';
  }

  openChat(): void {
    // Use ChatbotService to open the chat window programmatically
    this.chatbotService.openChatWindow();
  }

  revealOption(id: string): void {
    if (this.revealedOptionId === id) {
      this.revealedOptionId = null;
      this.mailMessageVisible = false;
      this.phoneMessageVisible = false;
    } else {
      this.revealedOptionId = id;
      this.mailMessageVisible = false;
      this.phoneMessageVisible = false;
    }
  }

  onEmailClick(email: string): void {
    this.mailMessageVisible = true;
  }

  onPhoneClick(phone: string): void {
    this.phoneMessageVisible = true;
  }

  toggleFaq(id: string): void {
    this.expandedFaq = this.expandedFaq === id ? null : id;
  }

  isFaqExpanded(id: string): boolean {
    return this.expandedFaq === id;
  }

  handleContactAction(option: ContactOption): void {
    if (option.id === 'email') {
      this.sendEmailSupport();
    } else if (option.id === 'phone') {
      this.callSupport();
    } else if (option.id === 'chat') {
      this.openChat();
    }
  }
}


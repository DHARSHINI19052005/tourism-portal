import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export interface QuickSuggestion {
  id: string;
  text: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  private messageIdCounter = 0;

  quickSuggestions: QuickSuggestion[] = [
    { id: 'flights', text: 'Flight Bookings', icon: '✈️' },
    { id: 'hotels', text: 'Hotels', icon: '🏨' },
    { id: 'refund', text: 'Refund Policy', icon: '💰' },
    { id: 'visa', text: 'Visa Info', icon: '📋' },
    { id: 'offers', text: 'Offers', icon: '🎁' }
  ];

  private travelTopics = [
    'flight', 'hotel', 'booking', 'reservation', 'bus', 'train', 'holiday', 'package',
    'visa', 'insurance', 'refund', 'cancellation', 'modification', 'date', 'baggage',
    'check-in', 'payment', 'offer', 'discount', 'guideline', 'restriction', 'destination',
    'weather', 'attraction', 'accommodation', 'itinerary', 'passport', 'travel', 'trip',
    'journey', 'tour', 'adventure', 'getaway', 'vacation', 'holiday' ,'resort', 'lodge',
    'airfare', 'ticket', 'booking confirmation', 'card', 'wallet', 'refund status'
  ];

  private botResponses: { [key: string]: string[] } = {
    flights: [
      'I can help you with flight bookings! Would you like to know about:\n• Booking process\n• Flight modifications\n• Cancellation policy\n• Baggage allowance\n• Check-in procedures',
      'For flight bookings, you can search, compare, and book directly on our platform. What specific information do you need?',
      'We offer flights to 500+ destinations worldwide. Would you like destination suggestions or booking help?'
    ],
    hotels: [
      'I can assist with hotel reservations! Ask about:\n• Room availability\n• Best deals\n• Cancellation policy\n• Amenities\n• Check-in/Check-out times',
      'We have partnerships with 100,000+ hotels worldwide. Let me help you find the perfect accommodation!',
      'Looking for a hotel? Share your destination and dates, and I\'ll help you find the best options!'
    ],
    refund: [
      'Our refund policy:\n• Full refund if cancelled 7+ days before travel\n• 50% refund if cancelled 3-6 days before\n• No refund if cancelled within 3 days\n• Exceptions apply for special packages\n\nWould you like more details?',
      'Refunds are processed within 7-10 business days after approval. Need help with a refund request?',
      'To check your refund status, please provide your booking ID. Our team will assist you!'
    ],
    visa: [
      'I can provide visa information for popular destinations! Which country are you interested in?\n• Visa requirements\n• Processing time\n• Documents needed\n• Visa fees',
      'Visa requirements vary by nationality and destination. Would you like information for a specific country?',
      'We offer visa assistance services. Share your nationality and destination, and I\'ll guide you!'
    ],
    offers: [
      'Great timing! Check out our current offers:\n• 20% off on domestic flights\n• Up to 30% off on 4+ star hotels\n• Free travel insurance with bookings\n• Exclusive bank offers available\n\nWould you like to explore any of these?',
      'We have seasonal offers and exclusive deals for our members. Would you like to know about specific categories?',
      'Subscribe to our newsletter for exclusive travel deals and early-bird offers!'
    ],
    baggage: [
      'Standard baggage allowance:\n• Check-in: 20-30kg (varies by airline)\n• Cabin: 7kg carry-on\n• Additional baggage charges apply\n\nWant airline-specific details?',
      'Baggage policies differ by airline and booking type. What airline are you flying with?',
      'You can add extra baggage at checkout. Need help managing your luggage?'
    ],
    'check-in': [
      'Online check-in:\n• Available 24 hours before departure\n• Save time at the airport\n• Get your boarding pass instantly\n• Available on our app and website',
      'Most airlines offer free online check-in. Go to the airline\'s website or our app to check in!',
      'Arrive 2 hours early for domestic flight check-in, 3 hours for international flights.'
    ],
    payment: [
      'Payment options:\n• Credit/Debit cards\n• Digital wallets (Google Pay, Apple Pay)\n• UPI & Net Banking\n• EMI options available\n• No transaction fees\n\nWhat method do you prefer?',
      'We support all major payment methods with secure encryption. Any payment issues?',
      'Having trouble with payment? Our support team is here to help! Share more details.'
    ],
    cancellation: [
      'Cancellation policy basics:\n• Free cancellation up to 7 days before travel\n• Reduced refund within 3-6 days\n• Non-refundable bookings available at lower prices\n• Check your booking terms for specifics',
      'Cancellation charges depend on your package type. Let me check your booking details if you share the ID.',
      'Most bookings can be cancelled, but terms vary. Contact our support team for assistance!'
    ],
    holiday: [
      'I can suggest amazing holiday packages! Areas we cover:\n• Beach destinations\n• Mountain adventures\n• Historical tours\n• Adventure sports\n• Luxury retreats\n\nWhat interests you?',
      'Our curated holiday packages include flights, hotels, and tours. Budget and duration preferences?',
      'Looking for the perfect getaway? Tell me your interests and budget, and I\'ll recommend packages!'
    ],
    default: [
      'Thanks for your question! While I specialize in travel services, I\'m here to help you with flights, hotels, bookings, and more. How can I assist your travel plans?',
      'I\'m your travel assistant! I can help with bookings, policies, destination info, and travel tips. What travel-related question do you have?',
      'That\'s a great question, but it\'s outside my travel expertise. However, I\'m excellent with flight bookings, hotels, policies, and travel advice. What can I help with?'
    ]
  };

  constructor() {
    this.initializeChat();
  }

  private initializeChat(): void {
    const greeting: ChatMessage = {
      id: this.generateMessageId(),
      text: '👋 Welcome to Travel Support!\n\nI\'m your AI travel assistant. I can help you with:\n• Flight & hotel bookings\n• Visa & travel documents\n• Refunds & cancellations\n• Travel policies\n• Destination information\n\nWhat can I help you with today?',
      sender: 'bot',
      timestamp: new Date()
    };
    this.messagesSubject.next([greeting]);
  }

  private generateMessageId(): string {
    return `msg-${++this.messageIdCounter}`;
  }

  toggleChatWindow(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  closeChatWindow(): void {
    this.isOpenSubject.next(false);
  }

  openChatWindow(): void {
    this.isOpenSubject.next(true);
  }

  sendMessage(userMessage: string): void {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: this.generateMessageId(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMsg]);

    // Simulate typing indicator
    const typingMsg: ChatMessage = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };

    // Simulate delay and generate response
    setTimeout(() => {
      // Remove typing indicator
      let messages = this.messagesSubject.value.filter(m => m.id !== 'typing');

      // Determine bot response
      const botResponse = this.generateBotResponse(userMessage);
      const botMsg: ChatMessage = {
        id: this.generateMessageId(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      messages = [...messages, botMsg];
      this.messagesSubject.next(messages);
    }, 800 + Math.random() * 1200);
  }

  private generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if it's a travel-related query
    const isTravelRelated = this.travelTopics.some(topic =>
      lowerMessage.includes(topic)
    );

    if (!isTravelRelated && userMessage.length > 0) {
      // Not travel related
      const defaultResponses = this.botResponses['default'];
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Identify topic and provide relevant response
    for (const [topic, responses] of Object.entries(this.botResponses)) {
      if (topic !== 'default' && lowerMessage.includes(topic)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default travel-related response
    const defaultResponses = this.botResponses['default'];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  clearChat(): void {
    const greeting: ChatMessage = {
      id: this.generateMessageId(),
      text: '👋 Welcome back!\n\nHow can I assist your travel plans today?',
      sender: 'bot',
      timestamp: new Date()
    };
    this.messagesSubject.next([greeting]);
  }

  handleQuickSuggestion(suggestionId: string): void {
    const suggestionText = this.quickSuggestions.find(s => s.id === suggestionId)?.text || '';
    this.sendMessage(suggestionText);
  }
}

import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FlightResult {
  id: number;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  price: number;
}

interface TrainResult {
  id: number;
  trainName: string;
  trainNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: string[];
  seats: number;
  price: number;
}

interface BusResult {
  id: number;
  operator: string;
  busType: string;
  departure: string;
  arrival: string;
  duration: string;
  rating: number;
  price: number;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent {
  constructor(private notificationService: NotificationService) {}
  selectedTab: string = 'flights';
  searched: boolean = false;
  Math = Math; // Expose Math object to template

  searchForm = {
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    travelClass: 'Economy',
    tripType: 'one-way'
  };

  flightResults: FlightResult[] = [
    {
      id: 1,
      airline: 'IndiGo',
      flightNumber: '6E-245',
      departure: '08:00 AM',
      arrival: '12:30 PM',
      duration: '4h 30m',
      stops: 'Non-stop',
      price: 4500
    },
    {
      id: 2,
      airline: 'Air India',
      flightNumber: 'AI-405',
      departure: '10:15 AM',
      arrival: '02:45 PM',
      duration: '4h 30m',
      stops: 'Non-stop',
      price: 5200
    },
    {
      id: 3,
      airline: 'SpiceJet',
      flightNumber: 'SG-725',
      departure: '02:00 PM',
      arrival: '06:45 PM',
      duration: '4h 45m',
      stops: '1 Stop',
      price: 3800
    },
    {
      id: 4,
      airline: 'Vistara',
      flightNumber: 'UK-885',
      departure: '04:30 PM',
      arrival: '09:00 PM',
      duration: '4h 30m',
      stops: 'Non-stop',
      price: 5800
    }
  ];

  trainResults: TrainResult[] = [
    {
      id: 1,
      trainName: 'Rajdhani Express',
      trainNumber: '12001',
      departure: '06:00 PM',
      arrival: '08:30 AM (Next Day)',
      duration: '14h 30m',
      classes: ['First AC', 'Executive AC', 'AC 2-Tier'],
      seats: 82,
      price: 2200
    },
    {
      id: 2,
      trainName: 'Shatabdi Express',
      trainNumber: '12002',
      departure: '08:00 AM',
      arrival: '03:30 PM',
      duration: '7h 30m',
      classes: ['First AC', 'Executive AC'],
      seats: 45,
      price: 1800
    },
    {
      id: 3,
      trainName: 'Duranto Express',
      trainNumber: '12004',
      departure: '11:00 AM',
      arrival: '06:30 PM',
      duration: '7h 30m',
      classes: ['First AC', 'AC 2-Tier', 'AC 3-Tier'],
      seats: 120,
      price: 1500
    },
    {
      id: 4,
      trainName: 'Jan Shatabdi Express',
      trainNumber: '12012',
      departure: '02:00 PM',
      arrival: '09:30 PM',
      duration: '7h 30m',
      classes: ['AC Chair Car', 'Second AC'],
      seats: 156,
      price: 900
    }
  ];

  busResults: BusResult[] = [
    {
      id: 1,
      operator: 'RedBus Premium',
      busType: 'AC Sleeper',
      departure: '07:00 PM',
      arrival: '07:00 AM',
      duration: '12h',
      rating: 4.8,
      price: 1100
    },
    {
      id: 2,
      operator: 'GoXpress Travels',
      busType: 'AC 2x2 Volvo',
      departure: '09:00 PM',
      arrival: '09:00 AM',
      duration: '12h',
      rating: 4.6,
      price: 1300
    },
    {
      id: 3,
      operator: 'SailJaatra',
      busType: 'Non-AC Seater',
      departure: '05:00 AM',
      arrival: '05:00 PM',
      duration: '12h',
      rating: 4.2,
      price: 600
    },
    {
      id: 4,
      operator: 'TravelGear Luxe',
      busType: 'AC Recliner',
      departure: '03:00 PM',
      arrival: '03:00 AM',
      duration: '12h',
      rating: 4.9,
      price: 1500
    }
  ];

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  searchBookings(): void {
    if (!this.searchForm.from || !this.searchForm.to || !this.searchForm.departDate) {
      alert('Please fill in all required fields');
      return;
    }
    this.searched = true;
  }

  showBookingModal = false;
  bookingType: 'flight' | 'train' | 'bus' = 'flight';
  bookingDetails = {
    fullName: '',
    email: '',
    phone: '',
    numTickets: 1,
    travelDate: '',
    destination: '',
    specialRequests: ''
  };
  bookingConfirmed = false;
  bookingItem: any = null;
  bookingSubmitted = false;
  today = new Date().toISOString().split('T')[0];

  openBookingForm(item: any, type: 'flight' | 'train' | 'bus') {
    this.bookingType = type;
    this.bookingItem = item;
    this.showBookingModal = true;
    this.bookingConfirmed = false;
    this.bookingSubmitted = false;
    // Auto-fill destination name
    let dest = '';
    if (type === 'flight') dest = item?.arrival || '';
    else if (type === 'train') dest = item?.arrival || '';
    else if (type === 'bus') dest = item?.arrival || '';
    this.bookingDetails = {
      fullName: '',
      email: '',
      phone: '',
      numTickets: 1,
      travelDate: '',
      destination: dest,
      specialRequests: ''
    };
  }

  closeBookingForm(cancelled = false) {
    this.showBookingModal = false;
    if (cancelled) {
      this.notificationService.show('warning', 'Booking cancelled.');
    }
    this.bookingConfirmed = false;
    this.bookingSubmitted = false;
  }

  submitBooking() {
    this.bookingSubmitted = true;
    if (!this.bookingDetails.fullName ||
        !this.isValidEmail(this.bookingDetails.email) ||
        !this.isValidPhone(this.bookingDetails.phone) ||
        !this.isValidTickets(this.bookingDetails.numTickets)) {
      return;
    }
    this.bookingConfirmed = true;
    this.notificationService.show('success', 'Booking Confirmed Successfully!');
    setTimeout(() => {
      this.closeBookingForm();
    }, 2000);
  }

  isValidEmail(email: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }
  isValidPhone(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }
  isValidTickets(num: number): boolean {
    return !!num && num > 0;
  }
  isValidDate(date: string): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const d = new Date(date);
    return d >= today;
  }
}

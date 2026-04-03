import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  showSuccess = false;
  successMessage = '';

  queryTypes = [
    'General Inquiry',
    'Flight Booking Help',
    'Hotel Reservation',
    'Refund/Cancellation',
    'Visa Assistance',
    'Payment Issue',
    'Complaint',
    'Feedback',
    'Other'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      bookingId: [''],
      queryType: ['General Inquiry', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get queryType() {
    return this.contactForm.get('queryType');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form Submitted:', formData);

      // Simulate API call
      setTimeout(() => {
        this.showSuccess = true;
        this.successMessage = `Thank you, ${formData.name}! Your query has been submitted. Our team will contact you at ${formData.phone} within 24 hours.`;
        
        // Reset form
        this.contactForm.reset({ queryType: 'General Inquiry' });
        this.submitted = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      }, 500);
    }
  }

  resetForm(): void {
    this.contactForm.reset({ queryType: 'General Inquiry' });
    this.submitted = false;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched || this.submitted));
  }
}

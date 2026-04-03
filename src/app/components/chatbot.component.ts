import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage, QuickSuggestion } from '../services/chatbot.service';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, SanitizeHtmlPipe],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages$!: Observable<ChatMessage[]>;
  isOpen$!: Observable<boolean>;
  userInput: string = '';
  quickSuggestions: QuickSuggestion[] = [];

  constructor(public chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.messages$ = this.chatbotService.messages$;
    this.isOpen$ = this.chatbotService.isOpen$;
    this.quickSuggestions = this.chatbotService.quickSuggestions;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  sendMessage(): void {
    if (this.userInput.trim()) {
      this.chatbotService.sendMessage(this.userInput);
      this.userInput = '';
    }
  }

  onQuickSuggestionClick(suggestionId: string): void {
    this.chatbotService.handleQuickSuggestion(suggestionId);
  }

  toggleChat(): void {
    this.chatbotService.toggleChatWindow();
  }

  closeChat(): void {
    this.chatbotService.closeChatWindow();
  }

  clearChat(): void {
    this.chatbotService.clearChat();
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

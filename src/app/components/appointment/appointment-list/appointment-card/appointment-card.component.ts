import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SlotDurationPipe } from '../../../../shared/pipes/slot-duration.pipe';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [ MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SlotDurationPipe,
    RouterLink,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent {
  @Input() appointment: any;  
  @Input() isCancel: boolean = false; 
  @Input() isEdit: boolean = false; 
  @Input() isDetails: boolean = false; 
  @Input() isToday: boolean = false; 
  @Output() cancel = new EventEmitter<any>(); 
  onCancelClick() {
    this.cancel.emit(this.appointment);  // Emit the appointment to be canceled
  }
}

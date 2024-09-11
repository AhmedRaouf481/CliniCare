import { Component, viewChild } from '@angular/core';
import { SlotComponent } from './slot/slot.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [SlotComponent, 
       MatButtonModule,
        MatExpansionModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent {
  accordion = viewChild.required(MatAccordion);
  week = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
}

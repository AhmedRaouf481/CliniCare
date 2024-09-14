import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Slot } from '../../../interfaces/slot.interface';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { CapitalizeFirstPipe } from '../../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    SlotDurationPipe,
    CapitalizeFirstPipe
  ],
  templateUrl: './slot-card.component.html',
  styleUrl: './slot-card.component.css'
})
export class SlotCardComponent implements OnInit {
  @Input() slot!: Slot;
  ngOnInit(): void {
    console.log(this.slot);
  }
  // lo
}

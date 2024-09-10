import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/api/api-urls';
import { Observable } from 'rxjs';
import { Slot } from '../interfaces/slot.interface';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  constructor(private _httpclient: HttpClient) {}

  getAllSlots(): Observable<Slot[]> {
    return this._httpclient.get<Slot[]>(URLs.ApiBaseUrl + URLs.slot);
  }

  getSlotByDoctorId(doctorId: number): Observable<Slot[]> {
    return this._httpclient.get<Slot[]>(
      URLs.ApiBaseUrl + URLs.doctorSlots(doctorId)
    );
  }

  findAllAvailableSlots(doctorId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let createdSlots: string[] = [];
  
      // Fetch existing slots for the doctor
      this.getSlotByDoctorId(doctorId).subscribe({
        next: (data) => {
          createdSlots = data.map((slot) => slot.startTime);
          
          const duration = 30; // duration in minutes
          let slots: string[] = [];
          let initialDate = new Date();
          initialDate.setHours(0, 0, 0); // Start at 00:00 of the current day
  
          let from = initialDate;
          const iterations = (24 * 60) / duration; // Number of slots in a day (e.g., 48 for 30-minute slots)
  
          for (let i = 0; i < iterations; i++) {
            let startTime = from.toTimeString().split(' ')[0]; // Get HH:MM:SS
            
            // If the time slot isn't already in created slots, add it
            if (!createdSlots.includes(startTime)) {
              slots.push(startTime);
            }
            
            // Move to the next time slot
            from = new Date(from.getTime() + duration * 60 * 1000); // Add 30 minutes
          }
          
          resolve(slots); // Return the available slots after filtering
        },
        error: (err: any) => {
          console.log('Error fetching slots:', err.message);
          reject(err);
        },
      });
    });
  }
  
}

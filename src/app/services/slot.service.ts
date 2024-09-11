import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/api/api-urls';
import { Observable } from 'rxjs';
import { SlotRequestInterface, Slot } from '../interfaces/slot.interface';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  constructor(private _httpclient: HttpClient) {}

  addSlot(slot: SlotRequestInterface): Observable<SlotRequestInterface> {
    return this._httpclient.post<SlotRequestInterface>(
      URLs.ApiBaseUrl + URLs.slot,
      slot
    );
  }

  editSlot(slotId: number, slot: SlotRequestInterface): Observable<Slot[]> {
    return this._httpclient.put<Slot[]>(
      URLs.ApiBaseUrl + URLs.slot + '/' + slotId,
      slot
    );
  }

  deleteSlot(slotId: number): Observable<Slot[]> {
    return this._httpclient.delete<Slot[]>(
      URLs.ApiBaseUrl + URLs.slot + '/' + slotId
    );
  }

  getAllSlots(): Observable<Slot[]> {
    return this._httpclient.get<Slot[]>(URLs.ApiBaseUrl + URLs.slot);
  }

  getSlotByDoctorId(doctorId: number): Observable<Slot[]> {
    return this._httpclient.get<Slot[]>(
      URLs.ApiBaseUrl + URLs.doctorSlots(doctorId)
    );
  }
  getDaySlotsByDoctorId(doctorId: number, weekDay: string): Observable<Slot[]> {
    return this._httpclient.get<Slot[]>(
      URLs.ApiBaseUrl + URLs.doctorSlots(doctorId) + '?weekday=' + weekDay
    );
  }

  findAllAvailableSlots(doctorId: number, day: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let createdSlots: { startTime: string; day: string }[] = [];

      // Fetch existing slots for the doctor
      this.getSlotByDoctorId(doctorId).subscribe({
        next: (data) => {
          createdSlots = data.map((slot) => ({
            startTime: slot.startTime,
            day: slot.weekDay,
          }));

          const duration = 30; // duration in minutes
          let slots: string[] = [];
          let initialDate = new Date();
          initialDate.setHours(0, 0, 0); // Start at 00:00 of the current day

          let from = initialDate;
          const iterations = (24 * 60) / duration; // Number of slots in a day (e.g., 48 for 30-minute slots)

          for (let i = 0; i < iterations; i++) {
            let startTime = from.toTimeString().split(' ')[0]; // Get HH:MM:SS

            // If the time slot isn't already in created slots, add it
            if (
             !createdSlots.find((slot) => {
                return slot.startTime === startTime && slot.day === day;
              })
            ) {
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

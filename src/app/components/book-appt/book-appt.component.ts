import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MultiSelectFieldComponent } from '../../shared/components/multi-select-field/multi-select-field.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { autocompleteObjectValidator } from '../../shared/util/autocompeleteObjectValidator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ClinicService } from '../../services/clinic.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { SlotService } from '../../services/slot.service';
import { Slot } from '../../interfaces/slot.interface';
import { SlotCardComponent } from './slot-card/slot-card.component';

@Component({
  selector: 'app-book-appt',
  standalone: true,
  imports: [
    SlotCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MultiSelectFieldComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './book-appt.component.html',
  styleUrl: './book-appt.component.css'
})
export class BookApptComponent implements OnInit, OnDestroy {
  slots:Slot[] = [];
  doctorOptions: any[] = [];
  clinicOptions: any[] = [];
  locationOptions: any[] = [];
  subs: Subscription[] = [];

  searchForm!: FormGroup;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private _doctorService: DoctorService,
    private _clinicService: ClinicService,
    private _slotService: SlotService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initSerachForm();
    this.fetchSlots()
    this.fetchDoctors();
    this.initializeLocationChange();
    this.fetchClinics();
    this.searchSlots();
    this.handleClinicChanges()
    this.handleDoctorChanges()
  }

  private initSerachForm(): void {
    this.searchForm = this.fb.group({
      doctor: ['', [autocompleteObjectValidator()]],
      clinic: ['', [autocompleteObjectValidator()]],
      location: ['', [autocompleteObjectValidator()]],
      dateRange: this.range,
    });
  }
  private handleDoctorChanges(): void {
    const sub = this.searchForm.get('doctor')?.valueChanges.subscribe((doctor) => {
      if (doctor) {
        // Filter clinics based on the selected doctor's ID
        const filteredClinics = this.clinicOptions.filter(clinic =>
          clinic.doctors.find((doctorClinic: any) => doctorClinic.id === doctor.id)
        );
  
        // Update clinicOptions to only show the filtered clinics
        this.clinicOptions = filteredClinics;
      } else {
        // If no doctor is selected, reset the clinic options
        this.fetchClinics(); // Re-fetch all clinics or restore original list
      }
     
    });
    if (sub) { 
      this.subs.push(sub);
    }
  }
  private handleClinicChanges(): void {
    const sub = this.searchForm.get('clinic')?.valueChanges.subscribe((clinic) => {
      if (clinic) {
        const filteredDoctors = this.doctorOptions.filter(doctor =>
          doctor.doctorClinics.find((doctorClinic: any) => doctorClinic.id === clinic.id)
        );
  
        this.doctorOptions = filteredDoctors;
      } else {
        this.fetchDoctors(); 
      }
     
    });
    if (sub) { 
      this.subs.push(sub);
    }
  }

  private fetchDoctors(): void {
    this._doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctorOptions = data
        console.log(data);
        
      },
      error: (err) => console.error('Error fetching clinics:', err),
    });
  }
  private fetchSlots(): void {
    this._slotService.getAllSlots().subscribe({
      next: (data) => {
        this.slots = data
        console.log(data);
        
      },
      error: (err) => console.error('Error fetching clinics:', err),
    });
  }
  private searchSlots(): void {
    let searchParams:{doctorId?:number,locationId?:number,clinicId?:number,weekDay?:string} ={}
    this.searchForm.valueChanges.subscribe({
      next:(value)=>{
        if(value.doctor){
          console.log(value.doctor);
          
          searchParams['doctorId'] = value.doctor.id
        }
        if(value.clinic){
          searchParams['clinicId'] = value.clinic.id
        }
        if(value.location){
          searchParams['locationId'] = value.location.id
        }
        // if(value.weekDay){
        //   searchParams['locationId'] = value.location.id
        // }
        console.log(searchParams);
        

        this._slotService.getAllSlots(searchParams).subscribe({
          next: (data) => {
            this.slots = data;
            console.log(data);
          },
          error: (err) => console.error('Error fetching slots:', err),
        });
      },
    })
  }

  private initializeLocationChange(): void {
    const sub = this.searchForm
      .get('clinic')
      ?.valueChanges.subscribe((clinicName) => {
        const clinic = this.clinicOptions.find(
          (c) => c.name === clinicName?.name
        );
        if (clinic) {
          this.searchForm.get('location')?.setValue('');
          this.locationOptions = clinic.locations.map((location: any) => ({
            name: `${location.addressLine}, ${location.city}`,
            id: location.id,
            addressLine: location.addressLine,
            city: location.city,
          }));
        }
      });
    if (sub) {
      this.subs.push(sub);
    }
  }
  private fetchClinics(): void {
    this._clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinicOptions = data;
        console.log(data);

      },
      error: (err) => console.error('Error fetching clinics:', err),
    });
  }

  // Unsubscribe from all subscriptions when component is destroyed
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

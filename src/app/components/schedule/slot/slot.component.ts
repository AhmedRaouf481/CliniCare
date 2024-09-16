import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MultiSelectFieldComponent } from '../../../shared/components/multi-select-field/multi-select-field.component';
import { ClinicService } from '../../../services/clinic.service';
import { Clinic } from '../../../interfaces/clinic';
import { SlotService } from '../../../services/slot.service';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';
import { ListComponent } from '../../../shared/components/list/list.component';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { autocompleteObjectValidator } from '../../../shared/util/autocompeleteObjectValidator';
import { AuthenticationService } from '../../../services/auth/authentication.service';

@Component({
  selector: 'app-slot',
  standalone: true,
  providers: [provideNativeDateAdapter(), SlotDurationPipe],
  imports: [
    MatButtonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectFieldComponent,
    ListComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slot.component.html',
  styleUrl: './slot.component.css',
})
export class SlotComponent implements OnInit, OnDestroy {
  @Input() day!: string;
  @Input() week!: string[];

  slotForm!: FormGroup;
  existSlotForm!: FormGroup;
  doctorSlots: any[] = [];
  slotOptions: any[] = [];
  clinicOptions: any[] = [];
  locationOptions: any[] = [];
  allClinicData!: Clinic[];
  subs: Subscription[] = [];
  doctorId!: number;
  isEdit = false;

  constructor(
    private _clinicService: ClinicService,
    private _slotService: SlotService,
    private _authService: AuthenticationService,
    private fb: FormBuilder,
    private slotDuration: SlotDurationPipe,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.doctorId = _authService.getUserId();
  }

  ngOnInit(): void {
    this.initForms();
    this.fetchDoctorSlots();
    this.fetchDoctorClinics();
    this.initializeLocationChange();
    this.fetchSlotOptions();
  }

  // Initialize the forms
  private initForms(): void {
    this.slotForm = this.fb.group({
      slot: ['', [autocompleteObjectValidator(), Validators.required]],
      clinic: ['', [autocompleteObjectValidator(), Validators.required]],
      location: ['', [autocompleteObjectValidator(), Validators.required]],
      weekDay: '',
    });

    this.existSlotForm = this.fb.group({
      slot: ['', Validators.required],
    });

    this.handleExistingSlotChanges();
  }

  // Subscribe to changes on the existing slot field
  private handleExistingSlotChanges(): void {
    const sub = this.existSlotForm.get('slot')?.valueChanges.subscribe((slotValue) => {
      if (slotValue?.length === 1) {
        this.isEdit = true;
        const currentSlot = slotValue[0];
        this.slotForm.patchValue({
          slot: {
            name: this.slotDuration.transform(currentSlot.startTime, 30),
            startTime: currentSlot.startTime,
          },
          clinic: currentSlot.clinicLocation.clinic,
          location: {
            name: `${currentSlot.clinicLocation.addressLine}, ${currentSlot.clinicLocation.city}`,
            id: currentSlot.clinicLocation.id,
            addressLine: currentSlot.clinicLocation.addressLine,
            city: currentSlot.clinicLocation.city,
          },
          weekDay: this.day,
        });
      } else {
        this.slotForm.reset();
        this.isEdit = false;
      }
    });
    if (sub) { 
      this.subs.push(sub);
    }
  }


  // Fetch the doctor's clinics and set clinic options
  private fetchDoctorClinics(): void {
    this._clinicService.getClinicByDoctorId(this.doctorId).subscribe({
      next: (data) => {
        this.clinicOptions = data;
        this.allClinicData = data;
      },
      error: (err) => console.error('Error fetching clinics:', err),
    });
  }

  // Update location options based on selected clinic
  private initializeLocationChange(): void {
    const sub = this.slotForm.get('clinic')?.valueChanges.subscribe((clinicName) => {
      const clinic = this.allClinicData.find((c) => c.name === clinicName?.name);
      if (clinic) {
        this.slotForm.get('location')?.setValue('');
        this.locationOptions = clinic.locations.map((location) => ({
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

  // Fetch available slots for the doctor
  private fetchSlotOptions(): void {
    this._slotService.findAllAvailableSlots(this.doctorId,this.day.toUpperCase()).then((slots) => {
      console.log(slots);
      this.slotOptions = slots.map((slot) => ({
        name: this.slotDuration.transform(slot, 30),
        startTime: slot,
      }));
    });
  }

  // Fetch doctor's slots for the current day
  private fetchDoctorSlots(): void {
    this._slotService.getSlotByDoctorId(this.doctorId).subscribe({
      next: (data) => {
        this.doctorSlots = data.filter(
          (slots) => slots.weekDay.toLowerCase() === this.day.toLowerCase()
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching doctor slots:', err.message),
    });
  }

  // Submit new slot
  submitSlot(): void {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      return;
    }

    const newSlot = {
      weekDay: this.day.toUpperCase(),
      doctor: { id: +this.doctorId },
      clinicLocation: { id: this.slotForm.value.location.id },
      startTime: this.slotForm.value.slot.startTime,
    };

    this._slotService.addSlot(newSlot).subscribe({
      error: (err) => this.showFeedbackMessage(err.error.message, 'error-snackbar'),
      complete: () => {
        this.showFeedbackMessage('Slot added successfully', 'success-snackbar');
        this.fetchDoctorSlots();
        this.fetchSlotOptions()
        this.slotForm.reset()
      },
    });
  }

  // Edit an existing slot
  editSlot(): void {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      return;
    }

    const updatedSlot = {
      weekDay: this.slotForm.value.weekDay.toUpperCase(),
      clinicLocation: { id: this.slotForm.value.location.id },
      startTime: this.slotForm.value.slot.startTime,
    };

    this._slotService.editSlot(this.existSlotForm.value.slot[0].id, updatedSlot).subscribe({
      error: (err) => this.showFeedbackMessage(err.error.message, 'error-snackbar'),
      complete: () => {
        this.showFeedbackMessage('Slot updated successfully', 'success-snackbar')
        this.fetchDoctorSlots()
        this.fetchSlotOptions()
        this.isEdit = false;
        this.slotForm.reset();
      },
    });
  }

  // Delete an existing slot
  deleteSlot(): void {
    const slotId = this.existSlotForm.value.slot[0].id;
    this._slotService.deleteSlot(slotId).subscribe({
      error: (err) => console.error('Error deleting slot:', err.message),
      complete: () => {
        this.showFeedbackMessage('Slot deleted successfully', 'success-snackbar')
        this.fetchDoctorSlots();
        this.slotForm.reset();
        this.isEdit =false
      },
    });
  }

  // Show feedback messages
  private showFeedbackMessage(msg: string, style: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: style,
    });
  }

  // Unsubscribe from all subscriptions when component is destroyed
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

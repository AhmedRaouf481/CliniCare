import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MultiSelectFieldComponent } from '../../../shared/components/multi-select-field/multi-select-field.component';
import { ClinicService } from '../../../services/clinic.service';
import { Clinic } from '../../../interfaces/clinic';
import { SlotService } from '../../../services/slot.service';
import { SlotDurationPipe } from '../../../shared/pipes/slot-duration.pipe';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slot.component.html',
  styleUrl: './slot.component.css',
})
export class SlotComponent implements OnInit {
  @Input() day!: string;
  slotForm!: FormGroup;
  slotOptions: string[] = ['slot One', 'Two', 'Three'];
  clinicOptions: string[] = [];
  locationOptions: string[] = [];
  allClinicData!: Clinic[];
  doctorId!: number;
  constructor(
    private _clinicService: ClinicService,
    private _slotService: SlotService,
    private fb: FormBuilder,
    private slotDuration: SlotDurationPipe
  ) {
    this.doctorId = JSON.parse(localStorage.getItem('user') ?? '')?.id;
  }

  ngOnInit() {
    this.initSlotFormGroup();
    this.getDoctorClinics(this.doctorId);
    this.getClinicLocations();
    this.getSlotOptions();
    // console.log('slots', this._slotService.findAllAvailableSlots(this.doctorId ));
  }

  initSlotFormGroup() {
    this.slotForm = this.fb.group({
      slot: ['', Validators.required],
      clinic: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  getDoctorClinics(doctorId: number) {
    this._clinicService.getClinicByDoctorId(doctorId).subscribe({
      next: (data) => {
        this.clinicOptions = data.map((clinic) => clinic.name);
        this.allClinicData = data;
        console.log(data);
      },
      error: (err: any) => {
        console.log('error fetching clinics \n', err.message);
      },
    });
  }

  getClinicLocations() {
    this.slotForm.get('clinic')?.valueChanges.subscribe({
      next: (clinicName) => {
        const clinic = this.allClinicData.find((c) => c.name === clinicName);
        if (clinic) {
          this.locationOptions = clinic.locations.map(
            (location) => location.addressLine + ', ' + location.city
          );
        }
      },
    });
  }

  async getSlotOptions() {
    let slots = await this._slotService.findAllAvailableSlots(this.doctorId);
    this.slotOptions = slots.map((slot) =>
      this.slotDuration.transform(slot, 30)
    );
  }
}

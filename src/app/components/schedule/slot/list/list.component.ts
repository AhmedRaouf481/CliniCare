import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { SlotDurationPipe } from '../../../../pipes/slot-duration.pipe';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SlotDurationPipe
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent  {
  @Input() list: any[] = [];
  @Input() form!: FormGroup; // Form passed from the parent
  @Input() controlName!: string; // Control name passed from the parent


  onSelectionChange(event: any) {    
    const clickedOption = event.options[0]?.value;
    const selectedValue = this.form.get(this.controlName)?.value;
    this.form.get(this.controlName)?.setValue(selectedValue.filter((value:any) => value.id === clickedOption.id))
  }

}

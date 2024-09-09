import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-multi-select-field',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './multi-select-field.component.html',
  styleUrls: ['./multi-select-field.component.css']
})
export class MultiSelectFieldComponent implements OnInit,OnChanges {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() options: string[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = '';
  filteredOptions?: Observable<string[]>;



 
  ngOnInit() {
    // This sets up the initial valueChanges observable.
    this.setupFiltering();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This detects changes to the `options` and updates filteredOptions if necessary
    if (changes['options']) {
      this.setupFiltering();
    }
  }

  private setupFiltering() {
    if (this.form && this.controlName) {
      this.filteredOptions = this.form.get(this.controlName)?.valueChanges.pipe(
        startWith(''), // Start with empty string so options are displayed initially.
        map(value => this._filter(value || '')), // Call filter with current input value.
      );
    }
  }

  private _filter(value: string): string[] {
    if (!value) {
      return this.options
    }
    const filterValue = value.toLowerCase();
    console.log("value",value);
    console.log("options",this.options);
    
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


}

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchable-select-field',
  standalone: true,
  templateUrl: './searchable-select-field.component.html',
  styleUrl: './searchable-select-field.component.css',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    AsyncPipe,
  ],
})
export class SearchableSelectFieldComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() options: any[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = '';
  filteredOptions?: Observable<any[]>;

  ngOnInit() {
    // This sets up the initial valueChanges observable.
    this.setupFiltering();
    console.log(this.form.get(this.controlName)?.value?.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This detects changes to the `options` and updates filteredOptions if necessary
    if (changes['options']) {
      this.setupFiltering();
    }
  }

  private setupFiltering() {
    if (this.form && this.controlName) {
      const control = this.form.get(this.controlName);
      if (control) {
        this.filteredOptions = control.valueChanges.pipe(
          startWith(control.value || ''), // Use current value as the start
          map((value) => (typeof value === 'string' ? value : value?.name)), 
          map((name) => (name ? this._filter(name) : this.options.slice()))
        );
      }
    }
  }
  displayFn(option: any): string { // ChatGPt
    return option && option.name ? option.name : '';
  }
   // Method to filter the options
   private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}

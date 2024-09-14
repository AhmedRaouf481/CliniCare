import { ValidatorFn, AbstractControl } from "@angular/forms";

// Validator to check if input is a valid object from autocomplete options
export function autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return typeof control.value === 'string' 
        ? { invalidAutocompleteObject: { value: control.value } } 
        : null; // Valid object selected
    };
  }
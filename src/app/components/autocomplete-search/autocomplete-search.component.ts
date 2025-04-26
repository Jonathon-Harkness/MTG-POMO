import {Component, input, Input, OnInit, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
import {Name} from '../../interfaces/pomo.interface';

export interface User {
  name: string;
}

@Component({
  selector: 'app-autocomplete-search',
  imports: [
    MatFormField,
    MatAutocomplete,
    MatOption,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatInput,
    AsyncPipe,
    MatLabel
  ],
  templateUrl: './autocomplete-search.component.html',
  styleUrl: './autocomplete-search.component.scss',
  standalone: true
})
export class AutocompleteSearchComponent implements OnInit {
  //@Input() cardOptions: any;
  cardOptions = input<any>();
  filteredCardOptions = output<any>();
  myControl = new FormControl<string | Name>('');
  filteredOptions: Observable<Name[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        this.filteredCardOptions.emit(name ? this._filter(name as string) : this.cardOptions().slice());
        return name ? this._filter(name as string) : this.cardOptions().slice();
      }),
    );
  }

  displayFn(card: Name): string {
    return card && card.name ? card.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.cardOptions().filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }
}

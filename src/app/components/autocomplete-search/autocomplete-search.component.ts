import {Component, input, Input, OnInit, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput, MatInputModule} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
import {Name} from '../../interfaces/pomo.interface';
import {DataService} from '../../services/data.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {AutocompleteService} from '../../services/autocomplete.service';

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
    MatLabel,
    FormsModule,
    MatIconButton,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './autocomplete-search.component.html',
  styleUrl: './autocomplete-search.component.scss',
  standalone: true
})
export class AutocompleteSearchComponent implements OnInit {
  cardOptions = input<any>();
  filteredCardOptions = output<any>();
  myControl = new FormControl<string | any>('');
  filteredOptions: Observable<Name[]>;
  value = '';

  constructor(
    private dataService: DataService,
    private autocompleteService: AutocompleteService,
  ) { }

  ngOnInit() {

    this.myControl.valueChanges.subscribe(value => {
      const name = typeof value === 'string' ? value : value?.name;
      if (this.autocompleteService.currentValue === 'Name') {
        const filteredResult = name ? this._filterName(name as string) : this.cardOptions().slice();
        this.dataService.updateData(filteredResult);
      } else {
        const filteredResult = name ? this._filterEffect(name as string) : this.cardOptions().slice();
        this.dataService.updateData(filteredResult);
      }
    });

    this.autocompleteService.currentSearchType.subscribe(searchType => {
      this.value = '';
    })
  }

  private _filterName(name: string): any {
    const filterValue = name.toLowerCase();
    return this.cardOptions().filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  private _filterEffect(effect: string): any {
    const filterValue = effect.toLowerCase();
    return this.cardOptions().filter((option: any) => (option.oracle_text ?? option.card_faces[0].oracle_text).toLowerCase().includes(filterValue));
  }

  clearResults() {
    this.value = '';
  }

  get searchTypeLabel() {
    return this.autocompleteService.currentValue;
  }
}

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
      // if (this.autocompleteService.currentValue === 'Name') {
      //   const filteredResult = name ? this._filterName(name as string) : this.cardOptions().slice();
      //   this.dataService.updateData(filteredResult);
      // } else if (this.autocompleteService.currentValue === 'Effect') {
      //   const filteredResult = name ? this._filterEffect(name as string) : this.cardOptions().slice();
      //   this.dataService.updateData(filteredResult);
      // } else if (this.autocompleteService.currentValue === 'Type') {
      //   const filteredResult = name ? this._filterType(name as string) : this.cardOptions().slice();
      //   this.dataService.updateData(filteredResult);
      // }
      const filteredResult = name ? this._filter(name as string) : this.cardOptions().slice();
      this.dataService.updateData(filteredResult);
    });

    this.autocompleteService.currentSearchType.subscribe(searchType => {
      const filteredResult = this.myControl.value ? this._filter(this.myControl.value as string) : this.cardOptions().slice();
      this.dataService.updateData(filteredResult);
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

  private _filterType(type: string): any {
    const filterType = type.toLowerCase();
    return this.cardOptions().filter((option: any) => (option.type_line ?? option.card_faces[0].type_line).toLowerCase().includes(filterType));
  }

  private newFilterValue(netFilter: any[], filterType: any[]) {
    if (netFilter.length > 0) {
      return netFilter.concat(filterType.filter(
        item2 => !netFilter.some(item1 => item1.id === item2.id)));
    }
    return filterType;
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    const slideToggles = this.autocompleteService.currentValue;

    let nameFilter = this.cardOptions().filter((option: any) => option.name.toLowerCase().includes(filterValue));
    let effectFilter = this.cardOptions().filter((option: any) => (option.oracle_text ?? option.card_faces[0].oracle_text).toLowerCase().includes(filterValue));
    let typeFilter = this.cardOptions().filter((option: any) => (option.type_line ?? option.card_faces[0].type_line).toLowerCase().includes(filterValue));
    let netFilter: any[] = [];
    let noneChecked = true;

    for (const slideToggle of slideToggles) {
      if (slideToggle.checked) {
        noneChecked = false;
        switch(slideToggle.name) {
          case "Name": {
            netFilter = this.newFilterValue(netFilter, nameFilter);
            break;
          }
          case "Effect": {
            netFilter = this.newFilterValue(netFilter, effectFilter);
            break;
          }
          case "Type": {
            netFilter = this.newFilterValue(netFilter, typeFilter);
            break;
          }
        }
      }
    }
    console.log(slideToggles);
    console.log(netFilter);
    if (noneChecked) {
      netFilter = this.cardOptions();
    }
    return netFilter;
  }

  clearResults() {
    this.value = '';
  }

  get searchTypeLabel() {
    return this.autocompleteService.currentValue;
  }
}

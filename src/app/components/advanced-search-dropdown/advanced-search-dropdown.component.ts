import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {AutocompleteSearchComponent} from '../autocomplete-search/autocomplete-search.component';
import {DataService} from '../../services/data.service';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {NgForOf, NgIf} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {AdvancedSearchService} from '../../services/advanced-search.service';
import {colorSearchFilter, SearchFilter} from '../../interfaces/pomo.interface';

@Component({
  selector: 'app-advanced-search-dropdown',
  imports: [
    MatExpansionModule,
    AutocompleteSearchComponent,
    MatCheckbox,
    NgIf,
    MatInput,
    NgForOf
  ],
  templateUrl: './advanced-search-dropdown.component.html',
  styleUrl: './advanced-search-dropdown.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchDropdownComponent {
  readonly panelOpenState = signal(false);
  dropdownType = input<string>();
  colorList = [
    'White',
    'Blue',
    'Black',
    'Red',
    'Green',
    'Colorless'
  ]

  constructor(
    private dataService: DataService,
    private advancedSearchService: AdvancedSearchService,
    ) {
  }

  getData() {
    return this.dataService.currentValue;
  }

  updateList(color: string, event: MatCheckboxChange) {
    const currentFilters = this.advancedSearchService.currentValue;
    currentFilters.colorSearchFilter.set(color,
      { ...currentFilters.colorSearchFilter.get(color), enabled: !currentFilters.colorSearchFilter.get(color).enabled });
    let isThereTrueColor = false;
    currentFilters.colorSearchFilter.forEach((value: colorSearchFilter, key: string) => {
      if (currentFilters.colorSearchFilter.get(key).enabled === true) {
        isThereTrueColor = true;
      }
    });
    currentFilters.colorEnabled = isThereTrueColor;
    this.advancedSearchService.updateData(currentFilters);
  }
}

import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {AutocompleteSearchComponent} from '../autocomplete-search/autocomplete-search.component';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-advanced-search-dropdown',
  imports: [
    MatExpansionModule,
    AutocompleteSearchComponent
  ],
  templateUrl: './advanced-search-dropdown.component.html',
  styleUrl: './advanced-search-dropdown.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchDropdownComponent {
  readonly panelOpenState = signal(false);

  constructor(private dataService: DataService) {
  }

  getData() {
    return this.dataService.currentValue;
  }
}

import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, OnChanges, model} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {delay, Observable, take} from 'rxjs';
import {ScryfallService} from '../../services/scryfall.service';
import {colorSearchFilter, Data, SearchFilter, SearchFilters, SlideToggle} from '../../interfaces/pomo.interface';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAutocomplete, MatOption} from '@angular/material/autocomplete';
import {AutocompleteSearchComponent} from '../autocomplete-search/autocomplete-search.component';
import {DataService} from '../../services/data.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {AdvancedSearchDropdownComponent} from '../advanced-search-dropdown/advanced-search-dropdown.component';
import {MatFormField} from '@angular/material/form-field';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteService} from '../../services/autocomplete.service';
import {MatInput} from '@angular/material/input';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {AdvancedSearchComponent} from '../advanced-search/advanced-search.component';
import {AdvancedSearchService} from '../../services/advanced-search.service';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';


@Component({
  selector: 'app-body',
  imports: [
    MatPaginator,
    CommonModule,
    RouterLink,
    MatProgressSpinner,
    MatAutocomplete,
    MatOption,
    AutocompleteSearchComponent,
    MatExpansionModule,
    MatCardModule,
    AdvancedSearchDropdownComponent,
    MatFormField,
    MatSelectModule,
    FormsModule,
    MatInput,
    MatSlideToggleModule,
    MatIconButton,
    MatButton,
    MatIconModule,
    AdvancedSearchComponent,
    ReactiveFormsModule,
    MatCheckbox
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true
})
export class BodyComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(AutocompleteSearchComponent) autoCompleteSearchComponent: AutocompleteSearchComponent;
  obs: Observable<any>;
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = true;
  dataArr: any[] = [];
  selectedSearchOption: string = 'Name';
  advancedSearchOpen = false;
  numbers: number[] = [1, 2, 3, 4, 5];
  selectedNumber: number = 1;
  searchFilters: SearchFilter;
  filteredDataArr: any[];
  filteredDataAutocompleteSearch: any[];

  colors = new Map<string, boolean>([
    ['W', false], // White
    ['U', false], // Blue
    ['B', false], // Black
    ['R', false], // Red
    ['G', false], // Green
    ['C', false]  // Colorless
  ]);

  // Form Group And its Form Controls
  inputForm = new FormGroup<SearchFilters>({
    name: new FormControl('', {nonNullable: true}),
    oracle_text: new FormControl('', {nonNullable: true}),
    type: new FormControl('',{nonNullable: true}),
    manaSearchType: new FormControl('', {nonNullable: true}),
    totalMana: new FormControl(0, {nonNullable: true}),
    colors: new FormControl(this.colors, {nonNullable: true}),
    colorSearchMode: new FormControl('exact', {nonNullable: true})
  });

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scryfallService: ScryfallService,
    private dataService: DataService,
    private autocompleteService: AutocompleteService,
    private advancedSearchService: AdvancedSearchService
  )
  { }

  slideToggles = [
    {
      id: 1,
      name: "Name",
      checked: true
    },
    {
      id: 2,
      name: "Type",
      checked: false
    },
    {
      id: 3,
      name: "Effect",
      checked: false
    }
  ] as SlideToggle[];

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.getCardDataSearch();
    this.autocompleteService.updateData(this.slideToggles);
    this.getFilters();

    this.inputForm.valueChanges
      .subscribe(obj => {
        console.log(obj)
        this.dataService.filterData(obj, this.dataArr);
      });
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  getCardDataSearch() {
    const searchPathBase = 'https://api.scryfall.com/cards/search?q=legal%3Avintage+(is%3Aub+or+set%3Asld+or+set%3Aslc+or+set%3Aslu+or+set%3Aslp+or+is%3Agodzilla+or+is%3Adracula+or+is%3Apagl+or+is%3Aphed+or+is%3Apctb)+-!"sol+ring"+-!"mana+vault"+-!"the+one+ring"+-!"strip+mine"+-!wasteland+-!"mental+misstep"&unique=cards&as=grid&order=name';
    this.getCardDataSearchCall(searchPathBase);
  }

  getCardDataSearchCall(searchPath: string) {
    this.scryfallService.getPomoCardSets(searchPath).pipe(delay(75)).subscribe(res => {
      this.dataArr.push(...res.data);
      if (res.has_more) {
        this.getCardDataSearchCall(res.next_page);
      } else {
        this.getCardDataExceptions();
      }
    })
  }

  getCardDataExceptions() {
    this.scryfallService.getAllCards().pipe(take(1)).subscribe(data => {
      const combinedObj = [...data[0].data, ...data[1].data];
      this.dataArr.push(...combinedObj);
      this.setUpCardData();
    })
  }

  setUpCardData() {
    this.dataArr.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    console.log(this.dataArr);
    this.dataSource = new MatTableDataSource<any>(this.dataArr);
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
    this.dataService.updateData(this.dataArr);
    this.isLoading = false;
    this.getCardData();
  }

  getFilters() {
    this.advancedSearchService.currentSearchFilters.subscribe(filter => {
      this.searchFilters = filter;
      this.filterData();
    })
  }

  private filterData() {
    this.filteredDataArr = [];
    const idSet = new Set<string>();
    for(const card of this.dataArr) {
      this.searchFilters.colorSearchFilter.forEach((value: colorSearchFilter, key: string) => {
        // colorless exception
        if (value.colorCode === 'C') {
          if (!idSet.has(card.id) && value.enabled && (card.colors ?? card.card_faces[0].colors).length === 0) {
            this.filteredDataArr.push(card);
            idSet.add(card.id);
          }
        }
        else {
          if (!idSet.has(card.id) && value.enabled && (card.colors ?? card.card_faces[0].colors).includes(value.colorCode)) {
            this.filteredDataArr.push(card);
            idSet.add(card.id);
          }
        }
      });
    }
    if (!this.searchFilters.colorEnabled) {
      this.filteredDataArr = this.dataArr;
    }
    this.dataSource.data = this.filteredDataArr;
    this.dataService.updateData(this.filteredDataArr);
    console.log(this.dataSource.data);
  }

  getCardData() {
    this.dataService.currentData.subscribe(data => {
      this.dataSource.data = data;
    })
  }

  getCardImage(card: any) {
    return card.image_uris ? card.image_uris.normal : card.card_faces[0]?.image_uris?.normal;
  }

  setFilteredCardOptions(event: any) {
    this.filteredDataAutocompleteSearch = event;
    console.log(this.filteredDataAutocompleteSearch);
  }

  updateSearchSelection(event: MatSlideToggleChange) {
    console.log(event);
    this.autocompleteService.updateData(this.slideToggles);
  }

  openAdvancedSearch(event: Event) {
    this.advancedSearchOpen = !this.advancedSearchOpen;
  }

  updateSelectedColors(colorCode: string, event: MatCheckboxChange) {
    const colorObj = this.inputForm.getRawValue().colors;
    const colorMap = colorObj?.get(colorCode);
    colorObj?.set(colorCode, !colorMap);
    this.inputForm.patchValue({colors: colorObj});
  }

}

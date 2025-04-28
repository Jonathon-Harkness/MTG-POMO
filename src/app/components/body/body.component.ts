import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, OnChanges} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {delay, Observable, take} from 'rxjs';
import {ScryfallService} from '../../services/scryfall.service';
import { Data } from '../../interfaces/pomo.interface';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAutocomplete, MatOption} from '@angular/material/autocomplete';
import {AutocompleteSearchComponent} from '../autocomplete-search/autocomplete-search.component';
import {DataService} from '../../services/data.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {AdvancedSearchDropdownComponent} from '../advanced-search-dropdown/advanced-search-dropdown.component';
import {MatFormField} from '@angular/material/form-field';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {AutocompleteService} from '../../services/autocomplete.service';
import {MatInput} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {AdvancedSearchComponent} from '../advanced-search/advanced-search.component';


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
    AdvancedSearchComponent
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true
})
export class BodyComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Data>;
  isLoading: boolean = true;
  dataArr: any[] = [];
  selectedSearchOption: string = 'Name';
  advancedSearchOpen = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scryfallService: ScryfallService,
    private dataService: DataService,
    private autocompleteService: AutocompleteService,
  )
  { }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.getCardDataSearch();
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
    this.dataSource = new MatTableDataSource<Data>(this.dataArr);
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
    this.dataService.updateData(this.dataArr);
    this.isLoading = false;
    this.getCardData();
  }

  getCardData() {
    this.dataService.currentData.subscribe(data => {
      this.dataSource.data = data
    })
  }

  getCardImage(card: any) {
    return card.image_uris ? card.image_uris.normal : card.card_faces[0]?.image_uris?.normal;
  }

  updateSearchType(event: MatSelectChange) {
    this.autocompleteService.updateData(event.value);
  }

  openAdvancedSearch(event: MouseEvent) {
    this.advancedSearchOpen = !this.advancedSearchOpen;
  }
}

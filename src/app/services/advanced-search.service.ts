import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SearchFilter} from '../interfaces/pomo.interface';

@Injectable({
  providedIn: 'root',
})
export class AdvancedSearchService {

  private baseSearchFilter = {
    colorEnabled: false,
    colorSearchFilter: new Map([
      ["White", { colorCode: 'W', enabled: false }],
      ["Blue", { colorCode: 'U', enabled: false }],
      ["Black", { colorCode: 'B', enabled: false }],
      ["Red", { colorCode: 'R', enabled: false }],
      ["Green", { colorCode: 'G', enabled: false }],
      ["Colorless", { colorCode: 'C', enabled: false }],
    ])
  } as SearchFilter;

  private searchFilters = new BehaviorSubject<any>(this.baseSearchFilter);
  currentSearchFilters = this.searchFilters.asObservable();

  updateData(data: any) {
    console.log(data);
    this.searchFilters.next(data);
  }

  get currentValue() {
    return this.searchFilters.value;
  }

}

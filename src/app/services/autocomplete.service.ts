import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {

  private searchType = new BehaviorSubject<any>('Name');
  currentSearchType = this.searchType.asObservable();

  updateData(data: any) {
    this.searchType.next(data);
  }

  get currentValue() {
    return this.searchType.value;
  }

}

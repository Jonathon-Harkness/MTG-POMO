import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private dataSource = new BehaviorSubject<any>([]);
  currentData = this.dataSource.asObservable();

  updateData(data: any) {
    this.dataSource.next(data);
  }

  get currentValue() {
    return this.dataSource.value;
  }

}

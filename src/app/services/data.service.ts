import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {colorSearchFilter, SearchFilters} from '../interfaces/pomo.interface';

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

  arrayEquals(a:any, b:any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  filterData(obj: any, dataArr: any) {
    let newData = dataArr;

    if (obj.name) {
      newData = newData.filter((option: any) => option.name.toLowerCase().includes(obj.name.toLowerCase()));
    }
    if (obj.oracle_text) {
      newData = newData.filter((option: any) => (option.oracle_text ?? option.card_faces[0].oracle_text).toLowerCase().includes(obj.oracle_text.toLowerCase()));
    }
    if (obj.type) {
      newData = newData.filter((option: any) => (option.type_line ?? option.card_faces[0].type_line).toLowerCase().includes(obj.type.toLowerCase()));
    }

    // color filters, get all true keys
    if (obj.colors) {

      if (obj.colorSearchMode && obj.colorSearchMode === 'exact') {
        let trueColors: string[] = [];
        let allFalse = true;
        obj.colors.forEach((value: boolean, key: string) => {
          if (value) {
            allFalse = false;
            if (key != 'C') {
              trueColors.push(key);
            }
          }
        });
        if (!allFalse) {
          console.log(trueColors);
          console.log(newData);
          newData = newData.filter((option: any) => {
            trueColors.sort();
            const op = (option.colors ?? option.card_faces[0].colors).sort();
            // console.log('card sorted: ' + op)
            // console.log(trueColors);
            // console.log(this.arrayEquals(op, trueColors));
            return this.arrayEquals(op, trueColors);
          });
        }
      }
    }
    console.log(newData);
    this.updateData(newData);
  }

}

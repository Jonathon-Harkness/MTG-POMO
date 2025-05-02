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
      let allFalse = true;
      let trueColors: string[] = [];

      if (obj.colorSearchMode) {
        obj.colors.forEach((value: boolean, key: string) => {
          if (value) {
            allFalse = false;
            trueColors.push(key);
          }
        });
      }
      console.log(trueColors);

      if (obj.colorSearchMode && obj.colorSearchMode === 'exact') {
        trueColors = trueColors.filter(color => color != 'C');
        if (!allFalse) {
          trueColors.sort();
          newData = newData.filter((option: any) => {
            const op = (option.colors ?? option.card_faces[0].colors).sort();
            return this.arrayEquals(op, trueColors);
          });
        }
      } else if (obj.colorSearchMode && obj.colorSearchMode === 'including') {
        if (!allFalse) {
          newData = newData.filter((option: any) => {
            if (trueColors.includes('C') && trueColors.length === 1 && (option.colors ?? option.card_faces[0].colors).length === 0) {
              return true;
            }
            return trueColors.filter((color: string) => !(option.colors ?? option.card_faces[0].colors).includes(color)).length === 0;
          });
        }
      } else if (obj.colorSearchMode && obj.colorSearchMode === 'atMost') {
        if (!allFalse) {
          newData = newData.filter((option: any) => {
            return (option.colors ?? option.card_faces[0].colors).filter((color: string) => !trueColors.includes(color)).length === 0;
          });
        }
      }
    }

    // mana value
    if (obj.manaSearchType) {
      if (obj.manaSearchType === 'greater') {
        newData = newData.filter((option: any) => (option.cmc ?? option.card_faces[0].cmc) > obj.totalMana);
      } else if (obj.manaSearchType === 'less') {
        newData = newData.filter((option: any) => (option.cmc ?? option.card_faces[0].cmc) < obj.totalMana);
      } else if (obj.manaSearchType === 'equal') {
        newData = newData.filter((option: any) => (option.cmc ?? option.card_faces[0].cmc) === obj.totalMana);
      }
    }
    console.log(newData);
    this.updateData(newData);
  }

}

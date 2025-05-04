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
      if (obj.type[0] === '=') {
        newData = newData.filter((option: any) => {
          const splitAnd = obj.type.substring(1).split('|');
          const typeStr = (option.type_line ?? option.card_faces[0].type_line).toLowerCase();
          let notInString = false;
          //console.log('in')
          for (const searchValue of splitAnd) {
            if (!(searchValue.startsWith('"') && searchValue.endsWith('"'))) {
              //console.log('break');
              break;
            }
            console.log(searchValue);
            console.log(typeStr);
            if (searchValue[1] === '!') {
              const searchVal = searchValue.substring(2, searchValue.length - 2);
              if (!typeStr.includes(searchVal.toLowerCase())) {
                notInString = true;
              }
            }
            else {
              const searchVal = searchValue.substring(1, searchValue.length - 2);
              if (typeStr.includes(searchVal.toLowerCase())) {
                notInString = true;
              }
            }
          }
          return notInString;
        })
      } else {
        newData = newData.filter((option: any) => (option.type_line ?? option.card_faces[0].type_line).toLowerCase().includes(obj.type.toLowerCase()));
      }
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

    // sort by
    if (obj.sort) {
      switch (obj.sort) {
        case 'A-Z':
          newData.sort((a: any, b: any) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          break;
        case 'Z-A':
          newData.sort((a: any, b: any) => {
            if (a.name < b.name) return 1;
            if (a.name > b.name) return -1;
            return 0;
          });
          break;
        case 'lowMana':
          newData.sort((a: any, b: any) => {
            if ((a.cmc ?? a.card_faces[0].cmc) < (b.cmc ?? b.card_faces[0].cmc)) return -1;
            if ((a.cmc ?? a.card_faces[0].cmc) > (b.cmc ?? b.card_faces[0].cmc)) return 1;
            return 0;
          });
          break;
        case 'highMana':
          newData.sort((a: any, b: any) => {
            if ((a.cmc ?? a.card_faces[0].cmc) < (b.cmc ?? b.card_faces[0].cmc)) return 1;
            if ((a.cmc ?? a.card_faces[0].cmc) > (b.cmc ?? b.card_faces[0].cmc)) return -1;
            return 0;
          });
          break;
      }
    }
    console.log(newData);
    this.updateData(newData);
  }

}

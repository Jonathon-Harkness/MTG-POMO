import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable} from 'rxjs'
import { pomo_cardNames } from '../constants/pomo.constants';
import { Data, Name } from '../interfaces/pomo.interface';

@Injectable({
  providedIn: 'root',
})
export class ScryfallService {
  private apiUrl = 'https://api.scryfall.com/';

  constructor(private http: HttpClient) { }

  getAllCards(): Observable<any> {
    const data: Data = {
      identifiers: []
    };
    for (const card of pomo_cardNames) {
      data.identifiers.push({ name: card } as Name)
    }

    const data1: Data = {
      identifiers: data.identifiers.slice(0, 40)
    }
    const data2: Data = {
      identifiers: data.identifiers.slice(40)
    }

    const sources = [
      this.getPomoCards(data1),
      this.getPomoCards(data2)
    ]

    return forkJoin(sources)
  }

  getPomoCards(data: Data): Observable<any> {
    console.log(data)
    return this.http.post(`${this.apiUrl}/cards/collection`, data);
  }
}

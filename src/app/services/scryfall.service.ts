import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable} from 'rxjs'
import { pomo_cardNames } from '../constants/pomo.constants';
import { Data, Name } from '../interfaces/pomo.interface';

export interface pomoCardSearch {
  data: any[],
  has_more: boolean,
  next_page: string
}

@Injectable({
  providedIn: 'root',
})
export class ScryfallService {
  private apiUrl = 'https://api.scryfall.com';
  private searchPathBase = 'cards/search?q=legal%3Avintage+(is%3Aub+or+set%3Asld+or+set%3Aslc+or+set%3Aslu+or+set%3Aslp+or+is%3Agodzilla+or+is%3Adracula+or+is%3Apagl+or+is%3Aphed+or+is%3Apctb)+-!"sol+ring"+-!"mana+vault"+-!"the+one+ring"+-!"strip+mine"+-!wasteland+-!"mental+misstep"&unique=cards&as=grid&order=name';
  private searchPath = 'cards/search?q=legal%3Avintage+(is%3Aub+or+set%3Asld+or+set%3Aslc+or+set%3Aslu+or+set%3Aslp+or+is%3Agodzilla+or+is%3Adracula+or+is%3Apagl+or+is%3Aphed+or+is%3Apctb)+-!"sol+ring"+-!"mana+vault"+-!"the+one+ring"+-!"strip+mine"+-!wasteland+-!"mental+misstep"&unique=cards&as=grid&order=name';

  constructor(private http: HttpClient) { }

  bulkDataArr = []

  getAllCards(): Observable<any> {
    this.bulkDataArr = [];
    this.searchPath = this.searchPathBase;
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
      this.getPomoCards(data2),
    ]

    return forkJoin(sources)
  }

  getPomoCards(data: Data): Observable<any> {
    return this.http.post(`${this.apiUrl}/cards/collection`, data);
  }

  getPomoCardSets(searchPath: string): Observable<any> {
    return this.http.get(`${searchPath}`);
  }
}

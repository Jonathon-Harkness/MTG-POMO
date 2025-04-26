import {Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, OnChanges} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {concat, Observable, take} from 'rxjs';
import {ScryfallService} from '../../services/scryfall.service';
import { Data, Name } from '../../interfaces/pomo.interface';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-body',
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatCardTitle,
    MatPaginator,
    MatPaginator,
    CommonModule,
    MatCardImage,
    RouterLink,
    MatProgressSpinner
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
  private dataArr: any[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scryfallService: ScryfallService)
  { }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    //this.getCardData();
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
    this.scryfallService.getPomoCardSets(searchPath).pipe(take(1)).subscribe(res => {
      this.dataArr.push(...res.data);
      if (res.has_more) {
        this.getCardDataSearchCall(res.next_page);
      } else {
        this.getCardData();
      }
    })
  }

  getCardData() {
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
    this.isLoading = false;
  }

  getCardImage(card: any) {
    return card.image_uris ? card.image_uris.normal : card.card_faces[0]?.image_uris?.normal;
  }

}

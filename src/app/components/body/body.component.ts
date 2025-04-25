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

export interface Card {
  title: string;
  subtitle: string;
  text: string;
}

const DATA: Card[] = [
  {
    title: 'Shiba Inu 1',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 2',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 3',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 4',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 5',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 6',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 7',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 8',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 9',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  },
  {
    title: 'Shiba Inu 10',
    subtitle: 'Dog Breed',
    text: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.'
  }
];


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
    MatCardImage
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  standalone: true
})
export class BodyComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Data>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scryfallService: ScryfallService)
  { }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.getCardData();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  getCardData() {
    this.scryfallService.getAllCards().pipe(take(1)).subscribe(data => {
      console.log(data);
      const combinedObj = [...data[0].data, ...data[1].data];
      console.log(combinedObj);

      this.dataSource = new MatTableDataSource<Data>(combinedObj);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    })
  }
}

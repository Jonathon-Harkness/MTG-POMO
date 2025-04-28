import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-advanced-search',
  imports: [MatCheckboxModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
  standalone: true
})
export class AdvancedSearchComponent {

}

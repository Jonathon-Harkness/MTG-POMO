import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchDropdownComponent } from './advanced-search-dropdown.component';

describe('AdvancedSearchDropdownComponent', () => {
  let component: AdvancedSearchDropdownComponent;
  let fixture: ComponentFixture<AdvancedSearchDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSearchDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

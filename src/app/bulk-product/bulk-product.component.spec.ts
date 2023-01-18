import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkProductComponent } from './bulk-product.component';

describe('BulkProductComponent', () => {
  let component: BulkProductComponent;
  let fixture: ComponentFixture<BulkProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

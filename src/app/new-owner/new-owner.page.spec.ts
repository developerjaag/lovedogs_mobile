import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOwnerPage } from './new-owner.page';

describe('NewOwnerPage', () => {
  let component: NewOwnerPage;
  let fixture: ComponentFixture<NewOwnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOwnerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPetPage } from './new-pet.page';

describe('NewPetPage', () => {
  let component: NewPetPage;
  let fixture: ComponentFixture<NewPetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShedulePage } from './new-shedule.page';

describe('NewShedulePage', () => {
  let component: NewShedulePage;
  let fixture: ComponentFixture<NewShedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewShedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewShedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

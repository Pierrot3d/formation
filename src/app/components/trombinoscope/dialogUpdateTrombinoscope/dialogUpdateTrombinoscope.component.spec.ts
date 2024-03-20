/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogUpdateTrombinoscopeComponent } from './dialogUpdateTrombinoscope.component';

describe('DialogUpdateTrombinoscopeComponent', () => {
  let component: DialogUpdateTrombinoscopeComponent;
  let fixture: ComponentFixture<DialogUpdateTrombinoscopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpdateTrombinoscopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateTrombinoscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormationService } from './formation.service';

describe('Service: Formation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormationService]
    });
  });

  it('should ...', inject([FormationService], (service: FormationService) => {
    expect(service).toBeTruthy();
  }));
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PageGeneratorService } from './page-generator.service';

describe('Service: PageGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageGeneratorService]
    });
  });

  it('should ...', inject([PageGeneratorService], (service: PageGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});

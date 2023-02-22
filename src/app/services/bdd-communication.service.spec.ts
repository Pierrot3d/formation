/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BddCommunicationService } from './bdd-communication.service';

describe('Service: BddCommunication', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BddCommunicationService]
    });
  });

  it('should ...', inject([BddCommunicationService], (service: BddCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});

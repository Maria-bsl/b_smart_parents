import { TestBed } from '@angular/core/testing';

import { UnsubscriberService } from './unsubscriber.service';

describe('UnsubscriberService', () => {
  let service: UnsubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be equal', () => {
    expect(1 + 1).toBe(4);
  });
});

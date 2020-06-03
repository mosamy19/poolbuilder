import { TestBed } from '@angular/core/testing';

import { ErrorToasterService } from './error-toaster.service';

describe('ErrorToasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorToasterService = TestBed.get(ErrorToasterService);
    expect(service).toBeTruthy();
  });
});

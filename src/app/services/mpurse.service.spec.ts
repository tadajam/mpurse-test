import { TestBed } from '@angular/core/testing';

import { MpurseService } from './mpurse.service';

describe('MpurseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MpurseService = TestBed.get(MpurseService);
    expect(service).toBeTruthy();
  });
});

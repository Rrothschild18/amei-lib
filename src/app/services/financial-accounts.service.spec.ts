import { TestBed } from '@angular/core/testing';

import { FinancialAccountsService } from './financial-accounts.service';

describe('FinancialAccountsService', () => {
  let service: FinancialAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

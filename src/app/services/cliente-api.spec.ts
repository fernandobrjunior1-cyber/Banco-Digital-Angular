import { TestBed } from '@angular/core/testing';
import { ClienteApi } from './cliente-api';

describe('ClienteApi', () => {
  let service: ClienteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

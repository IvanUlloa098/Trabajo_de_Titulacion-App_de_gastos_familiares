import { TestBed } from '@angular/core/testing';

import { PresupuestosService } from './presupuestos.service';

describe('PresupuestosService', () => {
  let service: PresupuestosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresupuestosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

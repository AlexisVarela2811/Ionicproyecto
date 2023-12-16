import { TestBed } from '@angular/core/testing';
import { ApiserviceService } from './apiservice.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApiserviceService', () => {
  let service: ApiserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule para simular solicitudes HTTP
      providers: [ApiserviceService],
    });
    service = TestBed.inject(ApiserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HistoricalWeatherService } from './historical-weather.service';

describe('HistoricalWeatherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoricalWeatherService = TestBed.get(HistoricalWeatherService);
    expect(service).toBeTruthy();
  });
});

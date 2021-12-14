import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AdministratorService } from '../service/administrator.service';

import { AdministratorComponent } from './administrator.component';

describe('Administrator Management Component', () => {
  let comp: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;
  let service: AdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdministratorComponent],
    })
      .overrideTemplate(AdministratorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdministratorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdministratorService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.administrators?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

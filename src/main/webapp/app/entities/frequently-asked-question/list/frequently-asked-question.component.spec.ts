import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FrequentlyAskedQuestionService } from '../service/frequently-asked-question.service';

import { FrequentlyAskedQuestionComponent } from './frequently-asked-question.component';

describe('FrequentlyAskedQuestion Management Component', () => {
  let comp: FrequentlyAskedQuestionComponent;
  let fixture: ComponentFixture<FrequentlyAskedQuestionComponent>;
  let service: FrequentlyAskedQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FrequentlyAskedQuestionComponent],
    })
      .overrideTemplate(FrequentlyAskedQuestionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FrequentlyAskedQuestionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FrequentlyAskedQuestionService);

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
    expect(comp.frequentlyAskedQuestions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

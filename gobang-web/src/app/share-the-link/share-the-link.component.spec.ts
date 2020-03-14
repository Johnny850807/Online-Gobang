import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTheLinkComponent } from './share-the-link.component';

describe('ShareTheLinkComponent', () => {
  let component: ShareTheLinkComponent;
  let fixture: ComponentFixture<ShareTheLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTheLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTheLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

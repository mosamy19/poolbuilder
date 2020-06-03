import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProjectsListPage } from './projects-list.page';

describe('ProjectsListPage', () => {
  let component: ProjectsListPage;
  let fixture: ComponentFixture<ProjectsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

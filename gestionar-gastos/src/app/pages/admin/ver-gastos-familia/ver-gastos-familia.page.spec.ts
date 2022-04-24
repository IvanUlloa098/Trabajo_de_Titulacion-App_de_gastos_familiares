import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerGastosFamiliaPage } from './ver-gastos-familia.page';

describe('VerGastosFamiliaPage', () => {
  let component: VerGastosFamiliaPage;
  let fixture: ComponentFixture<VerGastosFamiliaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerGastosFamiliaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerGastosFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

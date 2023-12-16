import { ComponentFixture, TestBed} from '@angular/core/testing';
import { MenuPage } from './menu.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations:[MenuPage],
      imports:[IonicModule.forRoot(),HttpClientModule],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

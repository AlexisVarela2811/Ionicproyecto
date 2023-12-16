import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ServicioDBService } from 'src/app/services/servicio-db.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  const mockNavController = {
    navigateForward: jasmine.createSpy('navigateForward')
  };

  const mockServicioDB = jasmine.createSpyObj('ServicioDBService', ['insertarUsuarios', 'presentAlert']);
  mockServicioDB.insertarUsuarios.and.returnValue(Promise.resolve(true)); // Adjust this based on your service

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegistroPage],
        imports: [IonicModule.forRoot(), ReactiveFormsModule],
        providers: [
          FormBuilder,
          { provide: NavController, useValue: mockNavController },
          { provide: ServicioDBService, useValue: mockServicioDB },
          SQLite, 
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(RegistroPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('llama a servicioDB.insertarUsuarios en registrarse()', async () => {
    component.registroForm.setValue({
      nombre: 'TestName',
      email: 'test@example.com',
      password: '1234',
    });

    await component.registrarse();

    expect(mockServicioDB.insertarUsuarios).toHaveBeenCalledWith('TestName', 'test@example.com', '1234');
  });

  it('navega luego a "/login" despues de un registro exitoso', async () => {
    component.registroForm.setValue({
      nombre: 'TestName',
      email: 'test@example.com',
      password: '1234',
    });

    await component.registrarse();

    expect(mockNavController.navigateForward).toHaveBeenCalledWith('/login');
  });
});

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ServicioDBService } from 'src/app/services/servicio-db.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  usNombre = "";
  usPassword = "";

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController, private servicioDB: ServicioDBService) {
    this.loginForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.loginForm.get('nombre')?.valueChanges.subscribe(value => this.usNombre = value);
    this.loginForm.get('password')?.valueChanges.subscribe(value => this.usPassword = value);
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      this.servicioDB.cuentasUsuarios(this.usNombre, this.usPassword).then(usuario => {
        if (usuario) {
          // Usuario encontrado, puedes continuar con el inicio de sesión
          this.servicioDB.presentAlert("Inicio de sesion correctamente ");
          this.navCtrl.navigateForward('/menu'); // Redirige a la página del menú después del inicio de sesión
        } else {
          // Usuario no encontrado, mostrar mensaje de error
          this.servicioDB.presentAlert("Usuario no encontrado");
        }
      });
    }
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ServicioDBService } from 'src/app/services/servicio-db.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage {
  registroForm: FormGroup;

  usNombre = "";
  usEmail = "";
  usPassword = "";
  

  constructor(private formBuilder: FormBuilder,private navCtrl: NavController,private servicioDB: ServicioDBService
  ) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('[0-9]{4}'), Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.registroForm.get('nombre')?.valueChanges.subscribe(value => this.usNombre = value);
    this.registroForm.get('email')?.valueChanges.subscribe(value => this.usEmail = value);
    this.registroForm.get('password')?.valueChanges.subscribe(value => this.usPassword = value);
  }

  registrarse() {
    if (this.registroForm.valid) {
      // Llamar al método de tu servicio para insertar el usuario en la base de datos
      this.servicioDB.insertarUsuarios(this.usNombre, this.usEmail, this.usPassword)
        .then((insertado) => {
          if (insertado) {
            // El usuario se insertó correctamente
            this.servicioDB.presentAlert("Usuario creado");
            this.navCtrl.navigateForward('/login'); // Redirige a la página de inicio de sesión después del registro
          } else {
            // El usuario ya existe
            this.servicioDB.presentAlert("Usuario ya existe con los mismos datos");
          }
        })
        .catch(() => {
          this.servicioDB.presentAlert("Error al crear usuario");
        });
    }
  }
}
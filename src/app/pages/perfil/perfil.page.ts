import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class perfilPage implements OnInit {
  userId: string = "";
  userName: string = "";

  constructor(
    private animationCtrl: AnimationController,
    private alertController: AlertController,

  ) {}

  limpiarInputs() {
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const apellidoInput = document.getElementById(
      'apellido'
    ) as HTMLInputElement;

    const animation = this.animationCtrl
      .create()
      .addElement(nombreInput)
      .addElement(apellidoInput)
      .duration(1000)
      .iterations(1)
      .fromTo('transform', 'translateX(0)', 'translateX(100%)');

    animation.play();

    setTimeout(() => {
      nombreInput.value = '';
      apellidoInput.value = '';
    }, 1000);
  }

  async mostrarInformacion() {
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const apellidoInput = document.getElementById(
      'apellido'
    ) as HTMLInputElement;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;

    const alert = await this.alertController.create({
      header: 'Usuario',
      message: `Su Nombre es: ${nombre} ${apellido}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ngOnInit() {

  }
}

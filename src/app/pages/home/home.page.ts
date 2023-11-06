import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuarioRecibido: string = "";

  constructor(private animationCtrl: AnimationController, private alertController: AlertController, private router: Router, private activerouter: ActivatedRoute) {
    this.activerouter.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras?.state) {
        this.usuarioRecibido=this.router.getCurrentNavigation()?.extras?.state?.['usuarioEnviado']
      }
    });
  }
  limpiarInputs() {
    
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const apellidoInput = document.getElementById('apellido') as HTMLInputElement;
    
    const animation = this.animationCtrl.create()
      .addElement(nombreInput)
      .addElement(apellidoInput)
      .duration(1000) 
      .iterations(1) 
      .fromTo('transform', 'translateX(0)', 'translateX(100%)')
     
    animation.play();
  
    setTimeout(() => {
      nombreInput.value = '';
      apellidoInput.value = '';
    }, 1000); 
  }
  async mostrarInformacion() {
    
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const apellidoInput = document.getElementById('apellido') as HTMLInputElement;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
  
    
    const alert = await this.alertController.create({
      header: 'Usuario',
      message: `Su Nombre es: ${nombre} ${apellido}`,
      buttons: ['OK']
    });
  
    
    await alert.present();
  }

  ngOnInit() {
 }
}

import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: string = "";
  password: string = "";
  constructor(private router: Router) { }

  ngOnInit() {
  }

  iniciarSession() {
    let navigateExtras:NavigationExtras={
      state:{
        usuarioEnviado:this.usuario
      }
    }
    this.router.navigate(['/home'],navigateExtras);
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  meals: any[] = [];
  searchTerm: string = '';
  filteredMeals: any[] = [];

  constructor(private api: ApiserviceService, private carritoService: CarritoService, private navCtrl: NavController) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.api.getMealsPrecios().subscribe((data) => {
      this.meals = data;
      this.filteredMeals = data;
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarAlCarrito(producto);
  }

  irAlCarrito() {
    this.navCtrl.navigateForward('/carrito');
  }

  ionViewWillEnter() {
    this.obtenerProductos();
  }

  filtrarProductos(event: any) {
    this.searchTerm = event.detail.value;
    this.filteredMeals = this.meals.filter((meal) =>
      meal.strMeal.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}




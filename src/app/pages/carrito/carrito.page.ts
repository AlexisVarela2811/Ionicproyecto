import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  productos: any[] = [];
  precioTotal: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.obtenerCarrito();
    this.actualizarPrecioTotal();
  }

  obtenerCarrito() {
    this.productos = this.carritoService.obtenerCarrito();
  }

  eliminarDelCarrito(producto: any) {
    this.carritoService.eliminarDelCarrito(producto);
    this.obtenerCarrito();
    this.actualizarPrecioTotal();
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.carritoService.obtenerPrecioTotal();
  }
}
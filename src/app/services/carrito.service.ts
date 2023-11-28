import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  productos: any[] = [];

  agregarAlCarrito(producto: any) {
    this.productos.push(producto);
  }

  eliminarDelCarrito(producto: any) {
    const index = this.productos.indexOf(producto);
    if (index !== -1) {
      this.productos.splice(index, 1);
    }
  }

  obtenerCarrito() {
    return this.productos;
  }

  obtenerPrecioTotal(): number {
    return this.productos.reduce((total, producto) => total + producto.price, 0);
  }

  limpiarCarrito() {
    this.productos = [];
    return this.productos;
  }
}
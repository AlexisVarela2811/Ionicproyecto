import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  private productosKey = 'productos';

  constructor(private http: HttpClient) {}

  private guardarProductosEnLocalStorage(productos: any[]): void {
    localStorage.setItem(this.productosKey, JSON.stringify({ meals: productos, timestamp: new Date().getTime() }));
  }

  private obtenerProductosDesdeLocalStorage(): any {
    const storedData = localStorage.getItem(this.productosKey);
    return storedData ? JSON.parse(storedData) : { meals: [], timestamp: 0 };
  }

  getMeals(): Observable<any> {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
    const storedData = this.obtenerProductosDesdeLocalStorage();

    // Verifica si los datos almacenados están actualizados
    if (this.datosNecesitanActualizar(storedData)) {
      return this.http.get(url).pipe(
        tap((data: any) => {
          if (data && data.meals) {
            this.guardarProductosEnLocalStorage(data.meals);
          }
        }),
        catchError(() => of(storedData.meals || []))
      );
    } else {
      // Si los datos están actualizados, retorna los datos almacenados
      return of(storedData.meals || []);
    }
  }

  getMealsPrecios(): Observable<any[]> {
    return this.getMeals().pipe(
      map((data: any) => this.addPreciosLocales(data))
    );
  }

  private addPreciosLocales(meals: any[]): any[] {
    // Verifica si 'meals' es un array antes de iterar sobre él
    if (Array.isArray(meals)) {
      // Asocia cada plato con su precio local
      for (const meal of meals) {
        const mealName = meal.strMeal;
        meal.price = this.obtenerPrecioAleatorio(); // Asigna un precio aleatorio entre 5000 y 20000
      }
    }
    return meals;
  }

  private obtenerPrecioAleatorio(): number {
    // Devuelve un precio aleatorio entre 5000 y 20000
    return Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
  }

  // Verifica si los datos necesitan actualizarse basándose en un timestamp
  private datosNecesitanActualizar(storedData: any): boolean {
    const tiempoLimite = 24 * 60 * 60 * 1000; // Tiempo límite de 24 horas en milisegundos

    return (
      !storedData.timestamp ||
      (new Date().getTime() - storedData.timestamp) > tiempoLimite
    );
  }
}
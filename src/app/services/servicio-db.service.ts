import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { scan, take } from 'rxjs/operators';
import { Usuarios } from './usuarios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ServicioDBService {
  public database!: SQLiteObject;
  tablaUsuario: string =
    "CREATE TABLE IF NOT EXISTS Usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,nombre VARCHAR(40) NOT NULL, correo VARCHAR(40) NOT NULL, contraseña VARCHAR(40) NOT NULL);";
  
  private listaUsuariosSubject = new Subject<Usuarios[]>();
  public listaUsuarios$: Observable<Usuarios[]> = this.listaUsuariosSubject.asObservable();

  private isDBReady: Subject<boolean> = new Subject<boolean>();
  public isDBReady$: Observable<boolean> = this.isDBReady.asObservable();

  constructor(private alertController: AlertController, private sqlite: SQLite, private platform: Platform) {
    this.crearBD();
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'aleexiib.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.crearTablas();
      }).catch(e => {
        this.presentAlert("Error en la Base de Datos: " + JSON.stringify(e));
      })
    }).catch(e => {
      this.presentAlert("Error en la aplicacion: " + JSON.stringify(e));
    })
  }

  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaUsuario, []);
      this.buscarUsuarios();
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert("Error en Tablas de base de datos:" + JSON.stringify(e));
    }
  }

  async buscarUsuarios() {
    try {
      const res = await this.database.executeSql('SELECT * FROM Usuarios', []);
      const usuarios: Usuarios[] = [];

      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push({
          id_usuario: res.rows.item(i).id_usuario,
          nombre: res.rows.item(i).nombre,
          correo: res.rows.item(i).correo,
          contraseña: res.rows.item(i).contraseña
        });
      }

      this.listaUsuariosSubject.next(usuarios);
    } catch (e) {
      this.presentAlert("Error al buscar usuarios: " + JSON.stringify(e));
    }
  }

  cuentasUsuarios(nombre: string, contraseña: string) {
    const query = 'SELECT * FROM Usuarios WHERE nombre = ? AND contraseña = ?';

    return this.database.executeSql(query, [nombre, contraseña]).then(res => {
      if (res.rows.length > 0) {
        return {
          id_usuario: res.rows.item(0).id_usuario,
          nombre: res.rows.item(0).nombre,
          correo: res.rows.item(0).correo,
          contraseña: res.rows.item(0).contraseña
        };
      } else {
        return null;
      }
    }).catch(error => {
      this.presentAlert("Error al buscar usuario" + JSON.stringify(error));
      return null;
    });
  }

  async insertarUsuarios(nombre: any, correo: any, contraseña: any) {
    try {
      const res = await this.database.executeSql('SELECT * FROM Usuarios WHERE nombre = ? AND correo = ?', [nombre, correo]);

      if (res.rows.length === 0) {
        await this.database.executeSql('INSERT INTO Usuarios(nombre, correo, contraseña) VALUES (?, ?, ?)', [nombre, correo, contraseña]);
        await this.buscarUsuarios();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.presentAlert("Error al verificar/insertar usuario" + JSON.stringify(error));
      return false;
    }
  }

  // A futuro aplicaré esta operación
  modificarUsuario() {}
}

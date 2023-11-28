import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuarios } from './usuarios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ServicioDBService {
  //variable de conexion db
  public database!: SQLiteObject;

  //creacion de tb
  //para guardar img tipo de datos es BLOB
  tablaUsuario: string =
    "CREATE TABLE IF NOT EXISTS Usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,nombre VARCHAR(40) NOT NULL, correo VARCHAR(40) NOT NULL, contraseña VARCHAR(40) NOT NULL);";
  

  //insert a tablas
  

  //observable para manipular tabla productos
  listaUsuarios = new BehaviorSubject([]);
  

  //observable para manipular si la BD esta lista o no para su manipulacion
  private isDBReady:BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private alertController: AlertController, private sqlite: SQLite, private platform: Platform) {
    this.crearBD();
  }
  

  async presentAlert(msj:string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  //función para suscribirme al observable de la  DB
  dbState(){
    return this.isDBReady.asObservable();
  }

  fetchUsuarios(): Observable<Usuarios[]> {
    return this.listaUsuarios.asObservable();
  }


  
crearBD(){
    //verificamos que la plataforma este rady
    this.platform.ready().then(()=>{
      //creamios BD
      this.sqlite.create({
        name:'aleexib.db',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //guardo mi conexion en mi variable 
        this.database = db;
        //mando a crear las tablas
        this.crearTablas();
      }).catch(e=>{
        this.presentAlert("Error en la Base de Datos: " + JSON.stringify(e));
      })
    }).catch(e=>{
      this.presentAlert("Error en la aplicacion: " + JSON.stringify(e));
    })
  }

async crearTablas(){
      try{
        //ejecutar la creacion de tablas 
        await this.database.executeSql(this.tablaUsuario,[]);
        //ejecutar los registros iniciales

        //le digo al programa que la BD esta rady
        
        this.buscarUsuarios();
        this.isDBReady.next(true);

      }catch(e){
        this.presentAlert("Error en Tablas de base de datos:"+ JSON.stringify(e));
      }
    }
    //USUARIO
    buscarUsuarios(){
      //retorno la ejecucion del select
      return this.database.executeSql('SELECT * FROM Usuarios',[]).then(res =>{
        //creo mi lista de objetos de usuarios vacio
        let items: Usuarios [] = [];
        //si cuenta mas o 0 filas en rusultSet entonces agrego los registros
        if(res.rows.length > 0){
          for (var i = 0; i < res.rows.length; i++){
            items.push({
              id_usuario: res.rows.item(i).id_usuario,
              nombre: res.rows.item(i).nombre,
              correo: res.rows.item(i).correo,
              contraseña: res.rows.item(i).contraseña
            });
          }
        }
        //actualizamos el observable de usuarios
        this.listaUsuarios.next(items as any);
        });
      }

      //cuenta
      cuentasUsuarios(nombre: string, contraseña: string) {
        return this.database.executeSql('SELECT * FROM Usuarios WHERE nombre = ? AND contraseña = ?', [nombre, contraseña])
          .then(res => {
            if (res.rows.length > 0) {
              // Usuario encontrado, puedes devolver los datos del usuario
              return {
                id_usuario: res.rows.item(0).id_usuario,
                nombre: res.rows.item(0).nombre,
                correo: res.rows.item(0).correo,
                contraseña: res.rows.item(0).contraseña
              };
            } else {
              // Usuario no encontrado
              return null;
            }
          })
          .catch(error => {
            this.presentAlert("Error al buscar usuario" + JSON.stringify(error));
            return null;
          });
      }
      
      //registrar
      insertarUsuarios(nombre: any, correo: any, contraseña: any) {
        // Verificar si el usuario ya existe
        return this.database.executeSql('SELECT * FROM Usuarios WHERE nombre = ? AND correo = ?', [nombre, correo])
          .then(res => {
            if (res.rows.length === 0) {
              // El usuario no existe, entonces podemos insertarlo
              return this.database.executeSql('INSERT INTO Usuarios(nombre, correo, contraseña) VALUES (?, ?, ?)', [nombre, correo, contraseña])
                .then(() => {
                  this.buscarUsuarios();
                  return true; // Indica que el usuario se insertó correctamente
                })
                .catch(error => {
                  this.presentAlert("Error al insertar usuario" + JSON.stringify(error));
                  return false; // Indica que hubo un error al insertar el usuario
                });
            } else {
              // El usuario ya existe
              return false; // Indica que el usuario ya existe
            }
          })
          .catch(error => {
            this.presentAlert("Error al verificar usuario" + JSON.stringify(error));
            return false; // Indica que hubo un error al verificar el usuario
          });
      }
      
    //a futuro aplicare esta operacion
    modificarUsuario(){

    }

}

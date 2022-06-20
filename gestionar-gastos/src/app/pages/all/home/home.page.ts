import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, MenuController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { GastosService } from 'src/app/services/gastos.service';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  private sessionEmail: any
  private sessionUser : any
  
  gastos:any
  usuarios:any

  constructor(public menuCtrl: MenuController,
              private auth :  AuthenticationService,
              private router: Router,
              private loadingController: LoadingController,
              private userService: UserService,
              private gastoService: GastosService,
              private localNotifications: LocalNotifications,
              private routerOutlet: IonRouterOutlet) { 
                this.routerOutlet.swipeGesture = false
              }

  async ngOnInit() {
    
    // Control de la interacción del usuario usando una rueda de carga
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 

        // Garantizar una conexión estable con Firebase implementando un regtraso
       

          // Obtención del usuario que actualmente tiene la sesión abierta
          await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{
            
            // Control de errores
            try {
              this.sessionEmail = user.email
              this.menuCtrl.enable(true) // Visualizar el menú solo al iniciar sesión
              
              // Obtener los datos del usurio de FireStore dado- 
              //    el email proporcionado por la API de autentificación
              this.sessionUser = await this.auth.getUsuario(this.sessionEmail)
        
              await this.sessionUser.pipe(take(1)).subscribe(async res=> {
                
                //  Actualizar la págicna con las opciones del menpu de acuerdo a su rol
                if(!this.auth.sideMenu) {
                  window.location.reload();
                }
                
                // Verificar si el usuario está asignado a una familia
                if(res[0].id_familia === '-1'){
                  this.router.navigate(["/login"])
                }

                // Verificar si el usuario tiene un rolde administrador
                if(res[0].role == "A"){
                  // Obtención de los datos de toda la familia
                  this.usuarios = this.gastoService.obtenerusrFamilia(res[0].id_familia)    

                  //  Todos los gastos familiares serán mostrados
                  this.usuarios.pipe().subscribe(async user =>{
                    this.gastos = this.gastoService.obtenerGastos(user[0].uid)

                    this.gastos.pipe(take(1)).subscribe(async gasto =>{

                      for (let index = 0; index < gasto.length; index++) {
                        let fecha=new Date(gasto[index].fecha);
                        this.localNotifications.schedule({
                        text: "Gasto Registrado"+gasto[index].descripcion+"\n De: "+gasto[index].monto,
                        trigger: {at: fecha},                 
                      });

                      }
                    })            
                  })
                }else {

                  //  Obtención de todos los datos personales
                  this.gastos=this.gastoService.obtenerGastos(res[0].uid) 

                  //  Mostrar gastos personales
                  this.gastos.forEach(element => {
                    for (let index = 0; index < element.length; index++) {
                      let fecha=new Date(element[index].fecha);
                      this.localNotifications.schedule({
                        text: "Gasto Registrado"+element[index].descripcion+"\n De: "+element[index].monto,
                        trigger: {at: fecha},                 
                     });
                    }
                  });
                }
               
  
              }) 
            } catch (error) {
              console.log(error);
              this.router.navigate(["/login"])
            }finally {
              //  Terminar la carga de la página
              a.dismiss().then(() => console.log('abort presenting'));
              
            }
  
          })

       

      }) 

    })

  
  } 

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  async cargarNotificaciones(){
    
  }

}

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

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 
        await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{
          console.log('FLAG MENU> '+this.auth.sideMenu)
          try {
            this.sessionEmail = user.email
            this.menuCtrl.enable(true)
    
            this.sessionUser = await this.auth.getUsuario(this.sessionEmail)
      
            await this.sessionUser.pipe(take(1)).subscribe(async res=> {
              console.log('HERE '+res[0].email)

              if(!this.auth.sideMenu) {
                console.log('reload!')
                window.location.reload();
              }

              if(res[0].id_familia === '-1'){
                this.router.navigate(["/login"])
              }
              if(res[0].role=="A"){
                this.usuarios=this.gastoService.obtenerusrFamilia(res[0].id_familia)          
                this.usuarios.pipe().subscribe(async user =>{
                  this.gastos=this.gastoService.obtenerGastos(user[0].uid)
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
                this.gastos=this.gastoService.obtenerGastos(res[0].uid)              
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

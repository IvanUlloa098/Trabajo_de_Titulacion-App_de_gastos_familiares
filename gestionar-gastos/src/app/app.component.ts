import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  private name: any
  private email: any
  private sessionUser : any

  public appPages: any

  private appPagesAdmin = [
    { title: 'Inicio', url: '/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/profile', icon: 'build-outline' },
    { title: 'Miembros', url: '/list-familymembers', icon: 'people-circle-outline' },
    { title: 'Registrar Presupuestos', url: '/registrar-presupuestos', icon: 'wallet-outline' },
    { title: 'Registrar Gasto', url: '/registrar-gasto', icon: 'cash-outline' },
    { title: 'Modificar Familia', url: '/update-family', icon: 'people-outline' },
    { title: 'Ver Gastos Familia', url: '/ver-gastos-familia', icon: 'list-outline' },
    { title: 'Ver Gastos Personales', url: '/ver-gastos', icon: 'list-outline' },
    { title: 'Ver Presupuestos', url: '/ver-presupuestos', icon: 'pricetags-outline' },
    { title: 'Reporte Gastos/Presupuestos', url: '/reporte-gastos-admin', icon: 'bar-chart-outline' },
    { title: 'Predicción de gastos', url: '/spence-prediction', icon: 'analytics-outline' }
  ];

  private appPagesUser = [
    { title: 'Inicio', url: '/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/profile', icon: 'person-circle-outline' },
    { title: 'Registrar Gastos', url: '/registrar-gasto', icon: 'cash-outline' },
    { title: 'Ver Gastos', url: '/ver-gastos', icon: 'wallet-outline' },
    { title: 'Ver Presupuestos', url: '/ver-presupuestos', icon: 'pricetags-outline' } ,   
  ];

  constructor(private auth :  AuthenticationService,
              private loadingController: LoadingController) {}

  async ngOnInit() {
    await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{
      try {
        this.email = user.email

        this.sessionUser = await this.auth.getUsuario(this.email)
  
        await this.sessionUser.pipe(take(1)).subscribe(res=> {
          console.log('HERE '+res[0].email)
          this.name = res[0].displayName

          if(res[0].role === 'A') {
            this.appPages = this.appPagesAdmin
          } else {
            this.appPages = this.appPagesUser
          }

          this.auth.sideMenu = true

        }) 
      } catch (error) {
        console.log('SIDEMENU: '+error);
        this.auth.sideMenu = false

      }

    })

  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}

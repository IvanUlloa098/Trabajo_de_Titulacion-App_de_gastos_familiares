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
    { title: 'Perfil', url: '/profile', icon: 'person-circle-outline' },
    { title: 'Familia', url: '/update-family', icon: 'build-outline' },
    { title: 'Miembros', url: '/list-familymembers', icon: 'people-circle-outline' }
  ];

  private appPagesUser = [
    { title: 'Perfil', url: '/profile', icon: 'person-circle-outline' },
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

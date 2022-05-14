import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  private sessionEmail: any
  private sessionUser : any

  constructor(public menuCtrl: MenuController,
              private auth :  AuthenticationService,
              private router: Router,
              private loadingController: LoadingController,
              private userService: UserService) { 
                 
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

import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-familymembers',
  templateUrl: './list-familymembers.page.html',
  styleUrls: ['./list-familymembers.page.scss'],
})
export class ListFamilymembersPage implements OnInit {

  private sessionUser: any
  private aux: any
  private members: any

  private alert: string
  private advice: string

  constructor(private userService: UserService, 
              private auth: AuthenticationService,
              private loadingController: LoadingController,
              private alertCtrl: AlertController) { }

  async ngOnInit() {

    this.sessionUser = await this.auth.getUserAuth()

    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 

        try {

          await this.sessionUser.pipe(take(1)).subscribe(async user =>{

            this.aux = await this.auth.getUsuario(user.email)

            await this.aux.pipe(take(1)).subscribe( async res=> {

              this.members = await this.userService.getFamilyMembers(res[0].id_familia)

              a.dismiss().then(() => console.log('abort presenting'))

            })

          })
          
        } catch (error) {

          console.log('ERROR al cargar datos')
          this.alert = "Ocurrió un error al cargar sus datos"
          this.advice = 'Por favor, inténtelo de nuevo'

          this.genericAlert(this.alert, this.advice)

        } finally {
          a.dismiss().then(() => console.log('abort presenting'))
        }

      }) 
    })

  }

  async deleteMember(item: any) {

    const prompt = await this.alertCtrl.create({  
      header: 'Eliminar de familia',  
      message: '¿Está seguro que quiere eliminar a '+item.displayName+'?',  
      buttons: [  
        {  
          text: 'Cancelar',  
          handler: data => {  
            console.log('Cancel');  
          }  
        },  
        {  
          text: 'Aceptar',  
          handler: async data => {  
            console.log('Accept')
            
            return await this.loadingController.create({ }).then(a => {
              a.present().then(async () => { 

                try {
                  await this.userService.deleteFamily(item.uid, '-1')
                } catch (error) {
                  
                  console.log('ERROR al eliminar miembro')
                  this.alert = "Ocurrió un error al eliminar"
                  this.advice = 'Por favor, inténtelo de nuevo'
        
                  this.genericAlert(this.alert, this.advice)

                } finally {
                  a.dismiss().then(() => console.log('abort presenting'))
                }
                
              })
            })
              
          }  
        }  
      ]  
    }); 
     
    await prompt.present()

  }

  isHidden(rl: any) {
    
    if (rl === 'A') {
      return true
    } else {
      return false
    }

  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async genericAlert(alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: [
        {  
          text: 'Accept',  
          handler: async data => {  
            console.log('Aceptar')
          }  
        }  
      ]  
    }); 

    await prompt.present()

  }

}

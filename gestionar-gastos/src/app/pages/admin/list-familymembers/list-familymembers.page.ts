import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { MemberSpencePage } from '../member-spence/member-spence.page';

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
  private currentModal = null;

  constructor(private userService: UserService, 
              private auth: AuthenticationService,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController) { }

  async ngOnInit() {

    // Obtención del usuario que actualmente tiene la sesión abierta
    this.sessionUser = await this.auth.getUserAuth()

    // Control de la interacción del usuario usando una rueda de carga
    return await this.loadingController.create({ }).then(a => {
      a.present().then(async () => { 

        try {

          await this.sessionUser.pipe(take(1)).subscribe(async user =>{

            // Obtener los datos del usurio de FireStore dado- 
            //    el email proporcionado por la API de autentificación
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

  async presentModal(id) {
    const modal = await this.modalCtrl.create({
      component: MemberSpencePage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
      componentProps: {
        'id': id
      }
    });
    await modal.present();
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

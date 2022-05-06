import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ver-gastos',
  templateUrl: './ver-gastos.page.html',
  styleUrls: ['./ver-gastos.page.scss'],
})
export class VerGastosPage implements OnInit {

  gastos:any
  usuario:any
  

  alert: string
  advice: string

  private sessionUser : any

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private gastoService: GastosService,
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(false)
    } 

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()    
    this.obtenerUsuario()    
  }
  async obtenerUsuario(){
     
    await this.sessionUser.pipe(take(1)).subscribe(async user =>{
      try {
        
        this.usuario = await this.auth.getUsuario(user.email)
        
        this.usuario.forEach((element) => {
          this.gastos=this.gastoService.obtenerGastos(element[0].uid)
        });

      } catch(error){
          console.log("error al cargar usuario")
  
          this.alert = "Ocurrió un error inesperado al cargar la informacion del usuario"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
      }
    })  
  }
  async genericAlert(alert_message, advice){

    const prompt = await this.alertCtrl.create({  
      header: 'Lo sentimos',  
      subHeader: alert_message,
      message: advice,  
      
      buttons: ['Aceptar']  
    }); 

    await prompt.present()

  }
}

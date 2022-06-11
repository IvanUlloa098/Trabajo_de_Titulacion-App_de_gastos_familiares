import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PresupuestosService } from 'src/app/services/presupuestos.service';

@Component({
  selector: 'app-ver-presupuestos',
  templateUrl: './ver-presupuestos.page.html',
  styleUrls: ['./ver-presupuestos.page.scss'],
})
export class VerPresupuestosPage implements OnInit {
  presupuestos:any
  usuario:any  

  alert: string
  advice: string

  private sessionUser : any

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private presupuestoService: PresupuestosService,
    private alertCtrl: AlertController,
    private auth :  AuthenticationService,
    public menuCtrl: MenuController ) {
      this.menuCtrl.enable(true)
    }

  async ngOnInit() {
    this.sessionUser = await this.auth.getUserAuth()
    this.obtenerPresupuestos()
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
  async obtenerPresupuestos(){
     
    await this.sessionUser.pipe(take(1)).subscribe(async user =>{
      try {
        
        this.usuario = await this.auth.getUsuario(user.email)
        
        this.usuario.forEach((element) => {
          this.presupuestos=this.presupuestoService.obtenerPresupuestos(element[0].id_familia)
        });

      } catch(error){
          console.log("error al cargar usuario")
  
          this.alert = "Ocurrió un error inesperado al cargar su informacion"
          this.advice = 'Por favor, inténtelo de nuevo'
    
          return this.genericAlert(this.alert, this.advice)
      }
    })  
  }

}

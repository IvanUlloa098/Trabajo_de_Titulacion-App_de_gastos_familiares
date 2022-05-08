import { Component, OnInit } from '@angular/core';
import { Gasto } from 'src/app/domain/gasto';
import { GastosService } from 'src/app/services/gastos.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ver-gastos-familia',
  templateUrl: './ver-gastos-familia.page.html',
  styleUrls: ['./ver-gastos-familia.page.scss'],
})
export class VerGastosFamiliaPage implements OnInit {
  
  gastosF:Gasto[]=[]
  usuarios:any
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
    this.obtenerGastosFml()    
  }  
  async obtenerGastosFml(){     
    await this.sessionUser.pipe(take(1)).subscribe(async user =>{
      try {        
        this.usuario = await this.auth.getUsuario(user.email)
        await this.usuario.pipe(take(1)).subscribe(async user =>{
          console.log(user[0].uid)
        })
        
        this.usuario.forEach((element) => {
          console.log("1")
          this.usuarios=this.gastoService.obtenerusrFamilia(element[0].id_familia)
          this.usuarios.forEach((element) => {   
            console.log("2")        
            for (let index = 0; index < element.length; index++) {
              console.log("3")
              this.gastos=this.gastoService.obtenerGastos(element[index].uid)        
              this.gastos.forEach((element) => {
                  for (let index1 = 0; index1 < element.length; index1++) {
                    console.log("4")
                    let aux:Gasto=new Gasto()
                    aux.id=element[index1].id        
                    aux.monto=element[index1].monto
                    aux.id_usuario=element[index1].id_usuario
                    aux.id_categoria=element[index1].id_categoria
                    aux.fecha=element[index1].fecha
                    aux.descripcion=element[index1].descripcion                        
                    this.gastosF.push(aux)        
                  }          
                });
              }
            });
        });        
        
        
      } catch(error){
          console.log(error)  
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

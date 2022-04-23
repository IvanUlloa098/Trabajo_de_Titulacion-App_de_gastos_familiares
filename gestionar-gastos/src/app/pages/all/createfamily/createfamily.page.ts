import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Familia } from 'src/app/domain/family';
import { take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-createfamily',
  templateUrl: './createfamily.page.html',
  styleUrls: ['./createfamily.page.scss'],
})
export class CreatefamilyPage implements OnInit {

  fam : Familia = new Familia() 
  User: any
  user2: any
  id:any
  aux: any

  constructor( private router: Router, private AuthenticationService :  AuthenticationService, private alertCtrl: AlertController, private activate: ActivatedRoute ) {
    activate.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.queryParams){
        this.id = this.router.getCurrentNavigation().extras.queryParams.user
      }
    })

  }

  ngOnInit() {
  }

  async crear(){

    let params: NavigationExtras = {
      queryParams: {
        user:this.id
      }
    }

    if(this.fam){

      try {
        this.User = await this.AuthenticationService.getUsuario(this.id)
        this.aux = await this.AuthenticationService.createFamily(this.fam)
  
        this.aux.pipe(take(1)).subscribe( res=> {

          this.User.pipe(take(1)).subscribe(res2=> {
            this.AuthenticationService.changeFamily(res2[0], res[0])
            this.AuthenticationService.modifyRole(res2[0], 'A')
          }) 
  
        }) 

      } catch (error) {
        console.log("error al crear familia")
        return this.router.navigate(["/createfamily", params]);
      }

      return this.router.navigate(["/tabs"]);

    }else{
      console.log("error al crear familia")
      return this.router.navigate(["/createfamily"], params);
    }
  }

  async prompt(){

    const prompt = await this.alertCtrl.create({  
      header: 'Buscar familia',  
      message: 'Ingrese el correo del jefe de la familia',  
      inputs: [  
        {  
          name: 'email',          
          placeholder: 'ejemplo@mail.com' ,
          type: 'email',
           
        },  
      ],  
      buttons: [  
        {  
          text: 'Cancel',  
          handler: data => {  
            console.log('Cancel clicked');  
          }  
        },  
        {  
          text: 'Buscar',  
          handler: async data => {  
            await this.join(data.email)
            console.log('Accept '+data.email);  
          }  
        }  
      ]  
    }); 
     
    await prompt.present();

  }

  async join(email) {
    console.log(email);  
    let params: NavigationExtras = {
      queryParams: {
        user:this.id
      }
    }
    
    try {
      this.User = await this.AuthenticationService.getUsuario(email);
      console.log(this.id);  
      this.User.pipe(take(1)).subscribe( async res=> {
        
        if (res[0].id_familia === "-1") {
          console.log("no existe esa familia")
        } else {

          this.aux = await this.AuthenticationService.getUsuario(this.id)
          this.fam.id = res[0].id_familia

          await this.aux.pipe(take(1)).subscribe( res2=> {
            this.AuthenticationService.changeFamily(res2[0],  this.fam)
            this.AuthenticationService.modifyRole(res2[0], 'U')
            
          })

          return this.router.navigate(["/tabs"]);

        }

      })

      return this.router.navigate(["/tabs"]);

    } catch (error) {
      console.log("error al asignar familia")
      return this.router.navigate(["/createfamily"], params);
    }

  }

  regresar(){
    this.router.navigate(["/login"])
  }

}

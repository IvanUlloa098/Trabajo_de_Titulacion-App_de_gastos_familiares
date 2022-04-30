import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';


export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})

export class ProfilePage implements OnInit{
  
  private aux: any

  name : string;
  email: String;
  description : Boolean;
  photo : String;
  id : string;

  constructor(private auth: AuthenticationService) { }

  async ngOnInit() {
    
    this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{

        this.aux = await this.auth.getUsuario(user.email)

        await this.aux.pipe(take(1)).subscribe( res=> {
          this.name = res[0].displayName;
          this.email = res[0].email;
          this.photo = res[0].photoURL;
          this.description = res[0].description
          this.id = res[0].uid;
        })
        
        console.log( 'HERE', user);
      })
    
  }

  Onlogout(){
    this.auth.salirCuenta();
  }

}
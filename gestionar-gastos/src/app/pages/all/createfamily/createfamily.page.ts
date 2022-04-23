import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Familia } from 'src/app/domain/family';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-createfamily',
  templateUrl: './createfamily.page.html',
  styleUrls: ['./createfamily.page.scss'],
})
export class CreatefamilyPage implements OnInit {

  fam : Familia = new Familia() 
  User: any
  id:any
  aux: any

  constructor( private router: Router, private AuthenticationService :  AuthenticationService, private activate: ActivatedRoute ) {
    activate.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.queryParams){
        this.id = this.router.getCurrentNavigation().extras.queryParams.user
      }
    })

  }

  ngOnInit() {
  }

  async crear(){

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
        return this.router.navigate(["/createfamily"]);
      }

      return this.router.navigate(["/tabs"]);

    }else{
      console.log("error al crear familia")
      return this.router.navigate(["/createfamily"]);
    }
  }

  async join(){

    if(this.fam){
      this.User = this.AuthenticationService.getUsuario(this.id);

      this.AuthenticationService.changeFamily(this.User, this.fam)
      this.AuthenticationService.modifyRole(this.User, 'A')
      this.AuthenticationService.createFamily(this.fam)

    }else{
      console.log("error al crear familia")
    }
  }

  regresar(){
    this.router.navigate(["/login"])
  }

}

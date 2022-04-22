import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Familia } from 'src/app/domain/family';

@Component({
  selector: 'app-createfamily',
  templateUrl: './createfamily.page.html',
  styleUrls: ['./createfamily.page.scss'],
})
export class CreatefamilyPage implements OnInit {

  fam : Familia = new Familia() 
  User: any
  id:any

  constructor( private router: Router, private AuthenticationService :  AuthenticationService, private activate: ActivatedRoute ) {
    activate.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.queryParams){
        this.id = this.router.getCurrentNavigation().extras.queryParams.id
      }
    })
  }

  ngOnInit() {
  }

  async crear(){

    if(this.fam){
      this.User = this.AuthenticationService.getUsuario(this.id);

      this.AuthenticationService.changeFamily(this.User, this.fam)
      this.AuthenticationService.createFamily(this.fam)

    }else{
      console.log("error al crear familia")
    }
  }

  regresar(){
    this.router.navigate(["/login"])
  }

}

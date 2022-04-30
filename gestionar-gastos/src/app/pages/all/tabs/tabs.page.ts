import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private sessionUser : any

  constructor(private auth :  AuthenticationService) {
    
  }

  async ngOnInit() {
    await this.auth.getUserAuth().pipe(take(1)).subscribe(async user =>{

      this.sessionUser = user.email
      
      console.log( 'HERE ', user.email);
    })
  }

}

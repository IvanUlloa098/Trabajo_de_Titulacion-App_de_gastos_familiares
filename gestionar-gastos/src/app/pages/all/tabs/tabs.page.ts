import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private sessionUser : any

  constructor(private AuthenticationService :  AuthenticationService) {
    this.sessionUser = this.AuthenticationService.currentUser
    console.log(this.sessionUser._delegate.email)
  }

  ngOnInit() {
  }

}

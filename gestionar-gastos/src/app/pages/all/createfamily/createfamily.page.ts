import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Familia } from 'src/app/domain/family';

@Component({
  selector: 'app-createfamily',
  templateUrl: './createfamily.page.html',
  styleUrls: ['./createfamily.page.scss'],
})
export class CreatefamilyPage implements OnInit {

  fam : Familia = new Familia() 

  constructor( private router: Router, private auth: AuthenticationService ) { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ValidatorsCustomService } from '../../services/validators-custom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  public identity: User;

  constructor(  private _validatorService: ValidatorsCustomService,
                private _router: Router ) {

    this.identity = this._validatorService.getIdentity();

   }

  ngOnInit() {
  }

  signout() {
    localStorage.removeItem('identity');
    this._router.navigateByUrl('/register');
  }

}

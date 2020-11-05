import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsCustomService {

  public url: string;
  public identity: User;

  constructor(  private _http: HttpClient ) {

    this.url = 'http://localhost:3000/api/';

   }

  // comprobar que se hayan aceptado las condiciones
  notAceptedConditions( checkInputName: string ) {
    return (formGroup: FormGroup) => {
      const conditions = formGroup.controls[checkInputName];
      // en caso de detactar que no hay un check
      if(conditions.value === false || conditions.value === '') {
        conditions.setErrors({ notAcepted: true });
      } else {
        // en caso de no ver ningún error
        conditions.setErrors(null);
      }
    }
  }


  // comprobar que el nombre de usuario sea válido
  notValidNickname( data: string ): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'not-repeated-nickname/' + data, [], {headers});
  }


  // comprobar el correo electronico no sea repetido
  notValidMail( data: string ): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'not-repeated-email/' + data, [], {headers});
  }


  // registrar al usuario
  register( user: User ): Observable<any> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'register', params, {headers});
  }


  // obtener la identidad
  getIdentity(): User | null {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if(identity == 'undefined') {
      this.identity = null;
    } else {
      this.identity = identity;
    }
    return this.identity;
  }
}

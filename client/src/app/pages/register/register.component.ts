import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ValidatorsCustomService } from 'src/app/services/validators-custom.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  public user: User;
  public registerForm: FormGroup;
  public messageRepeatedNickname: string;
  public messageRepeatedEmail: string;
  public loader: boolean;

  constructor(  private _formBuilder: FormBuilder, 
                private _validatorsCustom: ValidatorsCustomService,
                private _router: Router ) { 
    
    this.loader = false;

    this.user = new User(null, '', '', '', '', '');

    this.createForm(); // creacion del formulario por aproximacion por data

    this.checkNickname();

    this.checkEmail();

  }

  ngOnInit() {
  }

  // comprobar si fue tocado y es invalido
  get notValidName(): boolean {
    return this.registerForm.get('name').invalid && this.registerForm.get('name').touched;
  }

  get notValidSurname(): boolean {
    return this.registerForm.get('surname').invalid && this.registerForm.get('surname').touched;
  }

  get notValidNickname(): boolean {
    return this.registerForm.get('nickname').invalid && this.registerForm.get('nickname').touched;
  }

  get notValidEmail(): boolean {
    return this.registerForm.get('email').touched && this.registerForm.get('email').invalid;
  }

  get notValidPassword(): boolean {
    return this.registerForm.get('password').invalid && this.registerForm.get('password').touched;
  }

  get notValidConditions(): boolean {
    return this.registerForm.get('conditions').invalid && this.registerForm.get('conditions').touched;
  }



  // creación del formulario reactivo
  createForm() {
    this.registerForm = this._formBuilder.group({
      name:       ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\s]{4,20}$')]],
      surname:    ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\s]{4,40}$')]],
      nickname:   ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\_\-]{4,16}$')]],
      email:      ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password:   ['', [Validators.required, Validators.pattern('^.{4,12}$')]],
      conditions: ['', [Validators.required]]
    },
    {
      validators: this._validatorsCustom.notAceptedConditions('conditions')
    }
    );
  }
  

  // registrar un usuario
  register() {

    this.loader = true;

    if(this.registerForm.valid) {

      this.user.name = this.registerForm.get('name').value;
      this.user.surname = this.registerForm.get('surname').value;
      this.user.email = this.registerForm.get('email').value;
      this.user.nickname = this.registerForm.get('nickname').value;
      this.user.password = this.registerForm.get('password').value;

  

      // si el registro es valido
      
      this._validatorsCustom.register(this.user).subscribe( response => {
        if(response.user) {
          this.user = response.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.registerForm.reset();
          this.loader = false;
          this._router.navigate(['/home']);
        }
      },
      error => {
        console.log(error.error.message);
        this.loader = false;
      } );
      
    
    } else {
      // si el registro es no valido
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });

      this.loader = false;

    } 

  }

  // comprobar que el nombre de usuario no este registrado
  checkNickname() {
    this.registerForm.valueChanges
        .subscribe( data => {

          if(data.nickname) {
              
            this._validatorsCustom.notValidNickname(data.nickname.toLowerCase())
                .subscribe( resp => {
                  this.messageRepeatedNickname = null;
                }, err => {

                  // marcar como invalido y tocado
                  this.registerForm.get('nickname').setErrors({ repeated: true });
                  this.registerForm.get('nickname').markAsTouched();

                  this.messageRepeatedNickname = err.error.message;

                } );

            }
        } );
  }

  // comprobar que el correo no este registrado aún
  checkEmail() {
   this.registerForm.valueChanges.subscribe( data => {
     if(data.email) {
       this._validatorsCustom.notValidMail(data.email).subscribe( resp => {
        this.messageRepeatedEmail = null;
       }, err => {

        this.registerForm.get('email').setErrors({ repeated: true });
        this.registerForm.get('email').markAsTouched();

        this.messageRepeatedEmail = err.error.message;

       } );
     }
   } );
  }





}

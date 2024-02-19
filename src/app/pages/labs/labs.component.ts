import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola!';
  tasks = signal([
    'Instalar el angular',
    'Crear proyecyo',
    'Renderizar componente'
  ]);

  name = signal('Nicolas');
  // age = 18;
  disabled = true;
  // img = 'https://w3schools.com/howto/img_avatar.png';

  person = signal({
    name: 'Nicolas',
    age: 19,
    img : 'https://w3schools.com/howto/img_avatar.png'

  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50,{
    nonNullable: true
  });

  nameCtrl = new FormControl('nicolas',{
    nonNullable: true,
    validators:[
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  clickHandler(){
    alert('Holis')
  }

  changeHandler(event : Event){
    const input = event.target as HTMLInputElement
    const newValue = input.value;
    this.name.set(newValue)
  }

  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement
    console.log(input.value)
  }

  changeAge(event :Event){
    const input = event.target as HTMLInputElement
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    })
  }


  changeName(event : Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    })
  }
}

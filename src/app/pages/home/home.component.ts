import { Component, Inject, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/task.models'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  injector = inject(Injector)


  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks()
  }


  trackTasks(){
    effect(()=>{
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector : this.injector})
  }


  filter = signal<'all' |  'pending' | 'completed'>('all');
  tasksByFilter = computed(()=> {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending'){
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })


  changeFilter(filter : 'all' |  'pending' | 'completed'){
    this.filter.set(filter)
  }





  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });


  changeHandler(event : Event){
    if (this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value.trim();
      if(value !== ''){
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }



  /*----------------------------------------*/

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }



  deleteTasks(index: number){
    this.tasks.update((task)=>task.filter((task, position)=> position !== index));
  }


  updateTask(index: number){
    this.tasks.update((tasks)=> {
      return tasks.map((task,position) =>{
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }


  updateTaskEditingMode(index: number){
    this.tasks.update(prevState => {
      return prevState.map((task,position)=> {
        if(position === index) {
          return {
            ...task,
            editing: !task.completed
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    })
  }


  updateTaskText(index: number, event :Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update(prevState => {
      return prevState.map((task,position)=> {
        if(position === index) {
          return {
            ...task,
            text: input.value,
            editing: false
          }
        }
        return task;
      })
    })
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }

  // method to add a task to Firestore
  createTask(task: Task): Promise<any> {
    return this.firestore.collection('tasks').add(task);
  }

  // method to load all tasks 
  getTasks(): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges();
  }

  // method to load a single task
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  // Filter tasks by priority
  getTasksByPriority(prio: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.prio === prio))
    );
  }
}

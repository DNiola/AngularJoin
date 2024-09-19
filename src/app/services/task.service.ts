import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Task } from 'src/app/models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }

  // method to add a task to Firestore
  createTask(task: Task): Promise<any> {
    return this.firestore.collection('tasks').add(task);
  }

  // method to load all tasks (if needed)
  getTasks(): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges();
  }
}

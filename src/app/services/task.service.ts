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

  // task in firestore create
  public async createTask(task: Task): Promise<any> {
    const taskRef = this.firestore.collection('tasks').doc();
    const taskId = taskRef.ref.id;
    task.id = taskId;

    return taskRef.set(task)
      .then(() => {
        console.log("Task erfolgreich erstellt mit ID:", taskId);
        return taskId;
      });
  }


  // task in firestore update
  public updateTaskStatus(taskId: string, newStatus: string): Promise<void> {
    return this.firestore.collection('tasks').doc(taskId).update({ status: newStatus });
  }


  // method to load all tasks 
  public getTasks(): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks').valueChanges();
  }


  // method to load a single task
  public getTasksByStatus(status: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }


  // Filter tasks by priority
  public getTasksByPriority(prio: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.prio === prio))
    );
  }
}

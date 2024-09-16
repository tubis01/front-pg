
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person.interface';

@Injectable({providedIn: 'root'})

export class PersonService {

  private apirul: String  = 'http://localhost:8080/api/personas';

  constructor( private http: HttpClient) { }


  public getPersons(): Observable<Person[]> {

    return this.http.get<Person[]>(`${this.apirul}/listar`);

  }

}

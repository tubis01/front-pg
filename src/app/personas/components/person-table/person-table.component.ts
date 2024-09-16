import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../interfaces/person.interface';
import { PersonService } from '../../services/persons.service';

@Component({
  selector: 'person-table',
  templateUrl: './person-table.component.html',
  styles: ``
})
export class PersonTableComponent implements OnInit {

  @Input()
  public persons: Person[] = [];


  constructor( private personService: PersonService) {
  }
  ngOnInit(): void {
this.personService.getPersons().subscribe(
    persons => {
      this.persons = persons;
      console.log(this.persons);  // Verificar si los datos se están recibiendo correctamente
    },
    error => {
      console.error('Error al cargar las personas:', error);
    }
  );
  }




}

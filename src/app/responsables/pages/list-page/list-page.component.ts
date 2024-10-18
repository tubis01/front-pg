import { Component, OnInit } from '@angular/core';
import { Responsable } from '../../interfaces/responsable.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: `./list-page.component.css`
})
export class ListPageComponent implements OnInit{

  public canEdit: boolean =  false;
  public canViewTable: boolean = false;
  public canViewForm: boolean = false;



  constructor(

    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.setPermission();
  }


  setPermission(): void{
    const roles = this.authService.getRoles();
    if(roles.includes('ROLE_ADMIN')){
      this.canEdit = true;
      this.canViewTable = true;
      this.canViewForm = true;
    }else if(roles.includes('ROLE_USER')){
      this.canViewTable = true;
    }
  }


  public selectedResponsable: Responsable | null = null;

  onEditResponsable(responsable: Responsable): void {
    this.selectedResponsable = responsable;
  }

  onFormSubmit(): void {
    this.selectedResponsable = null; // Reset after successful form submission
  }
}

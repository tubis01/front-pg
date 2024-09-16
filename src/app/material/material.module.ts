import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ListboxModule } from 'primeng/listbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';




@NgModule({
  exports :[
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    ChipsModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    PasswordModule,
    ListboxModule,
    ProgressSpinnerModule,
    DropdownModule,
    TieredMenuModule,
    ToastModule,
    ToolbarModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    SidebarModule,
    AvatarModule,
    TableModule,
    PanelModule,
    ToolbarModule

  ]
})
export class MaterialModule { }

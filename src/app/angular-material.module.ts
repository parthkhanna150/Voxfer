import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatCardModule,
  MatToolbarModule,
  MatChipsModule,
  MatDividerModule,
  MatIconModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatOptionModule,
  MatDialogModule} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule {

}

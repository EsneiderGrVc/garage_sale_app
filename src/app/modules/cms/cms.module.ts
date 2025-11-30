import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CmsPageComponent } from './pages/cms/cms-page.component';
import { ProductEditDialogComponent } from './components/product-edit-dialog/product-edit-dialog.component';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [CmsPageComponent, ProductEditDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DataViewModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    FloatLabelModule,
    TagModule,
    FileUploadModule
  ],
  exports: [CmsPageComponent]
})
export class CmsModule { }

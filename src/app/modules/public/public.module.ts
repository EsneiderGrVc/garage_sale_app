import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ProductosPageComponent } from './pages/productos/productos-page.component';
import { ProductCardComponent } from './pages/productos/product-card/product-card.component';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
  declarations: [HomePageComponent, ProductosPageComponent, ProductCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CarouselModule,
    DividerModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    FloatLabelModule
  ],
  exports: [HomePageComponent, ProductosPageComponent]
})
export class PublicModule { }

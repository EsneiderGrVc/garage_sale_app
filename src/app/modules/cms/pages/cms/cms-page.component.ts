import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../../../core/services/products.service';
import { StorageImagesService } from '../../../../core/services/storage-images.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
export class CmsPageComponent implements OnInit, OnDestroy {
  productos: Product[] = [];
  mostrarDialogo = false;
  productoSeleccionado: Product | null = null;
  private subscription = new Subscription();

  constructor(private productsService: ProductsService, private storageService: StorageImagesService) {}

  ngOnInit(): void {
    const sub = this.productsService.getAllProducts().subscribe(items => {
      this.productos = items;
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  crearProducto(): void {
    this.productoSeleccionado = null;
    this.mostrarDialogo = true;
  }

  editarProducto(producto: Product): void {
    this.productoSeleccionado = producto;
    this.mostrarDialogo = true;
  }

  cerrarDialogo(): void {
    this.mostrarDialogo = false;
  }
}

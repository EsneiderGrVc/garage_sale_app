import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService, Product } from '../../../core/services/products.service';

@Component({
  selector: 'app-productos-page',
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.css']
})
export class ProductosPageComponent implements OnInit, OnDestroy {
  productos: Product[] = [];
  categorias: string[] = [];
  filtroCategoria = new FormControl('');
  buscarControl = new FormControl('');
  private subscription = new Subscription();

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    const sub = this.productsService.getAllProducts().subscribe(items => {
      this.productos = items;
      this.categorias = Array.from(new Set(items.map(p => p.category)));
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get productosFiltrados(): Product[] {
    const term = (this.buscarControl.value || '').toLowerCase();
    const categoria = this.filtroCategoria.value;
    return this.productos.filter(p => {
      const coincideNombre = p.name.toLowerCase().includes(term);
      const coincideCategoria = !categoria || p.category === categoria;
      return coincideNombre && coincideCategoria;
    });
  }

  productosPorCategoria(category: string): Product[] {
    return this.productosFiltrados.filter(p => p.category === category);
  }
}

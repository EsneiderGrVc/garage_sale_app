import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from './product-card/product-card.component';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FloatLabelModule } from 'primeng/floatlabel';

interface CategoryGroup {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    DividerModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  private productsService = inject(ProductsService);

  allProducts$: Observable<Product[]> = this.productsService.getAllProducts();
  filteredProducts$!: Observable<Product[]>;
  categoryGroups$!: Observable<CategoryGroup[]>;
  categories$!: Observable<string[]>;

  searchTerm = '';
  selectedCategory = 'Todas';

  ngOnInit(): void {
    this.filteredProducts$ = this.allProducts$;
    this.categories$ = this.allProducts$.pipe(
      map((products) => {
        const uniqueCategories = Array.from(
          new Set(products.map((p) => p.category))
        ).filter((category) => category && category.trim() !== '');
        return uniqueCategories.sort();
      })
    );

    this.categoryGroups$ = this.filteredProducts$.pipe(
      map((products) => {
        const grouped = products.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {} as Record<string, Product[]>);

        return Object.keys(grouped)
          .filter((category) => category && category.trim() !== '')
          .sort()
          .map((category) => ({
            category,
            products: grouped[category],
          }))
          .filter((group) => group.products.length > 0);
      })
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategory === category;
  }

  private applyFilters(): void {
    this.filteredProducts$ = this.allProducts$.pipe(
      map((products) => {
        let filtered = products;

        // Filter by category
        if (this.selectedCategory !== 'Todas') {
          filtered = filtered.filter(
            (p) => p.category === this.selectedCategory
          );
        }

        // Filter by search term
        if (this.searchTerm.trim()) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }

        return filtered;
      })
    );

    this.categoryGroups$ = this.filteredProducts$.pipe(
      map((products) => {
        const grouped = products.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {} as Record<string, Product[]>);

        return Object.keys(grouped)
          .filter((category) => category && category.trim() !== '')
          .sort()
          .map((category) => ({
            category,
            products: grouped[category],
          }))
          .filter((group) => group.products.length > 0);
      })
    );
  }
}


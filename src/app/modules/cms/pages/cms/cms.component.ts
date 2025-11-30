import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductEditDialogComponent } from '../../components/product-edit-dialog/product-edit-dialog.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, TagModule],
  providers: [DialogService],
  template: `<p>cms works!</p>`,
  styleUrl: './cms.component.css',
})
export class CmsComponent {
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogService = inject(DialogService);

  // products$: Observable<Product[]> = this.productsService.getAllProducts();
  products$: Observable<Product[]> = of([]);
  ref: DynamicDialogRef | undefined | null;


  openCreateDialog(): void {
    this.ref = this.dialogService.open(ProductEditDialogComponent, {
      header: 'Crear Nuevo Producto',
      width: '90%',
      style: { maxWidth: '800px' },
      data: {},
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        // Product was created/updated, the observable will automatically update
      }
    });
  }

  openEditDialog(product: Product): void {
    this.ref = this.dialogService.open(ProductEditDialogComponent, {
      header: 'Editar Producto',
      width: '90%',
      style: { maxWidth: '800px' },
      data: { product },
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        // Product was updated, the observable will automatically update
      }
    });
  }

  async deleteProduct(product: Product): Promise<void> {
    if (
      confirm(
        `¿Está seguro de que desea eliminar el producto "${product.name}"?`
      )
    ) {
      if (product.id) {
        await this.productsService.deleteProduct(product.id);
      }
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  }
}


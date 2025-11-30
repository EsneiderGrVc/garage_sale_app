import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../../../core/models/product.model';
import { ProductsService } from '../../../../../core/services/products.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CarouselModule, TagModule, ButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  private productsService = inject(ProductsService);
  storageImages = signal<string[]>([]);
  isLoadingImages = signal<boolean>(true);

  ngOnInit(): void {
    this.loadProductImages();
  }

  private loadProductImages(): void {
    if (this.product.id) {
      this.productsService.getProductImages(this.product.id).subscribe({
        next: (images) => {
          this.storageImages.set(images);
          this.isLoadingImages.set(false);
        },
        error: (error) => {
          console.error('Error loading product images:', error);
          this.isLoadingImages.set(false);
        },
      });
    } else {
      this.isLoadingImages.set(false);
    }
  }

  getWhatsAppUrl(): string {
    const message = `Hola, me interesa el producto ${this.product.name}${this.product.brand ? ' ' + this.product.brand : ''}${this.product.reference ? ' ' + this.product.reference : ''}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${environment.whatsappNumber}?text=${encodedMessage}`;
  }

  getStatusSeverity(): 'success' | 'danger' {
    return this.product.status === 'Disponible' ? 'success' : 'danger';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  }

  formatUseTime(): string {
    if (!this.product.use_time?.value || !this.product.use_time?.unit) {
      return 'Sin Dato';
    } else {
      return `${this.product.use_time.value} ${this.product.use_time.unit.toLowerCase()} de uso`;
    }
  }
}


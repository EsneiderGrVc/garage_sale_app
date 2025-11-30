import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() openWhatsapp = new EventEmitter<Product>();
}

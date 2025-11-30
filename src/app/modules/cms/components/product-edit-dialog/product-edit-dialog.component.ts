import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService, Product } from '../../../../core/services/products.service';
import { StorageImagesService } from '../../../../core/services/storage-images.service';

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.css']
})
export class ProductEditDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() producto: Product | null = null;
  @Output() close = new EventEmitter<void>();

  formulario: FormGroup;
  cargando = false;
  archivos: File[] = [];

  categoriasInternas = ['Venta', 'Donación'];
  estados = ['Disponible', 'Vendido', 'Donado'];

  constructor(private fb: FormBuilder, private productsService: ProductsService, private storageService: StorageImagesService) {
    this.formulario = this.crearFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto']) {
      this.formulario = this.crearFormulario();
      if (this.producto) {
        this.formulario.patchValue(this.producto);
      }
    }
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', Validators.required],
      reference: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      condition_scale: [10, [Validators.required, Validators.min(1), Validators.max(10)]],
      brand: ['', Validators.required],
      use_time: this.fb.group({
        value: [0, Validators.required],
        unit: ['Meses', Validators.required]
      }),
      purchase_date: ['', Validators.required],
      total_lifetime: this.fb.group({
        value: [0, Validators.required],
        unit: ['Meses', Validators.required]
      }),
      current_price: [0, Validators.required],
      proposed_price: [0, Validators.required],
      internal_category: ['Venta', Validators.required],
      subcategory: ['', Validators.required],
      model: ['', Validators.required],
      market_link: [''],
      images: this.fb.control<string[]>([]),
      status: ['Disponible', Validators.required]
    });
  }

  cerrar(): void {
    this.close.emit();
  }

  onUpload(event: any): void {
    this.archivos = event.files as File[];
  }

  async guardar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    const { id, ...data } = this.formulario.value as Product;
    try {
      if (id) {
        await this.productsService.updateProduct(id, data);
        if (this.archivos.length) {
          await this.storageService.uploadProductImages(id, this.archivos);
        }
      } else {
        const newId = await this.productsService.createProduct(data as Product);
        if (this.archivos.length) {
          await this.storageService.uploadProductImages(newId, this.archivos);
        }
      }
      this.cerrar();
    } finally {
      this.cargando = false;
      this.archivos = [];
    }
  }
}

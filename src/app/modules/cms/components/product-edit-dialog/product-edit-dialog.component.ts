import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../../core/services/products.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    FloatLabelModule,
    FileUploadModule,
    MessageModule,
  ],
  template: `<p>product-edit-dialog works!</p>`,
  styleUrl: './product-edit-dialog.component.css',
})
export class ProductEditDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private storage = inject(Storage);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  productForm: FormGroup;
  product: Product | null = null;
  uploadedImages: string[] = [];
  isUploading = false;
  errorMessage = '';

  conditionOptions = ['Nuevo', 'Como nuevo', 'Bueno', 'Regular', 'Malo'];
  unitOptions = ['Meses', 'Años'];
  internalCategoryOptions = ['Venta', 'Donación'];
  statusOptions = ['Disponible', 'Vendido', 'Donado'];

  constructor() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      reference: [''],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      condition_scale: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      brand: [''],
      use_time_value: [0, Validators.required],
      use_time_unit: ['Meses', Validators.required],
      purchase_date: ['', Validators.required],
      total_lifetime_value: [0, Validators.required],
      total_lifetime_unit: ['Meses', Validators.required],
      current_price: [0, [Validators.required, Validators.min(0)]],
      proposed_price: [0, [Validators.required, Validators.min(0)]],
      internal_category: ['Venta', Validators.required],
      subcategory: [''],
      model: [''],
      market_link: ['', Validators.required],
      status: ['Disponible', Validators.required],
    });
  }

  ngOnInit(): void {
    this.product = this.config.data?.product || null;
    if (this.product) {
      this.uploadedImages = [...(this.product.images || [])];
      this.productForm.patchValue({
        name: this.product.name,
        reference: this.product.reference || '',
        category: this.product.category,
        condition: this.product.condition,
        condition_scale: this.product.condition_scale,
        brand: this.product.brand || '',
        use_time_value: this.product.use_time.value,
        use_time_unit: this.product.use_time.unit,
        purchase_date: this.product.purchase_date,
        total_lifetime_value: this.product.total_lifetime.value,
        total_lifetime_unit: this.product.total_lifetime.unit,
        current_price: this.product.current_price,
        proposed_price: this.product.proposed_price,
        internal_category: this.product.internal_category,
        subcategory: this.product.subcategory || '',
        model: this.product.model || '',
        market_link: this.product.market_link,
        status: this.product.status,
      });
    }
  }

  async onFileSelect(event: { files?: FileList; target?: { files?: FileList } }): Promise<void> {
    const files = event.files || event.target?.files;
    if (!files || files.length === 0) return;

    this.isUploading = true;
    this.errorMessage = '';

    try {
      const uploadPromises = Array.from(files).map(async (file: File) => {
        const productId = this.product?.id || 'temp-' + Date.now();
        const storageRef = ref(this.storage, `products/${productId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });

      const urls = await Promise.all(uploadPromises);
      this.uploadedImages = [...this.uploadedImages, ...urls];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.errorMessage = 'Error al subir imágenes: ' + errorMessage;
    } finally {
      this.isUploading = false;
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      try {
        const formValue = this.productForm.value;
        const productData: Product = {
          name: formValue.name,
          reference: formValue.reference || undefined,
          category: formValue.category,
          condition: formValue.condition,
          condition_scale: formValue.condition_scale,
          brand: formValue.brand || undefined,
          use_time: {
            value: formValue.use_time_value,
            unit: formValue.use_time_unit,
          },
          purchase_date: formValue.purchase_date,
          total_lifetime: {
            value: formValue.total_lifetime_value,
            unit: formValue.total_lifetime_unit,
          },
          current_price: formValue.current_price,
          proposed_price: formValue.proposed_price,
          internal_category: formValue.internal_category,
          subcategory: formValue.subcategory || undefined,
          model: formValue.model || undefined,
          market_link: formValue.market_link,
          images: this.uploadedImages,
          status: formValue.status,
        };

        if (this.product?.id) {
          await this.productsService.updateProduct(this.product.id, productData);
        } else {
          await this.productsService.createProduct(productData);
        }

        this.ref.close(true);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        this.errorMessage = 'Error al guardar el producto: ' + errorMessage;
      }
    }
  }

  cancel(): void {
    this.ref.close(false);
  }
}


import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

export interface ProductUseTime {
  value: number;
  unit: 'Meses' | 'Años';
}

export interface ProductLifetime {
  value: number;
  unit: 'Meses' | 'Años';
}

export interface Product {
  id?: string;
  name: string;
  reference: string;
  category: string;
  condition: string;
  condition_scale: number;
  brand: string;
  use_time: ProductUseTime;
  purchase_date: string;
  total_lifetime: ProductLifetime;
  current_price: number;
  proposed_price: number;
  internal_category: 'Venta' | 'Donación';
  subcategory: string;
  model: string;
  market_link: string;
  images: string[];
  status: 'Disponible' | 'Vendido' | 'Donado';
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private collectionName = 'products';

  constructor(private firestore: AngularFirestore) {}

  getAllProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() as Product })))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.firestore.collection<Product>(this.collectionName, ref => ref.where('category', '==', category))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() as Product }))));
  }

  searchProductsByName(term: string): Observable<Product[]> {
    const lowerTerm = term.toLowerCase();
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.name.toLowerCase().includes(lowerTerm)))
    );
  }

  createProduct(product: Product): Promise<string> {
    const id = this.firestore.createId();
    return this.firestore.collection<Product>(this.collectionName).doc(id).set(product).then(() => id);
  }

  updateProduct(id: string, product: Partial<Product>): Promise<void> {
    return this.firestore.collection<Product>(this.collectionName).doc(id).update(product);
  }

  deleteProduct(id: string): Promise<void> {
    return this.firestore.collection<Product>(this.collectionName).doc(id).delete();
  }
}

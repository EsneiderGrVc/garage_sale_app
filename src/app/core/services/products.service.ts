import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly collectionName = 'products';
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  

  getAllProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.collectionName);
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.collectionName);
    const q = query(productsRef, where('category', '==', category));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  searchProductsByName(name: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, this.collectionName);
    return collectionData(productsRef, { idField: 'id' }).pipe(
      map((products) =>
        (products as Product[]).filter((product) =>
          product.name.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
  }

  async createProduct(product: Product): Promise<string> {
    const productsRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(productsRef, product);
    return docRef.id;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(productRef, product);
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(productRef);
  }

  /**
   * Fetches all image URLs from Firebase Storage for a product
   * Images are stored in a folder named after the product's document ID
   * @param productId - The document ID of the product
   * @returns Observable with an array of image download URLs
   */
  getProductImages(productId: string): Observable<string[]> {
    const folderRef = ref(this.storage, `products/${productId}`);
    return from(
      listAll(folderRef).then(async (result) => {
        const urlPromises = result.items.map((itemRef) =>
          getDownloadURL(itemRef)
        );
        return Promise.all(urlPromises);
      })
    );
  }
}


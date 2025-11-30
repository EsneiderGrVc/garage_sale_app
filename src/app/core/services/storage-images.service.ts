import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageImagesService {
  constructor(private storage: AngularFireStorage) {}

  getProductImages(productId: string): Observable<string[]> {
    const folderRef = this.storage.ref(productId);
    return folderRef.listAll().pipe(
      switchMap(result => {
        const urls$ = result.items.map(item => item.getDownloadURL());
        return urls$.length ? from(Promise.all(urls$)) : from(Promise.resolve([]));
      })
    );
  }

  async uploadProductImages(productId: string, files: File[]): Promise<void> {
    const uploads = files.map(file => {
      const path = `${productId}/${file.name}`;
      return this.storage.upload(path, file);
    });
    await Promise.all(uploads.map(u => u.then()));
  }

  async deleteProductImage(productId: string, fileName: string): Promise<void> {
    const path = `${productId}/${fileName}`;
    const ref = this.storage.ref(path);
    await ref.delete().toPromise();
  }
}

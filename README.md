# Garage Sale App

Catálogo informativo de productos de segunda mano con Angular 20, Firebase y PrimeNG. Incluye vista pública de catálogo y un CMS protegido por autenticación.

## Requisitos
- Node 18+
- NPM

## Configuración
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Configura los entornos en `src/environments/environment.ts` y `environment.prod.ts` con tus credenciales de Firebase:
   ```ts
   export const environment = {
     production: false,
     firebase: {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_SENDER_ID',
       appId: 'YOUR_APP_ID'
     }
   };
   ```

3. Ejecuta la aplicación en desarrollo:
   ```bash
   npm start
   ```

4. Linting:
   ```bash
   npm run lint
   ```

## Firebase
### Firestore
Colección `products` con el siguiente esquema:
```json
{
  "name": "string",
  "reference": "string",
  "category": "string",
  "condition": "string",
  "condition_scale": "number",
  "brand": "string",
  "use_time": { "value": "number", "unit": "Meses | Años" },
  "purchase_date": "string",
  "total_lifetime": { "value": "number", "unit": "Meses | Años" },
  "current_price": "number",
  "proposed_price": "number",
  "internal_category": "Venta | Donación",
  "subcategory": "string",
  "model": "string",
  "market_link": "string",
  "images": "string[]",
  "status": "Disponible | Vendido | Donado"
}
```

### Reglas sugeridas de Firestore
Ajusta según tus necesidades de seguridad.
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Almacenamiento de imágenes
Las imágenes deben guardarse en carpetas por ID de documento:
```
/{productDocumentId}/archivo.png
```

#### Reglas de Storage sugeridas
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Autenticación
- Autenticación por correo y contraseña de Firebase Auth.
- La ruta `/cms` está protegida con `AuthGuard`.

## Despliegue en GitHub Pages
1. Configura el `baseHref` si el proyecto vive en un subdirectorio:
   ```bash
   ng build --configuration production --base-href "/<repo>/"
   ```
2. Publica la carpeta `dist/garage-sale-app` en GitHub Pages.

## Buenas prácticas
- No subir `serviceAccountKey.json` ni credenciales sensibles.
- Usar unidades `dvh` para alturas completas y Tailwind mobile-first.

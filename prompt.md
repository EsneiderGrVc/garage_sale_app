You are an expert Angular + Firebase + Tailwind + PrimeNG developer + UI designer (focused on ecommerce).

Generate a complete, production-ready Angular application that meets the following requirements.

================================
HIGH-LEVEL DESCRIPTION
================================
I need a small catalog website to publish second-hand products. It should LOOK like a marketplace but be ONLY informational (no “buy” or checkout actions). The goal is to list products with images, price, condition, etc., and let people contact me via WhatsApp.

The site will be:
- Using Firebase (Firestore + Storage + Authentication).
- Using Angular with AngularFire, Tailwind CSS 4.1, and PrimeNG.

All interface text must be in SPANISH (labels, buttons, placeholders, messages, headings, etc.), even if code identifiers are in English.

================================
TECH STACK & TOOLS
================================
Use the following stack:

- Framework: Angular (latest stable version).
- Routing: Angular Router.
- Firebase:
  - Firestore: single collection named "products".
  - Storage: for product images.
  - Authentication: for CMS access (use Email/Password login form).
- AngularFire: for Firebase integration.
- UI:
  - Tailwind CSS 4.1 (mobile-first design, use dvh instead of vh for heights).
  - PrimeNG component library.
- Deployment:
  - App deployable to GitHub Pages (single-page application).

================================
DATA MODEL
================================
Every product is a document in the Firestore collection "products" with this structure:

{
  "name": "string",
  "reference": "string | undefined",
  "category": "string",
  "condition": "string",
  "condition_scale": "number",
  "brand": "string | undefined",
  "use_time": {
    "value": "number",
    "unit": "Meses | Años"
  },
  "purchase_date": "string",
  "total_lifetime": {
    "value": "number",
    "unit": "Meses | Años"
  },
  "current_price": "number",
  "proposed_price": "number",
  "internal_category": "Venta | Donación",
  "subcategory": "string | undefined",
  "model": "string | undefined",
  "market_link": "string",
  "images": "string[]",   // Array of image URLs (from Firebase Storage)
  "status": "Disponible | Vendido | Donado"  // add this field if needed
}

Even though the data model keys are in English, all the visible UI labels should appear in Spanish. For example:
- name → “Nombre”
- brand → “Marca”
- condition → “Condición”
- proposed_price → “Precio propuesto”
- etc.

================================
ROUTING STRUCTURE
================================
Create these routes:

1) '/home'
   - This is a splash / intro screen.
   - Shows a single PNG image centered on a mobile screen (e.g. logo or “Catálogo Hanes”).
   - The image should appear with a 500ms transition (fade-in or simple animation).
   - After 1 second (1000ms) from the image being visible, automatically redirect to '/productos'.
   - Use dvh instead of vh for full height (mobile-first layout).

2) '/productos'
   - This is the public catalog page.
   - Fetch all products from Firestore collection 'products' using AngularFire.
   - Show a search & filter panel at the top:
     - Text input to search by product name (“Buscar por nombre”).
     - Radio button group to filter by category, with one option per unique category present in the products list (“Todas”, “Cocina”, “Tecnología”, etc.). Categories must be dynamically generated from the unique values of 'category' in the products collection.
   - Group products by category:
     - For each category group:
       - Show a heading with the category name.
       - Separate each category group with a PrimeNG `<p-divider>` component.
   - Product list layout:
     - Mobile-first layout, show up to 4 products per “screen view” (you can use a simple vertical list and rely on scrolling, but optimize layout for small screens).
     - For each product, show:
       - name
       - brand
       - reference
       - condition_scale (e.g. “8/10” or similar)
       - use_time (e.g. “7 meses de uso”)
       - proposed_price (e.g. “$ 800.000”)
     - Each product component/card must:
       - Use a PrimeNG Carousel to show the images array (images[]), with swipe support on mobile.
       - On top of the carousel, show a PrimeNG Tag component that displays the 'status' field:
         - “Disponible” with green color.
         - “Vendido” with red color.
         - “Donado” with red color.
       - Include a small WhatsApp button (icon or small button) for each product. Clicking it should open WhatsApp with this pre-filled message (in URL encoding if needed):
         "Hola, me interesa saber más de {name} {brand} {reference}"
         Sent to the number: +57 319 617 5263.
         Use the official WhatsApp URL scheme: https://wa.me/<number>?text=...
   - All UI text must be in Spanish, e.g.:
     - “Productos”
     - “Categoría”
     - “Buscar por nombre”
     - “Ver más detalles”, etc.

3) '/cms'
   - This is the catalog admin (Gestor del Catálogo Hanes).
   - Protected by a route guard:
     - If the user is NOT authenticated (Firebase Auth), redirect to '/login'.
     - If authenticated, allow access.
   - Layout:
     - Show a heading: “Gestor del Catálogo Hanes”.
   - Content:
     - Use a PrimeNG DataView component to show all products from Firestore 'products'.
     - Above the DataView, include a button “Crear nuevo producto”.
       - Clicking this opens a form (you can use a dialog or navigate to a form page) to create a new product (new document in 'products' collection).
     - Each item in the DataView should:
       - Show key attributes (name, category, brand, proposed_price, status, internal_category).
       - Include an “Editar” button.
         - Clicking “Editar” opens a PrimeNG Dialog containing a Reactive Form (Angular Reactive Forms).
         - This form lets the user edit ANY attribute of the product document (including images if needed, but at least all scalar fields).
         - On submit, update the corresponding document in Firestore.
     - For images:
       - Add a simple UI to upload images to Firebase Storage and save the resulting download URLs into the 'images' array field of the product document.

4) '/login'
   - Basic login page for admins.
   - Use Firebase Authentication with Email/Password.
   - Use AngularFireAuth.
   - Show a Reactive Form with:
     - Email
     - Password
   - Button “Iniciar sesión”.
   - On successful login, redirect to '/cms'.
   - On failure, show an error message in Spanish.
   - Do NOT expose any Firebase secrets directly in the code examples; show placeholders for environment variables.

================================
ARCHITECTURE & FILE STRUCTURE
================================
Create a clean Angular architecture, for example:

- src/
  - app/
    - core/
      - guards/
        - auth.guard.ts  // route guard to protect /cms
      - services/
        - products.service.ts  // CRUD and querying logic using AngularFire
        - auth.service.ts      // wrapper around AngularFireAuth
    - modules/
      - public/
        - pages/
          - home/
            - home.component.ts/html/css
          - productos/
            - productos.component.ts/html/css
            - product-card/
              - product-card.component.ts/html/css
      - cms/
        - pages/
          - cms/
            - cms.component.ts/html/css  // DataView + “Crear nuevo producto”
        - components/
          - product-edit-dialog/
            - product-edit-dialog.component.ts/html/css
      - auth/
        - pages/
          - login/
            - login.component.ts/html/css
    - app-routing.module.ts
    - app.component.ts/html/css
  - environments/
    - environment.ts
    - environment.prod.ts
  - styles.(css|css) // Tailwind base styles

This structure is a suggestion; you can propose a similar clean modular structure.

================================
TAILWIND & MOBILE-FIRST
================================
- Configure Tailwind CSS 4.1 in the Angular project.
- Use mobile-first responsive classes (small screens as the primary target).
- Use CSS units dvh instead of vh wherever a full-height layout is needed (e.g. for home splash screen, main container heights).
- Ensure components look good on mobile: spacing, typography, cards, and carousel.

================================
PRIMENG
================================
- Configure PrimeNG correctly (theme, styles, PrimeIcons).
- Use:
  - p-divider for category separation.
  - p-carousel for product images.
  - p-dataView for CMS list.
  - p-dialog for edit dialogs.
  - p-tag for status indicator.
  - Additional components where useful (buttons, inputs, radio buttons, etc.).
  - Use float label for all the p-select, input, datepicker elements

================================
FIREBASE INTEGRATION & REQUIREMENTS
================================
Use AngularFire to connect to Firebase.

The code must:
- Read Firebase config from environment files:
  - environment.ts
  - environment.prod.ts
- Initialize:
  - Firebase app.
  - Firestore.
  - Storage.
  - Auth.

Do NOT hardcode real keys. Use placeholders like:

export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};

Also, generate a README section that clearly lists all requirements for the app to work correctly, including:

- Firebase project creation steps.
- Firestore setup with collection “products”.
- Firestore security rules suggestion (e.g. public read for catalog, restricted write for authenticated users).
- Firebase Authentication setup (Email/Password provider enabled).
- Firebase Storage setup and required rules.
- Necessary configuration files:
  - Angular environment files with Firebase config.
  - (Optionally) service account key file (serviceAccountKey.json) ONLY for backend/admin scripts, not for frontend:
    - Explain that this file is NOT used in the browser, but is needed if I want to run Node.js admin scripts to seed data or manage products offline.
- GitHub Pages deployment considerations:
  - How to build the Angular app for production.
  - How to configure GitHub Pages for an Angular SPA (e.g. using hash-based routing or 404.html redirect).
  - Any necessary changes to base href or routing strategy.

================================
SERVICES & GUARDS
================================
Implement:

1) ProductsService (Angular service)
   - Methods:
     - getAllProducts()
     - getProductsByCategory(category: string)
     - searchProductsByName(name: string)
     - createProduct(product: Product)
     - updateProduct(id: string, product: Partial<Product>)
     - (optional) deleteProduct(id: string)
     - getImages(product_id: string), firebase storage will have folders named with the product's document id in the root folder, then fetch all the images inside the folder
   - Use AngularFire Firestore.

2) AuthService (Angular service)
   - Methods:
     - login(email, password)
     - logout()
     - getCurrentUser() as observable.
   - Use AngularFireAuth.

3) AuthGuard
   - Implements CanActivate.
   - Checks if user is authenticated.
   - If not authenticated, redirect to '/login'.

================================
DELIVERABLES
================================
Produce:


1) Main Angular source files:
   - Components and modules described above (with at least minimal HTML/TS to show structure and usage of Tailwind + PrimeNG).
   - Services and guard implementations.

2) Example HTML/TS for:
   - /home splash screen with 500ms image transition and 1s redirect.
   - /productos page:
     - Search/filter panel.
     - Category grouping with p-divider.
     - Product card with carousel, status tag, WhatsApp button.
   - /cms page:
     - PrimeNG DataView with products.
     - “Crear nuevo producto” button and dialog or form.
     - “Editar” dialog with Reactive Form.
   - /login page:
     - Email/password form and error handling.

3) README.md
   - In English or Spanish, but must clearly describe:
     - How to install and run the project locally.
     - How to configure Firebase (what values to put in environment files).
     - How to set Firestore rules and Storage rules.
     - How to deploy the app to GitHub Pages.
     - What optional files are needed for admin scripts (e.g. serviceAccountKey.json) and a warning NOT to commit them.

Make sure all UI text visible to the end user is in Spanish, the layout is mobile-first, and the code is clean and well-structured.
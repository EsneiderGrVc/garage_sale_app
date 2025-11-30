# Catálogo Hanes - Garage Sale App

A complete Angular application for managing and displaying a second-hand products catalog. This application uses Firebase for backend services, PrimeNG for UI components, and Tailwind CSS for styling.

## Tech Stack

- **Angular 21** - Frontend framework
- **Firebase** - Backend services (Firestore, Storage, Authentication)
- **AngularFire** - Firebase integration for Angular
- **PrimeNG** - UI component library
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **TypeScript** - Programming language

## Features

- **Public Catalog** (`/productos`) - Browse products with search and category filters
- **Admin CMS** (`/cms`) - Manage products (create, edit, delete)
- **Authentication** - Secure admin access with Firebase Auth
- **Image Management** - Upload and manage product images via Firebase Storage
- **WhatsApp Integration** - Direct contact via WhatsApp for each product
- **Mobile-First Design** - Responsive layout optimized for mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v10 or higher)
- Firebase account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd garage_sale_app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag is required due to AngularFire compatibility with Angular 21.

3. Configure Firebase (see Firebase Setup section below)

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Configure Firebase Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Create an admin user:
   - Go to **Authentication** > **Users**
   - Click "Add user"
   - Enter email and password (save these credentials for login)

### 3. Set up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **production mode** (we'll set up rules next)
4. Choose a location for your database
5. Create the `products` collection:
   - Click "Start collection"
   - Collection ID: `products`
   - Document ID: Auto-generate
   - Add a test document with the following fields (you can delete it later):
     - `name` (string)
     - `category` (string)
     - `condition_scale` (number)
     - `proposed_price` (number)
     - `status` (string)
     - `images` (array)
     - etc. (see data model below)

### 4. Configure Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection: public read, authenticated write
    match /products/{productId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

Click "Publish" to save the rules.

### 5. Set up Firebase Storage

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Start in **production mode**
4. Choose the same location as Firestore
5. Configure Storage Rules:

Go to **Storage** > **Rules** and paste the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

Click "Publish" to save the rules.

### 6. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register the app (you can name it "Garage Sale App")
5. Copy the Firebase configuration object

### 7. Update Environment Files

Update the following files with your Firebase configuration:

**`src/environments/environment.ts`** (development):
```typescript
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
```

**`src/environments/environment.prod.ts`** (production):
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

Replace all `YOUR_*` placeholders with your actual Firebase configuration values.

## Data Model

Each product document in the `products` collection has the following structure:

```typescript
{
  name: string;                    // Product name
  reference?: string;             // Optional reference code
  category: string;               // Product category
  condition: string;              // Condition description
  condition_scale: number;        // Condition rating (0-10)
  brand?: string;                 // Optional brand name
  use_time: {
    value: number;
    unit: "Meses" | "Años";
  };
  purchase_date: string;          // ISO date string
  total_lifetime: {
    value: number;
    unit: "Meses" | "Años";
  };
  current_price: number;          // Original price
  proposed_price: number;         // Selling price
  internal_category: "Venta" | "Donación";
  subcategory?: string;
  model?: string;
  market_link: string;            // External marketplace link
  images: string[];               // Array of Firebase Storage URLs
  status: "Disponible" | "Vendido" | "Donado";
}
```

## Application Routes

- `/home` - Splash screen with logo (auto-redirects to `/productos` after 1 second)
- `/productos` - Public product catalog with search and filters
- `/login` - Admin login page
- `/cms` - Admin dashboard for managing products (protected route)

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment to GitHub Pages

### Option 1: Using Hash-based Routing (Recommended for GitHub Pages)

1. Update `angular.json` to set the base href:
```json
"build": {
  "options": {
    "baseHref": "/garage_sale_app/",  // Replace with your repo name
    ...
  }
}
```

2. Update `app.routes.ts` to use hash-based routing:
```typescript
import { provideRouter, withHashLocation } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideRouter(routes, withHashLocation()),
    ...
  ],
};
```

3. Build the application:
```bash
npm run build
```

4. Install `angular-cli-ghpages`:
```bash
npm install -g angular-cli-ghpages
```

5. Deploy:
```bash
npx angular-cli-ghpages --dir=dist/garage_sale_app/browser
```

### Option 2: Using 404.html Redirect (Alternative)

1. Create a `404.html` file in your repository root:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Garage Sale App</title>
  <script>
    sessionStorage.redirect = location.href;
    location.replace(location.href.replace(/\/[^\/]+$/, '/index.html'));
  </script>
</head>
<body></body>
</html>
```

2. Build and deploy as above, but copy `index.html` to `404.html` in the dist folder before deploying.

3. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select the branch containing your built files
   - Select the `/docs` or root folder

## Admin Scripts (Optional)

If you want to run Node.js scripts to seed data or manage products offline, you'll need a service account key:

### ⚠️ IMPORTANT SECURITY WARNING

**NEVER commit `serviceAccountKey.json` to your repository!**

1. Generate a service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in your project root

2. Add to `.gitignore`:
```
serviceAccountKey.json
```

3. Use this file only in Node.js scripts, never in the browser/client code.

## Development

### Running the Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`. The app will automatically reload if you change any source files.

### Code Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Route protection
│   │   ├── models/
│   │   │   └── product.model.ts        # Product interface
│   │   └── services/
│   │       ├── auth.service.ts         # Authentication service
│   │       └── products.service.ts     # Products CRUD service
│   ├── modules/
│   │   ├── auth/
│   │   │   └── pages/
│   │   │       └── login/              # Login component
│   │   ├── cms/
│   │   │   ├── components/
│   │   │   │   └── product-edit-dialog/ # Product form dialog
│   │   │   └── pages/
│   │   │       └── cms/                 # CMS dashboard
│   │   └── public/
│   │       └── pages/
│   │           ├── home/               # Splash screen
│   │           └── productos/           # Public catalog
│   │               └── product-card/    # Product card component
│   ├── app.config.ts                   # App configuration
│   ├── app.routes.ts                   # Routing configuration
│   └── app.html                         # Root template
├── environments/
│   ├── environment.ts                   # Dev environment config
│   └── environment.prod.ts             # Prod environment config
└── styles.css                           # Global styles (Tailwind)
```

## Troubleshooting

### Firebase Connection Issues

- Verify your Firebase configuration in environment files
- Check that Firestore and Storage are enabled in Firebase Console
- Ensure security rules allow the operations you're trying to perform

### Build Errors

- Make sure all dependencies are installed: `npm install --legacy-peer-deps`
- Clear node_modules and reinstall if needed
- Check that your Node.js version is compatible (v18+)

### Routing Issues on GitHub Pages

- Use hash-based routing for GitHub Pages (see deployment section)
- Ensure baseHref is correctly set in angular.json

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

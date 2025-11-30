import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/public/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./modules/public/pages/productos/productos.component').then(
        (m) => m.ProductosComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'cms',
    loadComponent: () =>
      import('./modules/cms/pages/cms/cms.component').then(
        (m) => m.CmsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

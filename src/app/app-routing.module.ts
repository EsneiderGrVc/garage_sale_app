import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/public/pages/home/home-page.component';
import { ProductosPageComponent } from './modules/public/pages/productos/productos-page.component';
import { CmsPageComponent } from './modules/cms/pages/cms/cms-page.component';
import { LoginPageComponent } from './modules/auth/pages/login/login-page.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'productos', component: ProductosPageComponent },
  { path: 'cms', component: CmsPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { homeGuard } from './guards/home/home.guard';
import { loginGuard } from './guards/login/login.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [homeGuard],
  },
  {
    path: 'add-student',
    loadComponent: () =>
      import('./pages/add-student-page/add-student-page.component').then(
        (c) => c.AddStudentPageComponent
      ),
    canActivate: [homeGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (c) => c.RegisterPageComponent
      ),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.routes').then((t) => t.routes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

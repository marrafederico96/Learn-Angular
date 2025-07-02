import { Routes } from '@angular/router';
import { AuthFormComponent } from './component/auth-form/auth-form.component';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "auth/register", component: AuthFormComponent },
    { path: "auth/login", component: AuthFormComponent },
    { path: "dashboard", component: Dashboard, canActivate: [authGuard] }
];

import { Routes } from '@angular/router';
import { AuthFormComponent } from './component/auth-form/auth-form.component';
import { Home } from './component/home/home';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "auth/register", component: AuthFormComponent },
    { path: "auth/login", component: AuthFormComponent }

];

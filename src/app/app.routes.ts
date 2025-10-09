import { Routes } from '@angular/router';
import { MedicineList } from '../components/medicine-list/medicine-list';
import { MedicineForm } from '../components/medicine-form/medicine-form';
import { SaleComponent } from '../components/sale/sale.compenent';
import { Dashboard } from '../components/dashboard/dashboard';
import { Login } from '../components/login/login';
import { authGuard } from '../guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/medicines', pathMatch: 'full' },
     { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'medicines', component: MedicineList},
    { path: 'medicines/add', component: MedicineForm, canActivate: [authGuard] },
    { path: 'medicines/edit/:id', component: MedicineForm, canActivate: [authGuard] },
    { path: 'sales', component: SaleComponent, canActivate: [authGuard]  },
    { path: '**', redirectTo: '' } // Redirige les routes inconnues vers l'accueil
];

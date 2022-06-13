import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/all/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrar-gasto',
    loadChildren: () => import('./pages/all/registrar-gasto/registrar-gasto.module').then( m => m.RegistrarGastoPageModule)
  },
  {
    path: 'ver-gastos',
    loadChildren: () => import('./pages/all/ver-gastos/ver-gastos.module').then( m => m.VerGastosPageModule)
  },
  {
    path: 'ver-gastos-familia',
    loadChildren: () => import('./pages/admin/ver-gastos-familia/ver-gastos-familia.module').then( m => m.VerGastosFamiliaPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/all/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/all/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'createfamily',
    loadChildren: () => import('./pages/all/createfamily/createfamily.module').then( m => m.CreatefamilyPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/all/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/all/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'update-family',
    loadChildren: () => import('./pages/admin/update-family/update-family.module').then( m => m.UpdateFamilyPageModule)
  },
  {
    path: 'list-familymembers',
    loadChildren: () => import('./pages/admin/list-familymembers/list-familymembers.module').then( m => m.ListFamilymembersPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/all/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'registrar-presupuestos',
    loadChildren: () => import('./pages/admin/registrar-presupuestos/registrar-presupuestos.module').then( m => m.RegistrarPresupuestosPageModule)
  },  {
    path: 'ver-presupuestos',
    loadChildren: () => import('./pages/all/ver-presupuestos/ver-presupuestos.module').then( m => m.VerPresupuestosPageModule)
  },
  {
    path: 'reporte-gastos',
    loadChildren: () => import('./pages/all/reporte-gastos/reporte-gastos.module').then( m => m.ReporteGastosPageModule)
  },
  {
    path: 'reporte-gastos-admin',
    loadChildren: () => import('./pages/admin/reporte-gastos-admin/reporte-gastos-admin.module').then( m => m.ReporteGastosAdminPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

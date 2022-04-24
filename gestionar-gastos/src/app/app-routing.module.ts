import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/all/login/login.module').then( m => m.LoginPageModule)
  },  {
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
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

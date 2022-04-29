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
  },  {
    path: 'profile',
    loadChildren: () => import('./pages/all/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'upload-pic',
    loadChildren: () => import('./pages/all/upload-pic/upload-pic.module').then( m => m.UploadPicPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'devices', loadChildren: './pages/devices/devices.module#DevicesPageModule' },
  { path: 'status', loadChildren: './pages/status/status.module#StatusPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

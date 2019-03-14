import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'owners', loadChildren: './owners/owners.module#OwnersPageModule' },
  { path: 'new-owner', loadChildren: './new-owner/new-owner.module#NewOwnerPageModule' },
  { path: 'new-pet', loadChildren: './new-pet/new-pet.module#NewPetPageModule' },
  { path: 'new-shedule', loadChildren: './new-shedule/new-shedule.module#NewShedulePageModule' },
  { path: 'pets', loadChildren: './pets/pets.module#PetsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

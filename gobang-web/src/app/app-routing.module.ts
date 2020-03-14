import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameComponent} from './game.component';
import {HomeComponent} from './home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'game/:id', component: GameComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GameComponent} from './game.component';
import {HomeComponent} from './home.component';
import {StatusMessageComponent} from './status-message.component';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {ShareTheLinkComponent} from './share-the-link/share-the-link.component';
import {HttpClientModule} from '@angular/common/http';
import {GobangService, StubGobangService} from './gobang-service';
import {BoardService} from './board-service';
import {HttpGobangService} from './http-gobang-service';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    StatusMessageComponent,
    ChessBoardComponent,
    ShareTheLinkComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: GobangService, useClass: StubGobangService},
    {provide: BoardService, useClass: BoardService}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

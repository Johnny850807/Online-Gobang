import {Component, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.component.css', './home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private gobangService: GobangService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  connectToGame() {
    console.log('Connecting to game...');
    this.gobangService.createGame()
      .forEach(game => {
          console.log('Routing to the game page.');
          this.router.navigateByUrl('game');
        }
      );
  }
}

import {Component, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.component.css', './home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Gobang';

  constructor(private gobangService: GobangService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  createGame() {
    this.gobangService.createGame()
      .subscribe(game => {
          console.log('Routing to the game page.');
          this.router.navigateByUrl(`game/${game.id}`);
        }
      );
  }
}

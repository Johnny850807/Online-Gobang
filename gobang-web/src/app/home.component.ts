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
    console.log('[HomeComponent] ngOnInit');
    this.gobangService.reset();
  }

  createGame() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline';
    this.gobangService.createGame()
      .subscribe(game => {
          console.log('Routing to the game page.');
          spinner.style.display = 'none';
          this.router.navigateByUrl(`game/${game.id}`);
        }
      );
  }
}

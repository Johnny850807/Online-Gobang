import {Component, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';
import {Router} from '@angular/router';
import {SoundPlay} from "./sound-play";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.component.css', './home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Gobang';
  blocked = false;

  constructor(private gobangService: GobangService,
              private soundPlay: SoundPlay,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log('[HomeComponent] ngOnInit');
    this.gobangService.reset();
    this.soundPlay.subscribe(this.gobangService);
  }

  createGame() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline';
    this.blocked = true;
    setTimeout(() => {
      this.gobangService.createGame()
        .subscribe(game => {
            console.log('Routing to the game page.');
            spinner.style.display = 'none';
            this.blocked = false;
            this.router.navigateByUrl(`game/${game.id}`);
          }
        );
    }, 3000);
  }
}

import {Component, OnInit} from '@angular/core';
import {GobangService} from './gobang-service';
import {Router} from '@angular/router';
import {of} from "rxjs";

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

  onResize(event) {
    // const middlePanel = document.getElementById('middle-panel');
    // const titleBanner = document.getElementById('title-banner');
    // const overlappingHeight = 66 + middlePanel.clientHeight; // height Of the title banner overlapping with the middlePanel
    // const offsetY = document.body.clientHeight / 2 - overlappingHeight / 2;
    // titleBanner.style.top = `${offsetY}px`;
    // middlePanel.style.top
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

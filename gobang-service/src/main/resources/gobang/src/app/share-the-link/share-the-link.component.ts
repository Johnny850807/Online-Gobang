import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-share-the-link',
  templateUrl: './share-the-link.component.html',
  styleUrls: ['../app.component.css', './share-the-link.component.css']
})
export class ShareTheLinkComponent implements OnInit {
  @Input() link: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}

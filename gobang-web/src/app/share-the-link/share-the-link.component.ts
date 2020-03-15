import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-share-the-link',
  templateUrl: './share-the-link.component.html',
  styleUrls: ['../app.component.css', './share-the-link.component.css']
})
export class ShareTheLinkComponent implements OnInit {
  link: string;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    console.log(`[ShareTheLinkComponent]: ngOnInit`);
    this.link = window.location.href;
  }

  notifyMessage(title: string, message: string) {
    this.messageService.add({
      severity: 'success', summary: title, detail: message
    });
  }
}

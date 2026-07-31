import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent implements OnInit {
  constructor() {}
  @Input()
  user: any;

  @Output()
  subscribe = new EventEmitter();

  ngOnInit(): void {}

  subscribeToNewsletter(email: string) {
    this.subscribe.emit(email);
  }
}

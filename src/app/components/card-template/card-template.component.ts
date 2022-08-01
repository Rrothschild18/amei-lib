import {
  Component,
  OnInit,
  ContentChild,
  Input,
  ViewChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CardBodyDirective } from 'src/app/directives/card-body.directive';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss'],
})
export class CardTemplateComponent implements OnInit {
  @ContentChild(CardBodyDirective) content!: CardBodyDirective;
  @Input('data') myData!: {};
  @ViewChild(`cardBody`) contentt!: any;

  @ContentChildren(CardBodyDirective)
  templateList!: QueryList<CardBodyDirective>;

  templateListt!: any;

  children!: QueryList<any>;

  data = [1111, 2222, 3333, 4444, 5555];

  public show: boolean = false;

  constructor() {}

  ngOnInit(): void {
    let obj: any = {};

    this.templateList?.toArray().forEach((v) => {
      let index = v.cardBody;
      obj[index] = v;
    });

    this.templateListt = obj;

    console.log(this.templateListt);

    this.getChildren();
  }

  ngAfterViewInit() {
    return `Mostrar ${this.data ? 'mais' : 'menos'}`;
  }

  backgroundImage() {
    return 'https://images.unsplash.com/photo-1507281736509-c6289f1ea0f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  }

  getChildren() {
    this.data.forEach((item) => {
      let node = new ContentChildren(`${item}`);

      // console.log(node)

      // if(node) this.children.push(node)
    });
  }
}

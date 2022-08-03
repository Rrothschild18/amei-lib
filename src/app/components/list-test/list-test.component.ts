import { Template } from '@angular/compiler/src/render3/r3_ast';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NgTemplateNameDirective } from 'src/app/directives/ng-template-name.directive';

interface Country {
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  {
    name: 'Brazil',
    flag: '🇧🇷',
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
  },
  {
    name: 'Finland',
    flag: '🇫🇮',
  },
];

@Component({
  selector: 'app-list-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.scss'],
})
export class ListTestComponent implements OnInit, AfterViewInit {
  @ContentChild('country') content!: TemplateRef<any>;
  @ContentChild('default') default!: TemplateRef<any>;
  @ContentChildren(NgTemplateNameDirective)
  _templates!: QueryList<NgTemplateNameDirective>;
  @ViewChildren(TemplateRef)
  __templates!: QueryList<any>;

  // componentRef = this.viewContainerRef.createComponent<Template>();

  constructor(private viewContainerRef: ViewContainerRef) {}

  countries = COUNTRIES;

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log({
      content: this.content,
      default: this.default,
      _templates: this._templates,
      _ViewChildren: this.__templates,
    });
  }

  renderTemplate(country: any) {
    const template: TemplateRef<any> | null = this.getTemplateRefByName(
      country.name
    );

    const t = template === undefined ? this.default : template;
    debugger;
    return template || this.default;
  }

  getTemplateRefByName(name: string): TemplateRef<any> | null {
    const dir = this._templates.find((dir) => {
      return dir.name === name;
    });
    return dir ? dir.template : null;
  }
}

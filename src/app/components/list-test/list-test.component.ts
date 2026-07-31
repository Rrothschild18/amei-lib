import {
  AfterViewInit,
  Component,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
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
  {
    name: 'Greece',
    flag: '🇬🇷',
  },
  {
    name: 'Portugal',
    flag: '🇵🇹',
  },
];

@Component({
  selector: 'app-list-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.scss'],
})
export class ListTestComponent implements OnInit, AfterViewInit {
  @ContentChildren(NgTemplateNameDirective)
  _templates!: QueryList<NgTemplateNameDirective>;
  @ViewChildren(TemplateRef)
  __templates!: QueryList<any>;

  constructor() {}

  countries = COUNTRIES;

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log({
      _templates: this._templates,
      _ViewChildren: this.__templates,
    });
  }

  getTemplateRefByName(name: string): TemplateRef<any> | null {
    const dir = this._templates.find((dir) => dir.name === name);

    return dir ? dir.template : null;
  }
}

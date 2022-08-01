import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cardBody]'
})
export class CardBodyDirective {

  @Input('cardBody') cardBody!: number;

  constructor(public templateRef: TemplateRef<unknown>) { }

}

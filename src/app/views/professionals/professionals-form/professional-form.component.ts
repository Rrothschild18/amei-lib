import { Component, OnInit } from '@angular/core';
import { FormViewService } from 'src/app/components/form-view/form-view.service';

@Component({
  selector: 'app-professional-form',
  templateUrl: './professional-form.component.html',
  styleUrls: ['./professional-form.component.scss'],
  providers: [{ provide: FormViewService }],
})
export class ProfessionalFormComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isOpen = false;

  links = [
    {
      linkTo: '/professionals/new',
      pathName: 'Cadastro do profissional',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/patients/new',
      pathName: 'Cadastro pacientes',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/employees/new',
      pathName: 'Cadastro funcionarios',
      iconName: 'monetization_on',
    },
    // {
    //   linkTo: '/calendar',
    //   pathName: 'Calendario',
    //   iconName: 'monetization_on',
    // },
    {
      linkTo: '/calendar-month',
      pathName: 'Calendario Mes',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/financial-accounts/new',
      pathName: 'Contas financeiras',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/financial-accounts-two/new',
      pathName: 'Contas financeiras 2',
      iconName: 'monetization_on',
    },
  ];

  menuItens = [
    {
      name: 'Agenda',
      linkTo: '/',
      iconName: 'event_available',
    },
    {
      name: 'Sala de espera',
      linkTo: '/',
      iconName: 'timelapse',
    },
    {
      name: 'Pacientes',
      linkTo: '/patients',
      iconName: 'people_alt',
    },
    {
      name: 'Financeiro',
      linkTo: '/',
      iconName: 'monetization_on',
    },
    {
      name: 'Convênios',
      linkTo: '/',
      iconName: 'medical_services',
    },
    {
      name: 'Laboratórios',
      linkTo: '/',
      iconName: 'monetization_on',
    },
    {
      name: 'Cadastros',
      linkTo: '/',
      iconName: 'lightbulbn',
    },
    {
      name: 'Relatórios',
      linkTo: '/',
      iconName: 'description',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  handleClosed() {
    console.log('IsClosing');
  }

  changeSideNavLinks() {
    console.log('change');
  }
}

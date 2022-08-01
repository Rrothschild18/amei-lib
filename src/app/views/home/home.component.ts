import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isOpen = false;

  links = [
    {
      linkTo: '/home',
      pathName: 'Cadastro do profissional',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/home',
      pathName: 'Procedimento de agenda',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/home',
      pathName: 'Horários de atendimento',
      iconName: 'monetization_on',
    },
    {
      linkTo: '/home',
      pathName: 'Splits recebidos',
      iconName: 'monetization_on',
    },
  ];

  menuItens = [
    {
      name: 'Agenda',
      iconName: 'event_available',
    },
    {
      name: 'Sala de espera',
      iconName: 'timelapse',
    },
    {
      name: 'Pacientes',
      iconName: 'people_alt',
    },
    {
      name: 'Financeiro',
      iconName: 'monetization_on',
    },
    {
      name: 'Convênios',
      iconName: 'medical_services',
    },
    {
      name: 'Laboratórios',
      iconName: 'monetization_on',
    },
    {
      name: 'Cadastros',
      iconName: 'lightbulbn',
    },
    {
      name: 'Relatórios',
      iconName: 'description',
    },
  ];

  constructor() {}

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

  url() {
    return 'https://pokeapi.co/api/v2/pokemon/ditto';
  }

  handleFetchSuccess(payload: any) {
    console.log(payload);
  }
}

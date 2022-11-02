import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, take, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  AutocompleteOption,
  IExpertiseAreaFromApi,
  IProcedureFromApi,
} from 'src/app/components/autocomplete/multiselect-autocomplete.interface';

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

  proceduresRoute = `https://amei-dev.amorsaude.com.br/api/v1/procedimentos`;
  headers = {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJKb8OjbyBkYSBTaWx2YSIsImxvZ2dlZENsaW5pYyI6bnVsbCwicm9sZSI6InVzZXIiLCJyb2xlSWQiOnsiaWQiOjEsImRlc2NyaWNhbyI6Ik1BVFJJWiJ9LCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTY2NzM5NDY2NiwiZXhwIjoxNjY3NDIzNDY2fQ.Ip3B5sOusXNOspJQ0QdlyDMImAhwguUrJG2FEycpRIE`,
  };

  proceduresList$: Observable<AutocompleteOption[]> = this.http
    .get<IProcedureFromApi[]>(
      `https://amei-dev.amorsaude.com.br/api/v1/procedimentos/professional?professionalId=289`,
      {
        headers: this.headers,
      }
    )
    .pipe(
      map((proceduresFromApi) =>
        proceduresFromApi
          .map((procedure: IProcedureFromApi) => ({
            label: procedure.nome,
            value: procedure.id,
          }))
          .slice(0, 10)
      )
    );

  selectedOptions$!: Observable<AutocompleteOption[]>;

  constructor(private http: HttpClient) {}

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

  getFilteredExpertiseAreasByQuery(): void {
    // const filteredExpertiseAreas = await firstValueFrom(
    //   this.expertiseAreaService.listExpertiseAreasByProfessionalId(
    //     this.professionalId
    //   )
    // );
    // if (value.length > 2) {
    //   this.handleFilteredExpertiseAreas(filteredExpertiseAreas, value);
    //   return;
    // }
    // this.handleFilteredExpertiseAreas(
    //   filteredExpertiseAreas.slice(0, 10),
    //   value
    // );
  }

  getResults(event: any) {
    console.log(event);
  }

  getQuery(event: any) {
    console.log(event);
  }

  onSelectedOptions(event: Observable<AutocompleteOption[]>): void {
    this.selectedOptions$ = event;
  }
}

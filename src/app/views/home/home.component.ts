import { HttpClient, HttpParams } from '@angular/common/http';
import {
  map,
  Observable,
  take,
  tap,
  switchMap,
  startWith,
  BehaviorSubject,
  combineLatest,
  of,
} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  AutocompleteOption,
  IExpertiseAreaFromApi,
  IProcedureFromApi,
  IProcedureListFromApi,
} from 'src/app/components/autocomplete/multiselect-autocomplete.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isOpen = false;

  userSearch$!: Observable<string>;

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
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJOb21lIDIgU29icmVub21lIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTQzMzM2NywiZXhwIjoxNjc1NDYyMTY3fQ.Bn9E5huU7Uf51we3dt9sLx_IJ9KP22mFMjHMhiTQcks`,
  };
  // https://amei-dev.amorsaude.com.br/api/v1/procedimentos/filter/?page=1&limit=40&name=Estudo&active=true

  expertiseAreaList$: Observable<AutocompleteOption[]> =
    this.expertiseAreasFromApi();

  proceduresList$: Observable<AutocompleteOption[]> = this.proceduresFromApi();

  proceduresList$$!: Observable<AutocompleteOption[]>;

  selectedOptions$!: Observable<AutocompleteOption[]>;

  selectedExpertiseAreaOptions$!: Observable<AutocompleteOption[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.proceduresList$$ = this.filteredProceduresByExpArea();
  }

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

  expertiseAreas(): void {
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

  onSelectedExpertiseAreaOptions(
    event: Observable<AutocompleteOption[]>
  ): void {
    debugger;
    this.selectedExpertiseAreaOptions$ = event;
  }

  onUserSearchToApi(event: Observable<string>) {
    this.userSearch$ = event;
  }

  proceduresFromApi() {
    return this.http
      .get<IProcedureListFromApi>(
        `https://amei-dev.amorsaude.com.br/api/v1/procedimentos/filter/?page=1&limit=40`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((proceduresFromApi) =>
          proceduresFromApi.items.map((procedure: IProcedureFromApi) => ({
            label: procedure.nome,
            value: procedure.id,
          }))
        )
      );
  }

  expertiseAreasFromApi() {
    return this.http
      .get<IExpertiseAreaFromApi[]>(
        `https://amei-dev.amorsaude.com.br/api/v1/especialidades/?page=1&limit=999`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((expertiseAreasFromApi) =>
          expertiseAreasFromApi.map((expertiseArea: IExpertiseAreaFromApi) => ({
            label: expertiseArea.descricao,
            value: expertiseArea.id,
          }))
        )
      );
  }

  filteredProceduresByExpArea() {
    return combineLatest({
      procedureName: this.userSearch$ || of(''),
      expertiseAreas: this.selectedExpertiseAreaOptions$ || of(null),
    }).pipe(
      switchMap(({ procedureName, expertiseAreas }) => {
        debugger;
        let expertiseAreasIds =
          expertiseAreas?.map((expArea) => expArea.value) || [];

        return this.http
          .get<IProcedureListFromApi>(
            `https://amei-dev.amorsaude.com.br/api/v1/procedimentos/filter/?page=1&limit=900${
              procedureName ? `&name=${procedureName}` : ''
            }${
              expertiseAreasIds.length
                ? `&specialtyIds=${expertiseAreasIds}`
                : ''
            }`,
            {
              headers: this.headers,
            }
          )
          .pipe(
            map((proceduresFromApi) => {
              return proceduresFromApi.items.map(
                (procedure: IProcedureFromApi) => ({
                  label: procedure.nome,
                  value: procedure.id,
                })
              );
            })
          );
      })
    );
  }
}

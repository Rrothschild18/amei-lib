import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AutocompleteComponent } from './../../components/autocomplete/autocomplete.component';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  Observable,
  takeUntil,
  tap,
  map,
  switchMap,
  of,
  combineLatest,
  take,
  BehaviorSubject,
  Subject,
} from 'rxjs';
import {
  AutocompleteOption,
  IExpertiseAreaFromApi,
} from 'src/app/components/autocomplete/multiselect-autocomplete.interface';
import {
  IExpertiseArea,
  IProcedureGroupFromApi,
  IProcedureSimpleFromApi,
  IProcedureTypeFromApi,
  IProcedureTypeRequestParam,
  IProcedureTypeResponse,
} from './generalTypesForThatView';

@Component({
  selector: 'app-professional-procedures',
  templateUrl: './professional-procedures.component.html',
  styleUrls: ['./professional-procedures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalProceduresComponent implements OnInit {
  professionalId: number = 265;

  professionalExpertiseAreas$!: Observable<AutocompleteOption[]>;
  professionalExpertiseAreas: AutocompleteOption[] = [];

  proceduresTypes$!: Observable<AutocompleteOption[]>;
  proceduresGroups$!: Observable<AutocompleteOption[]>;

  procedures$!: Observable<AutocompleteOption[]>;
  procedures: AutocompleteOption[] = [];

  selectedExpertiseArea$ = new BehaviorSubject<AutocompleteOption[]>([]);
  selectedProcedureType$ = new BehaviorSubject<AutocompleteOption[]>([]);
  selectedProcedureGroup$ = new BehaviorSubject<AutocompleteOption[]>([]);

  selectedProceduresByExpertiseAreass$ = new BehaviorSubject<{
    [key: string | number]: AutocompleteOption[];
  }>({});

  selectedProceduresByExpertiseAreas$!: Observable<AutocompleteOption[]>;

  destroy$ = new Subject();

  @ViewChildren('procedureLazyMultiSelect')
  procedureLazyMultiSelect!: QueryList<AutocompleteComponent>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.professionalExpertiseAreas$ = this.fetchProfessionalExpertiseAreas();
    this.proceduresTypes$ = this.fetchProceduresTypes();
    this.proceduresGroups$ = this.fetchProceduresGroups();
    this.procedures$ = this.fetchProcedures();
    this.selectedProceduresByExpertiseAreas$ =
      this.calculateCurrentSelectedProcedures();
  }

  onSelectedExpertiseAreaOptions(
    event: Observable<AutocompleteOption[]>
  ): void {
    event
      .pipe(
        takeUntil(this.destroy$),
        tap((selectedExpertiseArea) => {
          this.selectedExpertiseArea$.next(selectedExpertiseArea);

          if (!selectedExpertiseArea.length) {
          }
          this.procedureLazyMultiSelect?.first?.searchControl.disable();
        })
      )
      .subscribe();
  }

  onSelectedProcedureTypeOptions(
    event: Observable<AutocompleteOption[]>
  ): void {
    event.pipe(takeUntil(this.destroy$)).subscribe((procedureType) => {
      this.selectedProcedureType$.next(procedureType);
    });
  }

  onSelectedProcedureGroupOptions(
    event: Observable<AutocompleteOption[]>
  ): void {
    event.pipe(takeUntil(this.destroy$)).subscribe((procedureGroup) => {
      this.selectedProcedureGroup$.next(procedureGroup);
    });
  }

  onSelectedProcedure(event: Observable<AutocompleteOption[]>): void {
    event
      .pipe(takeUntil(this.destroy$))
      .subscribe((incomingSelectedProcedures) => {
        const selectedExpertiseAreaId =
          this.selectedExpertiseArea$.getValue()[0]?.value ?? false;

        if (!selectedExpertiseAreaId) return;

        let currSelectedProcedures =
          this.selectedProceduresByExpertiseAreass$.getValue();
        let currSelectedProceduresByArea =
          currSelectedProcedures[selectedExpertiseAreaId] || [];
        let hasPreviousSelectedProcedures =
          !!currSelectedProceduresByArea.length;
        let deleteProceduresFromActualFiltering = this.procedures.filter(
          (procedure) =>
            !incomingSelectedProcedures.find((p) => procedure.value === p.value)
        );

        //Just add current incoming selected proc
        if (!hasPreviousSelectedProcedures) {
          this.selectedProceduresByExpertiseAreass$.next({
            ...currSelectedProcedures,
            [selectedExpertiseAreaId]: incomingSelectedProcedures,
          });

          return;
        }

        const newUniqueCurrentSelectedProcedures =
          currSelectedProceduresByArea.filter(
            (procedure) =>
              !deleteProceduresFromActualFiltering.find(
                (dProcedure) => dProcedure.value === procedure.value
              )
          );

        let uniqueCompleteProc: AutocompleteOption[] = [];

        const mergedProcedures = [
          ...newUniqueCurrentSelectedProcedures,
          ...incomingSelectedProcedures,
        ];

        const mergedProcIds = mergedProcedures.map((p) => p.value);
        const uniqueProcIds = [...new Set(mergedProcIds)];

        uniqueProcIds.forEach((uniqueProcId) => {
          const found = mergedProcedures.find(
            (mergedProcedure) => mergedProcedure.value === uniqueProcId
          );
          found && uniqueCompleteProc.push(found);
        });

        if (Object.keys(currSelectedProcedures).length === 1) {
          this.selectedProceduresByExpertiseAreass$.next({
            [selectedExpertiseAreaId]: uniqueCompleteProc,
          });

          return;
        }

        if (Object.keys(currSelectedProcedures).length > 1) {
          this.selectedProceduresByExpertiseAreass$.next({
            ...currSelectedProcedures,
            [selectedExpertiseAreaId]: uniqueCompleteProc,
          });
        }
      });
  }

  fetchProceduresTypes(): Observable<AutocompleteOption[]> {
    const param: IProcedureTypeRequestParam = {
      page: 1,
      limit: 100,
    };

    return this.http
      .get<IProcedureTypeResponse>(`${this.baseUrl}/procedimentos/types`, {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>param),
      })
      .pipe(
        map((proceduresTypesFromApi: IProcedureTypeResponse) => {
          return proceduresTypesFromApi.items.map(
            (procedure: IProcedureTypeFromApi) => ({
              label: procedure.descricao,
              value: procedure.id,
            })
          );
        })
      );
  }

  fetchProceduresGroups(): Observable<AutocompleteOption[]> {
    return this.selectedProcedureType$.pipe(
      switchMap((procedureType) => {
        const hasProcedureId = !!procedureType.length;

        if (hasProcedureId) {
          return this.http.get<IProcedureGroupFromApi[]>(
            `${this.baseUrl}/procedimentos/groups/type/${+procedureType[0]
              .value}`,
            {
              headers: this.getHeader(),
            }
          );
        }

        return of([]);
      }),
      map((proceduresGroupsFromApi: IProcedureGroupFromApi[]) => {
        return proceduresGroupsFromApi.map(
          (procedure: IProcedureGroupFromApi) => ({
            label: procedure.descricao,
            value: procedure.id,
          })
        );
      })
    );
  }

  fetchProcedures(): Observable<AutocompleteOption[]> {
    return combineLatest({
      expertiseArea: this.selectedExpertiseArea$,
      procedureType: this.selectedProcedureType$,
      procedureGroup: this.selectedProcedureGroup$,
    }).pipe(
      switchMap(({ expertiseArea, procedureType, procedureGroup }) => {
        const hasExpertiseArea = !!expertiseArea.length;
        const hasProcedureGroup = !!procedureGroup.length;
        const hasProcedureType = !!procedureType.length;
        const fetchOnlyExpertiseAreas =
          hasExpertiseArea && (!hasProcedureGroup || !hasProcedureType);
        const fetchWithType = hasExpertiseArea && hasProcedureGroup;

        if (fetchOnlyExpertiseAreas) {
          return combineLatest({
            expertiseArea: this.http.get<IExpertiseAreaFromApi>(
              `${this.baseUrl}/especialidades/${+expertiseArea[0].value}`,
              {
                headers: this.getHeader(),
              }
            ),
            procedureGroup: of([]),
          });
        }

        if (fetchWithType) {
          let groupsIds = procedureGroup.map((procedure) => +procedure.value);

          return combineLatest({
            expertiseArea: this.http.get<IExpertiseAreaFromApi>(
              `${this.baseUrl}/especialidades/${+expertiseArea[0].value}`,
              {
                headers: this.getHeader(),
              }
            ),
            procedureGroup: this.http.post<IProcedureSimpleFromApi[]>(
              `${this.baseUrl}/procedimentos/groups/id-list`,
              { groupsIds },
              {
                headers: this.getHeader(),
              }
            ),
          });
        }

        return of({
          expertiseArea: {} as IExpertiseAreaFromApi,
          procedureGroup: [],
        });
      }),
      map(({ expertiseArea, procedureGroup }) => {
        const hasExpertiseArea = !!expertiseArea.procedimentos?.length;
        const hasProcedureGroup = !!procedureGroup.length;

        if (hasExpertiseArea && hasProcedureGroup) {
          const selectedProcedures =
            this.selectedProceduresByExpertiseAreass$.getValue();
          const selectedExpertiseArea = this.selectedExpertiseArea$.getValue();
          const expertiseAreaId = selectedExpertiseArea[0]?.value;
          const currProcedureByArea = Object.values(
            selectedProcedures[expertiseAreaId] || []
          );

          const expAreas = expertiseArea?.procedimentos
            ?.filter((expA) =>
              procedureGroup.find((pGroup) => pGroup.id === expA.id)
            )
            .map((filteredProcedures) => ({
              label: filteredProcedures.nome,
              value: filteredProcedures.id,
            }));

          return expAreas;
        }

        if (hasExpertiseArea && !hasProcedureGroup) {
          const expAreas: any = expertiseArea?.procedimentos.map(
            (filteredProcedures) => ({
              label: filteredProcedures.nome,
              value: filteredProcedures.id,
            })
          );

          const selectedProcedures =
            this.selectedProceduresByExpertiseAreass$.getValue();
          const selectedExpertiseArea = this.selectedExpertiseArea$.getValue();
          const expertiseAreaId = selectedExpertiseArea[0]?.value;
          const currProcedureByArea = Object.values(
            selectedProcedures[expertiseAreaId] || []
          );

          return [...expAreas, ...currProcedureByArea];
        }

        return [];
      }),
      tap((procedures) => {
        this.procedureLazyMultiSelect?.first.searchControl.enable(),
          (this.procedures = [...procedures]);
      })
    );
  }

  getExpertiseAreaName(key: any) {
    return (
      this.professionalExpertiseAreas.find(
        (expertiseArea) => expertiseArea.value === +key
      )?.label ?? '-'
    );
  }

  showProcedureName(data: any) {
    return data.label ?? '-';
  }

  removeProcedure(data: any): void {
    const key = data.expertiseAreaId;
    const procedureId = data.procedure.value.value;
    const currExpertiseArea = this.selectedExpertiseArea$.getValue();

    const currSelectedProceduresByExpertiseAreas =
      this.selectedProceduresByExpertiseAreass$.getValue();
    const selectedProcedures = currSelectedProceduresByExpertiseAreas[key];

    const notRemovingANonExistingOption =
      Number(key) !== currExpertiseArea[0]?.value ?? false;
    const existAtCurrentFiltering = this.procedures.find(
      (procedure) => procedure.value === procedureId
    );

    this.selectedProceduresByExpertiseAreass$.next({
      ...currSelectedProceduresByExpertiseAreas,
      [key]: selectedProcedures.filter(
        (procedure) => procedure.value !== procedureId
      ),
    });

    if (notRemovingANonExistingOption) return;

    if (!notRemovingANonExistingOption && !existAtCurrentFiltering) return;

    this.procedureLazyMultiSelect.first.unselectOption(procedureId);
  }

  hasSelectedProcedures(key: number | string) {
    return !!this.selectedProceduresByExpertiseAreass$.getValue()[key].length;
  }

  saveProcedures() {
    const currSelectedProcedures =
      this.selectedProceduresByExpertiseAreass$.getValue();

    const proceduresByExpertiseArea = Object.keys(
      currSelectedProcedures
    ).reduce(
      (acc: { specialtyId: number; procedureId: number }[], procedureId) => {
        acc = [
          ...acc,
          ...currSelectedProcedures[procedureId].map((procedure) => ({
            specialtyId: +procedureId,
            procedureId: +procedure.value,
          })),
        ];

        return acc;
      },
      []
    );

    const proceduresIds = [
      ...new Set(
        proceduresByExpertiseArea.map((procedure) => procedure.procedureId)
      ),
    ];

    console.log('POST PROCEDURES', {
      proceduresByExpertiseArea,
      proceduresIds,
    });
  }

  calculateCurrentSelectedProcedures(): Observable<AutocompleteOption[]> {
    return combineLatest({
      expertiseAreaId: this.selectedExpertiseArea$.pipe(
        map((expertiseArea) => {
          return expertiseArea[0]?.value;
        })
      ),
      procedures: this.selectedProceduresByExpertiseAreass$,
    }).pipe(
      map(({ expertiseAreaId, procedures }) => {
        return Object.values(procedures[expertiseAreaId] || {});
      })
    );
  }

  patchProfessionalProcedures() {
    this.http
      .get(`${this.baseUrl}/procedimentos/professional`, {
        headers: this.getHeader(),
        params: <HttpParams>(<unknown>{ professionalId: this.professionalId }),
      })
      .subscribe((procedures: any) => {
        const savedProfessionalProcedures: {
          [key: string | number]: AutocompleteOption[];
        } = procedures.reduce(
          (
            acc: {
              [key: string | number]: AutocompleteOption[];
            },
            curr: any
          ) => {
            const expertiseAreaId: number =
              curr?.proXEspXProc[0]?.specialtyId ?? 0;
            acc = {
              ...acc,
              [expertiseAreaId]: [
                ...(acc[expertiseAreaId] || []),
                { label: curr.nome, value: curr.id },
              ],
            };
            return acc;
          },
          {}
        );
        this.selectedProceduresByExpertiseAreass$.next(
          savedProfessionalProcedures
        );
      });
  }

  private getHeader(): HttpHeaders {
    const head = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
    return head;
  }

  get token(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXN1YXJpbzJAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJBRE1JTiBVU0VSIiwibG9nZ2VkQ2xpbmljIjpudWxsLCJyb2xlIjoidXNlciIsImlhdCI6MTY3ODU1NzA4NywiZXhwIjoxNjc4NTg1ODg3fQ.vQthNvHWqi6dfdvLnJJNIDwyl13Z5D98bH_wVT7tH2E';
  }

  get baseUrl(): string {
    return 'https://amei-dev.amorsaude.com.br/api/v1';
  }

  //getters for state where

  fetchProfessionalExpertiseAreas(): Observable<AutocompleteOption[]> {
    return this.http
      .get<IExpertiseArea[]>(
        `${this.baseUrl}/especialidades/profissional/${this.professionalId}`,
        {
          headers: this.getHeader(),
        }
      )
      .pipe(
        map((expertiseAreaFromApi: IExpertiseArea[]) => {
          return expertiseAreaFromApi.map((expertiseArea: any) => ({
            label: expertiseArea.descricao,
            value: expertiseArea.id,
          }));
        }),
        tap(
          (expertiseAreas) => (this.professionalExpertiseAreas = expertiseAreas)
        )
      );
  }
}

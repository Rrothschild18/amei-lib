import { Entities } from '../entities/entities.namespace';
import { ListViewService } from './../../services/list-view.service';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { EntityPayload } from '../entities/entities.model';
import { PatientStateModel } from './patient.model';

const PATIENTS_STATE_TOKEN = new StateToken<any>('Patient');

@State<PatientStateModel>({
  name: PATIENTS_STATE_TOKEN,
  defaults: {
    patients: [],
    fields: {},
    isLoading: false,
  },
})
@Injectable()
export class PatientState {
  entityName: string;

  constructor(private ls: ListViewService, private store: Store) {
    this.entityName = PATIENTS_STATE_TOKEN.getName();
  }

  @Action(Entities['Patient'].FetchAllEntities)
  fetchAll(ctx: StateContext<PatientStateModel>) {
    return this.ls.FetchAllEntities(this.entityName).pipe(
      tap(() => new Entities['Patient'].SetLoadingTrue()),
      map((response: EntityPayload) => {
        return ctx.dispatch(
          new Entities['Patient'].FetchAllPatientsSuccess(response)
        );
      }),
      catchError((error) => {
        return of(
          ctx.dispatch(
            new Entities['Patient'].FetchAllPatientsFailed({ error })
          )
        );
      }),
      tap(() => new Entities['Patient'].SetLoadingFalse())
    );
  }

  @Action(Entities['Patient'].FetchAllPatientsSuccess)
  FetchAllPatientsSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
    });

    return new Entities['Patient'].SetLoadingFalse();
  }

  @Action(Entities['Patient'].PatchPatientFields)
  PatchPatientsFields(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      fields: { ...state.fields, ...action.payload },
    });
  }

  @Action(Entities['Patient'].SetLoadingTrue)
  SetLoadingTrue(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
      isLoading: true,
    });
  }

  @Action(Entities['Patient'].SetLoadingFalse)
  SetLoadingFalse(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
      isLoading: false,
    });
  }

  @Action(Entities['Patient'].FetchPatientById)
  FetchPatientById(ctx: StateContext<PatientStateModel>, action: any) {
    const patientId = action.payload;
    debugger;
    return this.ls.FetchEntityById(this.entityName, patientId).pipe(
      tap(() => new Entities['Patient'].SetLoadingTrue()),
      map((response: EntityPayload) => {
        const formattedPayload = {
          fields: { ...response.fields },
          results: response.results.find(
            (result) => result['uuid'] === patientId
          ),
        } as EntityPayload;

        debugger;

        return ctx.dispatch(
          new Entities['Patient'].FetchPatientByIdSuccess(formattedPayload)
        );
      }),
      tap(() => {}),
      catchError((error) => {
        return of(
          ctx.dispatch(
            new Entities['Patient'].FetchAllPatientsFailed({ error })
          )
        );
      }),
      tap(() => new Entities['Patient'].SetLoadingFalse())
    );
  }

  @Action(Entities['Patient'].FetchPatientByIdSuccess)
  FetchPatientByIdSuccess(
    ctx: StateContext<PatientStateModel>,
    action: typeof Entities['Patient']['FetchPatientById']
  ) {
    const state = ctx.getState();

    debugger;

    ctx.setState({
      ...state,
      ...action.payload,
    });

    return new Entities['Patient'].SetLoadingFalse();
  }
}

import { Entities } from '../entities/entities.namespace';
import { ListViewService } from './../../services/list-view.service';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { EntityPayload } from '../entities/entities.model';
import { PatientStateModel, PatientApiSuccessResponse } from './patient.model';

const PATIENTS_STATE_TOKEN = new StateToken<any>('Patient');

@State<PatientStateModel>({
  name: PATIENTS_STATE_TOKEN,
  defaults: {
    fields: {},
    results: [],
    isLoading: false,
  },
})
@Injectable()
export class PatientState {
  entityName: string;

  constructor(private ls: ListViewService) {
    this.entityName = PATIENTS_STATE_TOKEN.getName();
  }

  @Action(Entities['Patient'].FetchAllEntities)
  fetchAll(ctx: StateContext<PatientStateModel>) {
    return this.ls.FetchAllEntities(this.entityName).pipe(
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingTrue())),
      map((response: EntityPayload) => {
        return ctx.dispatch(
          new Entities['Patient'].FetchAllPatientsSuccess(response)
        );
      }),
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingFalse())),
      catchError((error) => {
        return of(
          ctx.dispatch(
            new Entities['Patient'].FetchAllPatientsFailed({ error })
          )
        );
      })
    );
  }

  @Action(Entities['Patient'].FetchAllPatientsSuccess)
  FetchAllPatientsSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      fields: { ...state.fields, ...action.payload.fields },
    });
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
  SetLoadingTrue(ctx: StateContext<PatientStateModel>) {
    const state = ctx.getState();

    ctx.patchState({
      ...state,
      isLoading: true,
    });
  }

  @Action(Entities['Patient'].SetLoadingFalse)
  SetLoadingFalse(ctx: StateContext<PatientStateModel>) {
    const state = ctx.getState();

    ctx.patchState({
      ...state,
      isLoading: false,
    });
  }

  @Action(Entities['Patient'].FetchPatientById)
  FetchPatientById(ctx: StateContext<PatientStateModel>, action: any) {
    const patientId = action.payload;
    const state = ctx.getState();

    return this.ls.FetchEntityById(this.entityName, patientId).pipe(
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingTrue())),
      map((response: EntityPayload) => {
        const patientById = response.results.find(
          (result) => result['uuid'] === patientId
        );

        const formattedPayload = {
          fields: { ...response.fields },
          results: [...state.results, patientById],
        } as EntityPayload;

        return ctx.dispatch(
          new Entities['Patient'].FetchPatientByIdSuccess(formattedPayload)
        );
      }),
      catchError((error) => {
        return of(
          ctx.dispatch(
            new Entities['Patient'].FetchAllPatientsFailed({ error })
          )
        );
      }),
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingFalse()))
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

    return ctx.dispatch(new Entities['Patient'].SetLoadingFalse());
  }

  @Action(Entities['Patient'].CreateEntity)
  AddPatient(ctx: StateContext<PatientStateModel>, action: any) {
    const patientToAdd = action.payload;

    return this.ls.CreateEntity(this.entityName, patientToAdd).pipe(
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingTrue())),
      map((response: PatientApiSuccessResponse) =>
        ctx.dispatch(new Entities['Patient'].AddPatientSuccess(response))
      ),
      catchError((error) => {
        return of(
          ctx.dispatch(new Entities['Patient'].AddPatientError({ error }))
        );
      }),
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingFalse()))
    );
  }

  @Action(Entities['Patient'].AddPatientSuccess)
  AddPatientSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const patient = action.payload;

    const state = ctx.getState();

    ctx.patchState({
      ...state,
      results: [...state.results, patient],
    });
  }

  @Action(Entities['Patient'].PatchEntity)
  PatchPatient(ctx: StateContext<PatientStateModel>, action: any) {
    const patientToAdd = action.payload.entityPayload;
    const uuid = action.payload.entityId;

    return this.ls.PatchEntity(this.entityName, patientToAdd, uuid).pipe(
      tap(() => new Entities['Patient'].SetLoadingTrue()),
      map((response: PatientApiSuccessResponse) =>
        ctx.dispatch(new Entities['Patient'].PatchPatientSuccess(patientToAdd))
      ),
      catchError((error) => {
        return of(
          ctx.dispatch(new Entities['Patient'].PatchPatientError({ error }))
        );
      }),
      tap(() => new Entities['Patient'].SetLoadingFalse())
    );
  }

  @Action(Entities['Patient'].PatchPatientSuccess)
  PatchPatientSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const updatedPatient = action.payload;
    const state = ctx.getState();
    debugger;

    const patient = state.results.find(
      (patient) => patient.uuid === updatedPatient.uuid
    );

    if (patient) {
      const indexOf = state.results.indexOf(patient);
      state.results.splice(indexOf, 1);
    }
    debugger;

    ctx.patchState({
      ...state,
      results: [...state.results, updatedPatient],
    });
  }

  @Action(Entities['Patient'].PatchPatientSuccess)
  PatchPatientError(ctx: StateContext<PatientStateModel>, action: any) {}
}

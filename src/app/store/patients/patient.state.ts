import { Entities } from '../entities/entities.namespace';
import { ListViewService } from './../../services/list-view.service';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
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

  @Action(Entities['Patient'].FetchEntityFieldsForCreateMode)
  fetchPatientFields(ctx: StateContext<PatientStateModel>) {
    ctx.dispatch(new Entities['Patient'].SetLoadingTrue());

    return this.ls.FetchAllEntities(this.entityName).pipe(
      map((response: EntityPayload) => {
        return ctx.dispatch(
          new Entities['Patient'].FetchEntityFieldsSuccess(response)
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

  @Action(Entities['Patient'].FetchEntityFieldsSuccess)
  fetchPatientFieldsSuccess(ctx: StateContext<PatientStateModel>, action: any) {
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

  @Action(Entities['Patient'].FetchEntityById)
  FetchPatientById(ctx: StateContext<PatientStateModel>, action: any) {
    ctx.dispatch(new Entities['Patient'].SetLoadingTrue());
    const patientId = action.payload;
    const state = ctx.getState();

    const patientById = state.results.find(
      (result) => result['uuid'] === patientId
    );

    if (patientById) {
      ctx.dispatch(new Entities['Patient'].SetLoadingFalse());
      return;
    }

    return this.ls.FetchEntityById(this.entityName, patientId).pipe(
      map((response: EntityPayload) => {
        //Bypass Json-server to get response from PUT
        const patientById = response.results.find(
          (result) => result['uuid'] === patientId
        );

        const patientByIdList = state.results.find(
          (result) => result['uuid'] === patientId
        );

        const formattedPayload = {
          fields: { ...response.fields },
          results: patientByIdList
            ? state.results.map((result) =>
                result.uuid !== patientByIdList?.uuid ? result : patientById
              )
            : [...state.results, patientById],
        } as EntityPayload;

        return formattedPayload;
      }),
      tap((response) =>
        ctx.dispatch(new Entities['Patient'].FetchEntityByIdSuccess(response))
      ),
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

  @Action(Entities['Patient'].FetchEntityByIdSuccess)
  FetchPatientByIdSuccess(
    ctx: StateContext<PatientStateModel>,
    action: typeof Entities['Patient']['FetchPatientById']
  ) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
    });
  }

  @Action(Entities['Patient'].CreateEntity)
  AddPatient(ctx: StateContext<PatientStateModel>, action: any) {
    ctx.dispatch(new Entities['Patient'].SetLoadingTrue());

    const patientToAdd = action.payload;

    return this.ls.CreateEntity(this.entityName, patientToAdd).pipe(
      map((response: PatientApiSuccessResponse) =>
        ctx.dispatch(new Entities['Patient'].AddPatientSuccess(response))
      ),
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingFalse())),
      catchError((error) => {
        return of(
          ctx.dispatch(new Entities['Patient'].AddPatientError({ error }))
        );
      })
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

    ctx.dispatch(new Entities['Patient'].SetLoadingFalse());

    return of(patient);
  }

  @Action(Entities['Patient'].PatchEntity)
  PatchPatient(ctx: StateContext<PatientStateModel>, action: any) {
    ctx.dispatch(new Entities['Patient'].SetLoadingTrue());

    const patientToAdd = action.payload.entityPayload;
    const uuid = action.payload.entityId;

    return this.ls.PatchEntity(this.entityName, patientToAdd, uuid).pipe(
      map((response: PatientApiSuccessResponse) =>
        ctx.dispatch(new Entities['Patient'].PatchPatientSuccess(patientToAdd))
      ),
      catchError((error) => {
        return of(
          ctx.dispatch(new Entities['Patient'].PatchPatientError({ error }))
        );
      })
    );
  }

  @Action(Entities['Patient'].PatchPatientSuccess)
  PatchPatientSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const updatedPatient = action.payload;
    const state = { ...ctx.getState() };

    const patient = state.results.find(
      (patient) => patient.uuid === updatedPatient.uuid
    );

    const beforeUpdateResults = state.results.filter(
      (patient) => patient.uuid !== updatedPatient.uuid
    );

    if (patient) {
      ctx.patchState({
        ...state,
        results: [...beforeUpdateResults, updatedPatient],
      });
    } else {
      ctx.patchState({
        ...state,
        results: [...state.results, updatedPatient],
      });
    }

    ctx.dispatch(new Entities['Patient'].SetLoadingFalse());

    return of(patient);
  }

  @Action(Entities['Patient'].FetchAllEntities)
  fetchEntities(ctx: StateContext<PatientStateModel>) {
    ctx.dispatch(new Entities['Patient'].SetLoadingTrue());

    return this.ls.FetchAllEntities(this.entityName).pipe(
      map((response: EntityPayload) => {
        return ctx.dispatch(
          new Entities['Patient'].FetchAllEntitiesSuccess(response)
        );
      }),
      tap(() => ctx.dispatch(new Entities['Patient'].SetLoadingFalse())),
      catchError((error) => {
        return of(
          ctx.dispatch(new Entities['Patient'].FetchAllEntitiesError({ error }))
        );
      })
    );
  }

  @Action(Entities['Patient'].FetchAllEntitiesError)
  fetchListError(ctx: StateContext<PatientStateModel>, action: any) {}

  @Action(Entities['Patient'].FetchAllEntitiesSuccess)
  fetchListSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
    });
  }
}

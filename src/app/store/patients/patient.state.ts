import { Entities } from '../entities/entities.namespace';
import { ListViewService } from './../../services/list-view.service';
import {
  Action,
  Selector,
  State,
  StateContext,
  StateToken,
  Store,
} from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { EntityPayload } from '../entities/entities.model';
import { PatientStateModel } from './patient.model';

const PATIENTS_STATE_TOKEN = new StateToken<any>('Patient');

@State<PatientStateModel>({
  name: PATIENTS_STATE_TOKEN,
  defaults: {
    patients: [],
    fields: {},
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
    const response: any = this.ls.FetchAllEntities(this.entityName);

    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...response,
    });

    return this.ls.FetchAllEntities(this.entityName).pipe(
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
      })
    );
  }

  @Action(Entities['Patient'].FetchAllPatientsSuccess)
  FetchAllPatientsSuccess(ctx: StateContext<PatientStateModel>, action: any) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
    });
  }
}

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

import { Entities } from '../entities/entities.namespace';
import { ListViewService } from './../../services/list-view.service';
import { ProfessionalStateModel } from './professional.model';

const PROFESSIONAL_STATE_TOKEN = new StateToken<any>('Professional');

@State<ProfessionalStateModel>({
  name: PROFESSIONAL_STATE_TOKEN,
  defaults: {
    professional: [],
    fields: {},
  },
})
@Injectable()
export class ProfessionalState {
  entityName: string;

  constructor(private ls: ListViewService, private store: Store) {
    this.entityName = PROFESSIONAL_STATE_TOKEN.getName();
  }

  @Action(Entities['Professional'].FetchAllEntities)
  fetchAll(ctx: StateContext<ProfessionalStateModel>) {
    const response: any = this.ls.FetchAllEntities(this.entityName);

    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...response,
    });

    return this.ls.FetchAllEntities(this.entityName).pipe(
      map((response: EntityPayload) => {
        return ctx.dispatch(
          new Entities['Professional'].FetchAllProfessionalSuccess(response)
        );
      }),
      catchError((error) => {
        return of(
          ctx.dispatch(
            new Entities['Professional'].FetchAllProfessionalFailed({ error })
          )
        );
      })
    );
  }

  @Action(Entities['Professional'].FetchAllProfessionalSuccess)
  FetchAllProfessionalSuccess(
    ctx: StateContext<ProfessionalStateModel>,
    action: any
  ) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      ...action.payload,
    });
  }
}

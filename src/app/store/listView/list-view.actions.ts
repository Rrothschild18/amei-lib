export namespace FetchLists {
  export class FirstLoad {
    static readonly type = '[FetchList] First Load';
  }

  export class FetchListSuccess {
    static readonly type = '[FetchList] Fetch List Success';
    constructor(public payload: any) {}
  }

  export class FetchListFailed {
    static readonly type = '[FetchList] Fetch List Failed';
    constructor(public payload: { error: any }) {}
  }
}

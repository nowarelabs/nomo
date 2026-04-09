import { BaseController } from '@noblackbox/controllers';
import { newWorkersRpcResponse } from '@noblackbox/rpc';
import type { AppExecutionContext } from '@noblackbox/router';
import { {{pluralTypeName}}Rpc } from '../../../rpc/{{tableName}}';

export class {{pluralTypeName}}RpcController extends BaseController<Env, AppExecutionContext> {
  protected service = null;
  async rpc() {
    return newWorkersRpcResponse(this.request, new {{pluralTypeName}}Rpc(this.request, this.env, this.ctx));
  }
}

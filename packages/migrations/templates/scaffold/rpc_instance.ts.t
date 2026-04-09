import { BaseResourceInstanceRpcTarget } from '@noblackbox/rpc';
import { RouterContext } from '@noblackbox/router';
import { {{pluralTypeName}}Controller } from '../../controllers/{{tableName}}_controller';

export class {{pluralTypeName}}RpcInstance extends BaseResourceInstanceRpcTarget<
	Env,
	RouterContext<Env, any>,
	{{pluralTypeName}}Controller
> {
	protected controllerClass = {{pluralTypeName}}Controller;
}

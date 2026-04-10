import { BaseResourceInstanceRpcTarget } from 'nomo/rpc';
import { RouterContext } from 'nomo/router';
import { {{pluralTypeName}}Controller } from '../../controllers/{{tableName}}_controller';

export class {{pluralTypeName}}RpcInstance extends BaseResourceInstanceRpcTarget<
	Env,
	RouterContext<Env, unknown>,
	{{pluralTypeName}}Controller
> {
	protected controllerClass = {{pluralTypeName}}Controller;
}

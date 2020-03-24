import { Mvsd, IMvsd } from './mvsd'
import { post } from 'superagent'
import { from } from 'rxjs'
import { Observable } from 'rxjs'


export class MvsdJSONRPC extends Mvsd implements IMvsd {

    constructor(private url = 'http://127.0.0.1:8820/rpc/v3') {
        super()
    }

    execute(method: string, params: (string | number)[] = []): Observable<any> {
        return from(post(this.url).send({
            jsonrpc: "3.0",
            method,
            params,
        }).then(response => {
            try {
                // tslint:disable-next-line: no-unsafe-any
                return JSON.parse(response.text).result
            } catch (e) {
                throw Error('Invalid response')
            }
        }))
    }

}
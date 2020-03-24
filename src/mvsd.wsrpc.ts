import { Subject } from 'rxjs'
import WebSocket from 'ws'
import { DelayQueue } from 'rx-queue'
import { Mvsd, IMvsd } from './mvsd'

export class MvsdWebsocketRPC extends Mvsd implements IMvsd {

    ready = new Subject<boolean>()

    private ws?: WebSocket
    private _commandQueue = new DelayQueue<{ method: string, params: (string | number)[], result: Subject<any> }>(0)

    private currentCommand?: { method: string, params: (string | number)[], result: Subject<any> } // = { method: '', params: [], result: new Subject() }

    constructor(private url = 'ws://127.0.0.1:8820/ws') {
        super()
        this._commandQueue.subscribe((command) => {
            this.currentCommand = command
            this._send(command.method, command.params)
        })
    }

    connect() {
        this.ws = new WebSocket(this.url)
        this.ws.on('open', () => {
            this.ready.next(true)
        })
        this.ws.on('message', (data: any) => {
            if (data === 'connected') return
            let payload
            try {
                payload = JSON.parse(data)
            } catch (e) {
                payload = data
            }
            if (this.currentCommand === undefined) return
            this.currentCommand.result.next(payload)
        })
    }

    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
    }

    private _send(method: string, params: (string | number)[] = []) {
        if (this.ws) {
            this.ws.send(method + ' ' + params.join(' '))
        }
    }

    execute(method: string, params: (string|number)[] = []) {
        const observable = new Subject<any>()
        this._commandQueue.next({ method, params, result: observable })
        return observable
    }

}
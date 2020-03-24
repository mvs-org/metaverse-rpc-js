import {w3cwebsocket} from 'websocket'
import { Subject, BehaviorSubject } from 'rxjs'
import { take } from 'rxjs/operators'
import { Transaction } from './interfaces/transaction.interface'
import { Block } from './interfaces/block.interface'

export interface Channels {
    tx: Subject<any>
    block: Subject<any>
}

export class MvsdWebsocket {
    private ws?: w3cwebsocket

    ready: Subject<boolean>
    transactions: Subject<Transaction>
    blocks: Subject<Block>
    channels: Subject<string[]>

    constructor(private url = 'ws://127.0.0.1:8821/ws') {
        this.transactions = new Subject<Transaction>()
        this.blocks = new Subject<Block>()
        this.channels = new BehaviorSubject<string[]>([])
        this.ready = new BehaviorSubject<boolean>(false)
    }
    connect() {
        this.ws = new w3cwebsocket(this.url)
        this.ws.onopen = () => {
            this.ready.next(true)
        }
        this.ws.onmessage = (message) => {
            const payload = JSON.parse(message.data.toString())
            if (payload.event === 'publish') {
                switch (payload.channel) {
                    case 'tx':
                        this.transactions.next(payload.result)
                        break
                    case 'block':
                        this.blocks.next(payload.result)
                        break
                    default:
                        throw Error('unexpected channel')
                }
            }

            if (payload.event === 'subscribed') {
                this.channels.pipe(take(1)).subscribe((channels: string[]) => {
                    if (channels.indexOf(payload.channel) === -1) {
                        channels.push(payload.channel)
                        this.channels.next(channels)
                    }
                }).unsubscribe()
            }

            if (payload.event === 'unsubscribed') {
                this.channels.pipe(take(1)).subscribe((channels: string[]) => {
                    channels = channels.filter((channel) => channel !== payload.channel)
                    this.channels.next(channels)
                }).unsubscribe()
            }
        }
    }
    private subscribe(channel: string, params?: object) {
        if (this.ws === undefined) {
            throw Error('not connected')
        }
        return this.ws.send(JSON.stringify({ event: 'subscribe', channel, ...params }))
    }
    subscribeTransactions(addresses?: string[]) {
        return this.subscribe('tx', { address: addresses ?? [] })
    }
    subscribeBlocks() {
        return this.subscribe('block')
    }
}




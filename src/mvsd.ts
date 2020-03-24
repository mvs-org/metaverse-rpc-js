import { Observable } from 'rxjs'
import { GetBlockResponse } from './interfaces/block.interface'

export interface Input {
    address: string
    previous_output: {
        hash: string,
        index: number,
    }
    script: string
    sequence: number
}

export interface Output {
    address: string
    attachment: object
    index: string
    locked_height_range: string
    script: string
    value: number
}

export interface SendResponse {
    transaction: {
        hash: string
        inputs: Array<Input>
        lock_time: string | number
        outputs: Array<Output>
        version: string | number,
    }
}

export interface GetBlockParams {
    txid?: string
    number?: number
}

export interface AccountParams {
    accountname: string,
    password: string,
}

export interface SendParams extends AccountParams {
    recipient: string,
    amount: number | string,
    change?: string,
    exclude?: Array<number>,
    fee?: number,
    memo?: string,
    locktime?: number,
}

export interface StartParams extends AccountParams {
    address?: string,
    consensus?: string,
    number?: number,
    symbol?: string,
}

export interface SendRawTxParams {
    tx: string
}

export interface GetInfoResponse {
    'database-version': string,
    difficulty : string,
    'hash-rate' : number,
    height : number,
    'is-mining' : boolean,
    'network-assets-count' : number,
    'peers' : number,
    'protocol-version' : number,
    'testnet' : boolean,
    'wallet-account-count' : number,
    'wallet-version' : string,
}

export interface IMvsd {
    execute<T>(method: string, params?: (string | number)[]): Observable<T>

    /**
     * Get the current blockchain height
     */
    getHeight(): Observable<number>

    /**
     * Get a block by its number or txid
     * 
     * @param txid? string
     * @param number? number
     */
    getBlock(params: GetBlockParams): Observable<GetBlockResponse>

    /**
     * Get a block by its number or txid
     * 
     * @param name Account name
     * @param password Account password
     * @param recipient Send to this did/address
     * @param amount Amount to send
     * @param change optional - Change to this did/address                          
     * @param exclude optional - Exclude utxo whose value is between this range [begin:end].                                     
     * @param fee optional - Transaction fee. defaults to 10000 etp bits      
     * @param memo optional - Attached memo for this transaction.             
     * @param locktime optional - Locktime. defaults to 0
     */
    send(params: SendParams): Observable<SendResponse>

    /**
     * Get a block by its number or txid
     * 
     * @param name Account name
     * @param password Account password
     * @param address optional - The mining target did/address. Defaults to empty, means a new address will be generated.              
     * @param consensus optional - Accept block with the specified consensus, eg. pow, pos, defaults to pow.                               
     * @param number optional - The number of mining blocks, useful for testing. Defaults to 0, means no limit.                      
     * @param symbol optional - Mine Asset with specified symbol. Defaults to empty.
     */
    start(params: StartParams): Observable<string>

    /**
     * Submit a new transaction
     * 
     * @param tx base16 encoded transaction
     */
    sendrawtx(params: SendRawTxParams): Observable<string>

    /**
     * Get infirmation
     */
    getinfo(): Observable<GetInfoResponse>
}

export abstract class Mvsd implements IMvsd {

    execute<T>(method: string, params: (string | number)[] = []) { return new Observable<T>() }

    private addCredentials(parameterList: any[], accountname: string, password: string) {
        parameterList = parameterList.concat(accountname, password)
        return parameterList
    }

    private addOptionalParameters(parameterList: any[], parameters: object) {
        Object.entries(parameters).forEach(([parameter, value]) => parameterList.concat(['--' + parameter, value]))
        return parameterList
    }

    getHeight(): Observable<number> {
        return this.execute('getheight')
    }

    getBlock(params: GetBlockParams): Observable<GetBlockResponse> {
        if (params.txid !== undefined) {
            return this.execute('getblock', [params.txid])
        }
        if (params.number !== undefined) {
            return this.execute('getblock', [params.number])
        }
        return this.execute('getblock', [])
    }

    send(params: SendParams): Observable<SendResponse> {
        const { recipient, amount, accountname, password, ...optionalParameters } = params
        const parameterList = this.addCredentials([], accountname, password).concat([recipient, amount])
        this.addOptionalParameters(parameterList, optionalParameters)

        return this.execute('send', parameterList)
    }

    start(params: StartParams): Observable<string> {
        const { accountname, password, ...optionalParameters } = params
        const parameterList = this.addOptionalParameters([accountname, password], optionalParameters)
        return this.execute('start', parameterList)
    }

    sendrawtx(params: SendRawTxParams): Observable<string> {
        const parameterList = this.addOptionalParameters([], params)
        return this.execute('sendrawtx', parameterList)
    }

    getinfo(): Observable<GetInfoResponse> {
        return this.execute('getinfo')
    }
}
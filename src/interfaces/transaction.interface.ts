export interface Input {
    previous_output: {
        hash: string
        index: number
    }
    script: string
    sequence: number
}

export interface Attachment {
    type: string
    [key: string]: any
}

export interface Output {
    value: number
    script: string
    attachment: Attachment
    address: string
}

export interface Transaction {
    hash: string
    version: string
    height?: number
    inputs: Input[]
    outputs: Output[]
    lock_time: string
}
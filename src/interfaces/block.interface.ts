export interface Block {
    hash: string
    number: string
}

export interface GetBlockResponse {
    header: {
        result: {
            hash: string
            number: number
        }
    }
}
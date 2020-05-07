export interface Block {
    hash: string
    number: string
}

export interface GetBlockResponse<T> {
    bits: string,
    hash: string,
    merkle_tree_hash: string,
    mixhash: string,
    nonce: string,
    number: number,
    previous_block_hash: string,
    timestamp: number,
    transaction_count: number,
    transactions: T[],
    version: number,
}
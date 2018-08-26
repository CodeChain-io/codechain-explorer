import { Client, SearchResponse, DeleteDocumentResponse, CountResponse } from "elasticsearch";
import { Block, H256, SignedParcel, Transaction } from "codechain-sdk/lib/core/classes";
import { BlockDoc, ParcelDoc, AssetTransferTransactionDoc, AssetMintTransactionDoc, TransactionDoc, AssetDoc, AssetSchemeDoc, AssetBundleDoc, PendingParcelDoc, PendingTransactionDoc } from "./DocType";
import { QueryIndex } from "./actions/QueryIndex";
import { QueryPendingParcel } from "./actions/QueryPendingParcel";
import { QueryBlock } from "./actions/QueryBlock";
import { QueryParcel } from "./actions/QueryParcel";
import { QueryTransaction } from "./actions/QueryTransaction";
import { QueryLog, LogData, LogType } from "./actions/QueryLog";
import { QueryAccount, Account } from "./actions/QueryAccount";

export class ElasticSearchAgent implements QueryBlock, QueryParcel, QueryTransaction, QueryPendingParcel, QueryIndex, QueryLog, QueryAccount {
    public client: Client;
    public agent: ElasticSearchAgent;
    public getBlockByHash: (hash: H256) => Promise<BlockDoc | null>;
    public getLastBlockNumber: () => Promise<number>;
    public getBlock: (blockNumber: number) => Promise<BlockDoc | null>;
    public getBlocks: (page?: number, itemsPerPage?: number) => Promise<BlockDoc[]>;
    public getTotalBlockCount: () => Promise<number>;
    public getBlocksByPlatformAddress: (address: string, page?: number, itemsPerPage?: number) => Promise<BlockDoc[]>;
    public retractBlock: (blockHash: H256) => Promise<void>;
    public indexBlock: (block: Block, defaultBlockReward: number) => Promise<any>;
    public updateBlock: (hash: H256, partial: any) => Promise<any>;
    public searchBlock: (body: any) => Promise<SearchResponse<any>>;
    public countBlock: (body: any) => Promise<CountResponse>;
    public countParcel: (body: any) => Promise<CountResponse>;
    public countTransaction: (body: any) => Promise<CountResponse>;
    public getParcel: (hash: H256) => Promise<ParcelDoc | null>;
    public getParcels: (page?: number, itemsPerPage?: number) => Promise<ParcelDoc[]>;
    public getParcelsByPlatformAddress: (address: string, page?: number, itemsPerPage?: number) => Promise<ParcelDoc[]>;
    public searchParcel: (body: any) => Promise<SearchResponse<any>>;
    public retractParcel: (parcelHash: H256) => Promise<void>;
    public indexParcel: (currentParcels: SignedParcel[], parcel: SignedParcel, timestamp: number) => Promise<any>;
    public updateParcel: (hash: H256, partial: any) => Promise<any>;
    public getTransaction: (hash: H256) => Promise<AssetMintTransactionDoc | AssetTransferTransactionDoc | null>;
    public getTransactions: (page?: number, itemsPerPage?: number) => Promise<TransactionDoc[]>;
    public getTransactionsByAssetType: (assetType: H256, page?: number, itemsPerPage?: number) => Promise<TransactionDoc[]>;
    public getTransactionsByAssetTransferAddress: (address: string, page?: number, itemsPerPage?: number) => Promise<TransactionDoc[]>;
    public getAssetBundlesByPlatformAddress: (address: string, page?: number, itemsPerPage?: number) => Promise<AssetBundleDoc[]>;
    public getAssetsByAssetTransferAddress: (address: string, lastBlockNumber?: number, lastParcelIndex?: number, lastTransactionIndex?: number, itemsPerPage?: number) => Promise<AssetDoc[]>;
    public getAssetScheme: (assetType: H256) => Promise<AssetSchemeDoc | null>;
    public getAssetBundlesByAssetName: (name: string) => Promise<AssetBundleDoc[]>;
    public searchTransaction: (body: any) => Promise<SearchResponse<any>>;
    public retractTransaction: (transactionHash: H256) => Promise<void>;
    public indexTransaction: (currentTransactions: Transaction[], transaction: Transaction, timestamp: number, parcel: SignedParcel, transactionIndex: number) => Promise<any>;
    public updateTransaction: (hash: H256, partial: any) => Promise<any>;
    public getAllOfCurrentPendingParcels: () => Promise<PendingParcelDoc[]>;
    public getCurrentPendingParcels: (page?: number, itemsPerPage?: number, actionFilters?: string[], signerFilter?: string, sorting?: string, orderBy?: string) => Promise<PendingParcelDoc[]>;
    public getPendingParcel: (hash: H256) => Promise<PendingParcelDoc | null>;
    public getPendingTransaction: (hash: H256) => Promise<PendingTransactionDoc | null>;
    public getDeadPendingParcels: () => Promise<PendingParcelDoc[]>;
    public searchPendinParcel: (body: any) => Promise<SearchResponse<any>>;
    public deadPendingParcel: (hash: H256) => Promise<void>;
    public removePendingParcel: (hash: H256) => Promise<DeleteDocumentResponse>;
    public indexPendingParcel: (otherPendingParcels: SignedParcel[], pendingParcel: SignedParcel) => Promise<any>;
    public revialPendingParcel: (hash: H256) => Promise<void>;
    public checkIndexOrCreate: () => Promise<void>;
    public getTotalParcelCount: () => Promise<number>;
    public getTotalTransactionCount: () => Promise<number>;
    public countPendingParcel: (body: any) => Promise<CountResponse>;
    public getTotalPendingParcelCount: (actionFilters: string[], signerFilter?: string) => Promise<number>;
    public getTotalParcelCountByPlatformAddress: (address: string) => Promise<number>;
    public getTotalTransactionCountByAssetType: (assetType: H256) => Promise<number>;
    public getTotalTxCountByAssetTransferAddress: (address: string) => Promise<number>;
    public getTotalAssetBundleCountByPlatformAddress: (address: string) => Promise<number>;
    public getTotalBlockCountByPlatformAddress: (address: string) => Promise<number>;
    public increaseLogCount: (date: string, logType: LogType, count: number, value?: string | undefined) => Promise<void>;
    public decreaseLogCount: (date: string, logType: LogType, count: number, value?: string | undefined) => Promise<void>;
    public getLogCount: (date: string, logType: LogType) => Promise<number>;
    public getBestMiners: (date: string) => Promise<LogData[]>;
    public searchLog: (body: any) => Promise<SearchResponse<any>>;
    public indexLog: (date: string, logType: LogType, value?: string | undefined) => Promise<any>;
    public updateLog: (logData: LogData, doc: any) => Promise<void>;
    public getLog: (date: string, logType: LogType, value?: string | undefined) => Promise<LogData | null>;
    public increaseBalance: (address: string, balance: string) => Promise<void>;
    public decreaseBalance: (address: string, balance: string) => Promise<void>;
    public indexAccount: (address: string, balance: string) => Promise<any>;
    public updateAccount: (address: string, balance: string) => Promise<void>;
    public getAccount: (address: string) => Promise<Account | null>;
    public getAccounts: () => Promise<Account[]>;

    constructor(host: string) {
        this.client = new Client({
            host
        });
        this.agent = this;
    }

    public ping = async (): Promise<string> => {
        return this.client.ping({ requestTimeout: 30000 }).then((data) => {
            return "pong";
        });
    }
}

applyMixins(ElasticSearchAgent, [QueryBlock, QueryParcel, QueryTransaction, QueryPendingParcel, QueryIndex, QueryLog, QueryAccount]);
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

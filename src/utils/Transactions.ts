export const TransactionTypes = [
    "pay",
    "mintAsset",
    "transferAsset",
    "composeAsset",
    "decomposeAsset",
    "wrapCCC",
    "unwrapCCC",
    "setRegularKey",
    "createShard",
    "setShardOwners",
    "store",
    "remove",
    "custom"
];

export const getLockScriptName = (lockScriptHash: string) => {
    switch (lockScriptHash) {
        case "0x5f5960a7bca6ceeeb0c97bc717562914e7a1de04":
            return "P2PKH(0x5f5960a7bca6ceeeb0c97bc717562914e7a1de04)";
        case "0x37572bdcc22d39a59c0d12d301f6271ba3fdd451":
            return "P2PKHBurn(0x37572bdcc22d39a59c0d12d301f6271ba3fdd451)";
    }
    return `${lockScriptHash}`;
};

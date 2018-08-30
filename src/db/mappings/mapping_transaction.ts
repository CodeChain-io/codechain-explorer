export const getMappingTransaction = () => {
    return {
        properties: {
            data: {
                properties: {
                    parcelHash: {
                        type: "keyword"
                    },
                    blockNumber: {
                        type: "long"
                    },
                    invoice: {
                        type: "boolean"
                    },
                    errorType: {
                        type: "keyword"
                    },
                    parcelIndex: {
                        type: "long"
                    },
                    transactionIndex: {
                        type: "long"
                    },
                    hash: {
                        type: "keyword"
                    },
                    inputs: {
                        properties: {
                            unlockScript: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            },
                            lockScript: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            },
                            prevOut: {
                                properties: {
                                    amount: {
                                        type: "long"
                                    },
                                    assetType: {
                                        type: "keyword"
                                    },
                                    assetScheme: {
                                        properties: {
                                            metadata: {
                                                type: "text"
                                            },
                                            registrar: {
                                                type: "keyword"
                                            },
                                            amount: {
                                                type: "long"
                                            },
                                            networkId: {
                                                type: "keyword"
                                            }
                                        }
                                    },
                                    index: {
                                        type: "long"
                                    },
                                    owner: {
                                        type: "keyword"
                                    },
                                    transactionHash: {
                                        type: "keyword"
                                    }
                                }
                            }
                        }
                    },
                    burns: {
                        properties: {
                            unlockScript: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            },
                            lockScript: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            },
                            prevOut: {
                                properties: {
                                    amount: {
                                        type: "long"
                                    },
                                    assetType: {
                                        type: "keyword"
                                    },
                                    assetScheme: {
                                        properties: {
                                            metadata: {
                                                type: "text"
                                            },
                                            registrar: {
                                                type: "keyword"
                                            },
                                            amount: {
                                                type: "long"
                                            },
                                            networkId: {
                                                type: "keyword"
                                            }
                                        }
                                    },
                                    index: {
                                        type: "long"
                                    },
                                    owner: {
                                        type: "keyword"
                                    },
                                    transactionHash: {
                                        type: "keyword"
                                    }
                                }
                            }
                        }
                    },
                    metadata: {
                        type: "text"
                    },
                    assetName: {
                        type: "keyword"
                    },
                    networkId: {
                        type: "keyword"
                    },
                    nonce: {
                        type: "long"
                    },
                    output: {
                        properties: {
                            owner: {
                                type: "keyword"
                            },
                            lockScriptHash: {
                                type: "keyword"
                            },
                            parameters: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            },
                            amount: {
                                type: "long"
                            },
                            assetType: {
                                type: "keyword"
                            }
                        }
                    },
                    outputs: {
                        properties: {
                            owner: {
                                type: "keyword"
                            },
                            amount: {
                                type: "long"
                            },
                            assetType: {
                                type: "keyword"
                            },
                            assetScheme: {
                                properties: {
                                    metadata: {
                                        type: "text"
                                    },
                                    registrar: {
                                        type: "keyword"
                                    },
                                    amount: {
                                        type: "long"
                                    },
                                    networkId: {
                                        type: "keyword"
                                    }
                                }
                            },
                            lockScriptHash: {
                                type: "keyword"
                            },
                            parameters: {
                                properties: {
                                    data: {
                                        type: "long"
                                    },
                                    type: {
                                        type: "keyword"
                                    }
                                }
                            }
                        }
                    },
                    timestamp: {
                        type: "long"
                    },
                    registrar: {
                        type: "keyword"
                    }
                }
            },
            type: {
                type: "keyword"
            },
            isRetracted: {
                type: "boolean"
            }
        }
    };
};

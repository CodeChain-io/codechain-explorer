export const getMappingTransaction = () => {
    return {
        "properties": {
            "data": {
                "properties": {
                    "parcelHash": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "blockNumber": {
                        "type": "long"
                    },
                    "parcelIndex": {
                        "type": "long"
                    },
                    "transactionIndex": {
                        "type": "long"
                    },
                    "hash": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "inputs": {
                        "properties": {
                            "unlockScript": {
                                "properties": {
                                    "data": {
                                        "type": "long"
                                    },
                                    "type": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            },
                            "lockScript": {
                                "properties": {
                                    "data": {
                                        "type": "long"
                                    },
                                    "type": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            },
                            "prevOut": {
                                "properties": {
                                    "amount": {
                                        "type": "long"
                                    },
                                    "assetType": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "assetScheme": {
                                        "properties": {
                                            "metadata": {
                                                "type": "text",
                                                "fields": {
                                                    "keyword": {
                                                        "type": "keyword",
                                                        "ignore_above": 1000
                                                    }
                                                }
                                            },
                                            "registrar": {
                                                "type": "text",
                                                "fields": {
                                                    "keyword": {
                                                        "type": "keyword",
                                                        "ignore_above": 256
                                                    }
                                                }
                                            },
                                            "amount": {
                                                "type": "long"
                                            },
                                            "networkId": {
                                                "type": "long"
                                            }
                                        }
                                    },
                                    "index": {
                                        "type": "long"
                                    },
                                    "owner": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "transactionHash": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "metadata": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 1000
                            }
                        }
                    },
                    "assetName": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "networkId": {
                        "type": "long"
                    },
                    "nonce": {
                        "type": "long"
                    },
                    "output": {
                        "properties": {
                            "owner": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "lockScriptHash": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "parameters": {
                                "properties": {
                                    "data": {
                                        "type": "long"
                                    },
                                    "type": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            },
                            "amount": {
                                "type": "long"
                            },
                            "assetType": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            }
                        }
                    },
                    "outputs": {
                        "properties": {
                            "owner": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "amount": {
                                "type": "long"
                            },
                            "assetType": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "assetScheme": {
                                "properties": {
                                    "metadata": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 1000
                                            }
                                        }
                                    },
                                    "registrar": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "amount": {
                                        "type": "long"
                                    },
                                    "networkId": {
                                        "type": "long"
                                    }
                                }
                            },
                            "lockScriptHash": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "parameters": {
                                "properties": {
                                    "data": {
                                        "type": "long"
                                    },
                                    "type": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "timestamp": {
                        "type": "long"
                    },
                    "registrar": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                }
            },
            "type": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "isRetracted": {
                "type": "boolean"
            }
        }
    }
}

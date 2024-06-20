export type Pump = {
  version: "0.1.0";
  name: "pump";
  instructions: [
    {
      name: "createToken";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pda";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "metadata";
          type: {
            defined: "InitTokenParams";
          };
        }
      ];
    },
    {
      name: "buyTokens";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: false;
          isSigner: false;
          docs: ["Check Account Balance"];
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "associatedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pda";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creatorAddress";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "solAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "sellTokens";
      accounts: [
        {
          name: "signer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: false;
          isSigner: false;
          docs: ["Check Account Balance"];
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "pda";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creatorAddress";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "from";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "tokenAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "transferMintAuth";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "newMintAuth";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "revokeFreezeAuth";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "highlightToken";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mintAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creatorAddress";
          isMut: false;
          isSigner: false;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "position";
          type: "u64";
        },
        {
          name: "slotHours";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "tokenData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "mintAccount";
            type: "publicKey";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "InitTokenParams";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "decimals";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "ProgramErrorCode";
      type: {
        kind: "enum";
        variants: [
          {
            name: "InvalidMintAccountSpace";
          },
          {
            name: "CantInitializeMetadataPointer";
          },
          {
            name: "NotEnoughSOLSent";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "TokenCreateEvent";
      fields: [
        {
          name: "mintAccount";
          type: "publicKey";
          index: false;
        },
        {
          name: "creatorAddress";
          type: "publicKey";
          index: false;
        },
        {
          name: "name";
          type: "string";
          index: false;
        },
        {
          name: "symbol";
          type: "string";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NotEnoughEnergy";
      msg: "Not enough energy";
    },
    {
      code: 6001;
      name: "WrongAuthority";
      msg: "Wrong Authority";
    }
  ];
};

export const IDL: Pump = {
  version: "0.1.0",
  name: "pump",
  instructions: [
    {
      name: "createToken",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "metadata",
          type: {
            defined: "InitTokenParams",
          },
        },
      ],
    },
    {
      name: "buyTokens",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: false,
          isSigner: false,
          docs: ["Check Account Balance"],
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "associatedTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creatorAddress",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "solAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "sellTokens",
      accounts: [
        {
          name: "signer",
          isMut: false,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: false,
          isSigner: false,
          docs: ["Check Account Balance"],
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creatorAddress",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "from",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "tokenAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "transferMintAuth",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "newMintAuth",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "revokeFreezeAuth",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "highlightToken",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mintAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creatorAddress",
          isMut: false,
          isSigner: false,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "position",
          type: "u64",
        },
        {
          name: "slotHours",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "tokenData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "mintAccount",
            type: "publicKey",
          },
          {
            name: "createdAt",
            type: "i64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "InitTokenParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "decimals",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "ProgramErrorCode",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidMintAccountSpace",
          },
          {
            name: "CantInitializeMetadataPointer",
          },
          {
            name: "NotEnoughSOLSent",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "TokenCreateEvent",
      fields: [
        {
          name: "mintAccount",
          type: "publicKey",
          index: false,
        },
        {
          name: "creatorAddress",
          type: "publicKey",
          index: false,
        },
        {
          name: "name",
          type: "string",
          index: false,
        },
        {
          name: "symbol",
          type: "string",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NotEnoughEnergy",
      msg: "Not enough energy",
    },
    {
      code: 6001,
      name: "WrongAuthority",
      msg: "Wrong Authority",
    },
  ],
};

export type PumpGame = {
  version: "0.1.0";
  name: "pump_game";
  instructions: [
    {
      name: "createGlobalAta";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalLockedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "lockTokens";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "lockingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalLockedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "lockType";
          type: "string";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "unlockTokens";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "lockingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalLockedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "lockType";
          type: "string";
        }
      ];
    },
    {
      name: "adminWithdrawTokens";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "adminTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalLockedTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programSigner";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "lockingAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "startTime";
            type: "u64";
          },
          {
            name: "endTime";
            type: "u64";
          },
          {
            name: "rewardMultiplier";
            type: "f64";
          },
          {
            name: "lockType";
            type: "u8";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidLockType";
      msg: "Invalid lock type.";
    },
    {
      code: 6001;
      name: "LockPeriodNotOver";
      msg: "Lock period is not over.";
    }
  ];
};

export const StphonTokenLockIDL: PumpGame = {
  version: "0.1.0",
  name: "pump_game",
  instructions: [
    {
      name: "createGlobalAta",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalLockedTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "lockTokens",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lockingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalLockedTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "lockType",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "unlockTokens",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lockingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalLockedTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "lockType",
          type: "string",
        },
      ],
    },
    {
      name: "adminWithdrawTokens",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "adminTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalLockedTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "lockingAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "startTime",
            type: "u64",
          },
          {
            name: "endTime",
            type: "u64",
          },
          {
            name: "rewardMultiplier",
            type: "f64",
          },
          {
            name: "lockType",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidLockType",
      msg: "Invalid lock type.",
    },
    {
      code: 6001,
      name: "LockPeriodNotOver",
      msg: "Lock period is not over.",
    },
  ],
};

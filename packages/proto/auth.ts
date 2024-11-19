// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.28.3
// source: auth.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "authproto";

export interface loginPayload {
  login: string;
  password: string;
}

export interface token {
  token: string;
}

function createBaseloginPayload(): loginPayload {
  return { login: "", password: "" };
}

export const loginPayload: MessageFns<loginPayload> = {
  encode(message: loginPayload, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.login !== "") {
      writer.uint32(10).string(message.login);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): loginPayload {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseloginPayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.login = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): loginPayload {
    return {
      login: isSet(object.login) ? globalThis.String(object.login) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: loginPayload): unknown {
    const obj: any = {};
    if (message.login !== "") {
      obj.login = message.login;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<loginPayload>, I>>(base?: I): loginPayload {
    return loginPayload.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<loginPayload>, I>>(object: I): loginPayload {
    const message = createBaseloginPayload();
    message.login = object.login ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBasetoken(): token {
  return { token: "" };
}

export const token: MessageFns<token> = {
  encode(message: token, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): token {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasetoken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): token {
    return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
  },

  toJSON(message: token): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<token>, I>>(base?: I): token {
    return token.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<token>, I>>(object: I): token {
    const message = createBasetoken();
    message.token = object.token ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

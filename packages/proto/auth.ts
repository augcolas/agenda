// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               v5.28.3
// source: auth.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "authproto";

export interface LoginPayloadRequest {
  login: string;
  password: string;
}

export interface TokenRequest {
  token: string;
}

export interface TokenResponse {
  token: string;
}

export interface BooleanResponse {
  value: boolean;
}

export interface EmailRequest {
  email: string;
}

export interface UpdateUserByResetTokenRequest {
  token: string;
  password: string;
}

export const AUTHPROTO_PACKAGE_NAME = "authproto";

export interface AuthServiceClient {
  login(request: LoginPayloadRequest, metadata?: Metadata): Observable<TokenResponse>;

  invalidateToken(request: TokenRequest, metadata?: Metadata): Observable<BooleanResponse>;

  isJwtTokenUpToDate(request: TokenRequest, metadata?: Metadata): Observable<BooleanResponse>;

  forgotPassword(request: EmailRequest, metadata?: Metadata): Observable<BooleanResponse>;

  updateUserByResetToken(request: UpdateUserByResetTokenRequest, metadata?: Metadata): Observable<BooleanResponse>;
}

export interface AuthServiceController {
  login(
    request: LoginPayloadRequest,
    metadata?: Metadata,
  ): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

  invalidateToken(
    request: TokenRequest,
    metadata?: Metadata,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;

  isJwtTokenUpToDate(
    request: TokenRequest,
    metadata?: Metadata,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;

  forgotPassword(
    request: EmailRequest,
    metadata?: Metadata,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;

  updateUserByResetToken(
    request: UpdateUserByResetTokenRequest,
    metadata?: Metadata,
  ): Promise<BooleanResponse> | Observable<BooleanResponse> | BooleanResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "login",
      "invalidateToken",
      "isJwtTokenUpToDate",
      "forgotPassword",
      "updateUserByResetToken",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";

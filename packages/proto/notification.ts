/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "notificationproto";

export interface EmptyRequest {
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
}

export interface NotificationIdRequest {
  id: string;
}

export interface NotificationResponse {
  text: string;
}

export interface AddNotificationRequest {
  text: string;
  delay: number;
}

export interface UserIdRequest {
  id: string;
}

export const NOTIFICATIONPROTO_PACKAGE_NAME = "notificationproto";

export interface NotificationServiceClient {
  findAll(request: EmptyRequest, metadata?: Metadata): Observable<NotificationListResponse>;

  findOne(request: NotificationIdRequest, metadata?: Metadata): Observable<NotificationResponse>;

  findByUser(request: UserIdRequest, metadata?: Metadata): Observable<NotificationListResponse>;

  add(request: AddNotificationRequest, metadata?: Metadata): Observable<NotificationResponse>;
}

export interface NotificationServiceController {
  findAll(
    request: EmptyRequest,
    metadata?: Metadata,
  ): Promise<NotificationListResponse> | Observable<NotificationListResponse> | NotificationListResponse;

  findOne(
    request: NotificationIdRequest,
    metadata?: Metadata,
  ): Promise<NotificationResponse> | Observable<NotificationResponse> | NotificationResponse;

  findByUser(
    request: UserIdRequest,
    metadata?: Metadata,
  ): Promise<NotificationListResponse> | Observable<NotificationListResponse> | NotificationListResponse;

  add(
    request: AddNotificationRequest,
    metadata?: Metadata,
  ): Promise<NotificationResponse> | Observable<NotificationResponse> | NotificationResponse;
}

export function NotificationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findAll", "findOne", "findByUser", "add"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTIFICATION_SERVICE_NAME = "NotificationService";

import crypto from "node:crypto";

interface BaseErrorParams {
  name: string;
  message: string;
  stack?: string;
  action?: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: any;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}

class BaseError extends Error {
  name: string;
  message: string;
  stack?: string;
  action?: string;
  statusCode: number;
  errorId: string;
  requestId?: string;
  context?: any;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;

  constructor({
    name,
    message,
    stack,
    action,
    statusCode,
    errorId,
    requestId,
    context,
    errorLocationCode,
    key,
    type,
    databaseErrorCode,
  }: BaseErrorParams) {
    super(message);
    this.name = name;
    this.message = message;
    this.action = action;
    this.statusCode = statusCode || 500;
    this.errorId = errorId || crypto.randomUUID();
    this.requestId = requestId;
    this.context = context;
    this.stack = stack;
    this.errorLocationCode = errorLocationCode;
    this.key = key;
    this.type = type;
    this.databaseErrorCode = databaseErrorCode;
  }
}

interface NotFoundErrorParams extends Partial<BaseErrorParams> {}

export class NotFoundError extends BaseError {
  constructor({
    message,
    action,
    requestId,
    errorId,
    stack,
    errorLocationCode,
    key,
  }: NotFoundErrorParams) {
    super({
      name: "NotFoundError",
      message: message || "Não foi possível encontrar este recurso no sistema.",
      action: action || "Verifique se o caminho (PATH) está correto.",
      statusCode: 404,
      requestId: requestId,
      errorId: errorId,
      stack: stack,
      errorLocationCode: errorLocationCode,
      key: key,
    });
  }
}

interface ValidationErrorParams extends Partial<BaseErrorParams> {}
export class ValidationError extends BaseError {
  constructor({
    message,
    action,
    stack,
    statusCode,
    context,
    errorLocationCode,
    key,
    type,
  }: ValidationErrorParams) {
    super({
      name: "ValidationError",
      message: message || "Um erro de validação ocorreu.",
      action: action || "Ajuste os dados enviados e tente novamente.",
      statusCode: statusCode || 400,
      stack: stack,
      context: context,
      errorLocationCode: errorLocationCode,
      key: key,
      type: type,
    });
  }
}

interface UnauthorizedErrorParams extends Partial<BaseErrorParams> {}
export class UnauthorizedError extends BaseError {
  constructor({
    message,
    action,
    requestId,
    stack,
    errorLocationCode,
  }: UnauthorizedErrorParams) {
    super({
      name: "UnauthorizedError",
      message: message || "Usuário não autenticado.",
      action:
        action ||
        "Verifique se você está autenticado com uma sessão ativa e tente novamente.",
      requestId: requestId,
      statusCode: 401,
      stack: stack,
      errorLocationCode: errorLocationCode,
    });
  }
}

interface InternalServerErrorParams extends Partial<BaseErrorParams> {}
export class InternalServerError extends BaseError {
  constructor({
    message,
    action,
    requestId,
    errorId,
    statusCode,
    stack,
    errorLocationCode,
  }: InternalServerErrorParams) {
    super({
      name: "InternalServerError",
      message:
        "Um erro interno não esperado aconteceu.Tente novamente mais tarde",
      action:
        action || "Informe ao suporte o valor encontrado no campo 'error_id'.",
      statusCode: statusCode || 500,
      requestId: requestId,
      errorId: errorId,
      stack: stack,
      errorLocationCode: errorLocationCode,
    });
  }
}

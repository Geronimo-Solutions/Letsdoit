export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const PRIVATE_PROJECT_ERROR_MESSAGE =
  "You do not have permission to view this project";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export const PrivateProjectAccessError = class PrivateProjectAccessError extends Error {
  constructor() {
    super(PRIVATE_PROJECT_ERROR_MESSAGE);
    this.name = "PrivateProjectAccessError";
  }
};

export const NotFoundError = class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
};

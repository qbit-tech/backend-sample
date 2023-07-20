/* eslint-disable @typescript-eslint/camelcase */
enum EErrorCode {
  // general error
  not_found = 'not_found',
  failed = 'failed',
  already_exist = 'already_exist',

  // spesific error

  //tag
  tag_not_found = 'tag_not_found',

  //login
  email_not_found = 'email_not_found',
  username_not_found = 'username_not_found',
  password_mismatch = 'password_mismatch'

}

export type PromiseRejectData = {
	statusCode: number; // e.g 400, 401, 403, 404, dst
	code: string; // e.g user_not_found
	message: string; // e.g User not found
	errors: any[];
}

export const ERRORS = {
  // general error
  general : {
    [EErrorCode.not_found]: {
      statusCode: 404,
      code: EErrorCode.not_found,
      message: 'Not found',
    },
    [EErrorCode.failed]: {
      statusCode: 400,
      code: EErrorCode.failed,
      message: 'Failed',
    },
    [EErrorCode.already_exist]: {
      statusCode: 400,
      code: EErrorCode.already_exist,
      message: 'Already exist'
    },
  },

  // spesific error
  tag: {
    [EErrorCode.tag_not_found]: {
      statusCode: 404,
      code: EErrorCode.tag_not_found,
      message: 'Tag not found',
    },
  },

  login: {
    [EErrorCode.email_not_found]: {
      statusCode: 404,
      code: EErrorCode.email_not_found,
      message: 'Email doesnt exist',
    },

    [EErrorCode.username_not_found]: {
      statusCode: 404,
      code: EErrorCode.username_not_found,
      message: 'Username doesnt exist',
    },

    [EErrorCode.password_mismatch]: {
      statusCode: 401,
      code: EErrorCode.password_mismatch,
      message: 'Password mismatch',
    }

  }
}
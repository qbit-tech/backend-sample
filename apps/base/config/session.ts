export const sessionOption = {
  sessionHashToken: process.env.SESSION_HASH_TOKEN,
  randomSessionIdKey: process.env.RANDOM_SESSIONID_KEY,
  projectId: process.env.PROJECT_ID,
  expiredJWTTokenAccessInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_ACCESS_IN_MINUTES,
  ),
  expiredJWTTokenRefreshInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_REFRESH_IN_MINUTES,
  ),
};

export const sessionPaymentOption = {
  sessionHashToken: process.env.SESSION_HASH_TOKEN,
  randomSessionIdKey: process.env.RANDOM_SESSIONID_KEY,
  projectId: process.env.PROJECT_ID,
  expiredJWTTokenAccessInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_ACCESS_IN_MINUTES,
  ),
  expiredJWTTokenRefreshInMinutes: parseInt(
    process.env.EXPIRED_JWT_TOKEN_REFRESH_IN_MINUTES,
  ),
  MERCHANT_ID: "1",
};

export const redisOption = {
  config: {
    url: process.env.REDIS_URL,
  },
};

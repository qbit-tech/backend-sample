import { Injectable } from "@nestjs/common";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis"
import * as Crypto from 'crypto';
// import { v4 as uuidv4 } from 'uuid';
// import uuid from 'uuid';
import * as uuid from 'uuid'

@Injectable()
export class SessionService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async getSession(sessionId: string): Promise<Record<string, any>> {
    try {
      const result = await this.redis.get(sessionId);
      return JSON.parse(result);
    } catch (err) {
      console.log('err: ', err);
      return null;
    }
  }

  async saveSession(
    sessionObject: Record<string, any>,
    timeoutInSec = 600,
  ): Promise<string> {
    const sessionId = Crypto.createHmac(
      'sha256',
      process.env.RANDOM_SESSION_KEY || '2r8u32niejf',
    )
      // .update(`${Date.now}-${uuidv4()}`)
      .update(`${Date.now}-${uuid.v4()}`)
      .digest('hex');
    return this.saveSessionWithId(sessionId, sessionObject, timeoutInSec);
  }

  async saveSessionWithId(
    sessionId: string,
    sessionObject: Record<string, any>,
    timeoutInSec = 600,
  ): Promise<string> {
    const result = await this.redis.set(
      sessionId,
      JSON.stringify(sessionObject),
      'EX',
      timeoutInSec,
    );
    return result === 'OK' ? sessionId : null;
  }

  async removeSession(sessionId: string): Promise<boolean> {
    const result = await this.redis.del(sessionId);

    return result === 1;
  }

  // key = {userId} or auth_{userId} or auth_cms_{userId}
  async saveLatestSessionIdByKey(
    key: string,
    sessionId: string,
    timeoutInSec = 31535000,
  ): Promise<string> {
    console.info('saveLatestSessionIdByKey', key);
    const result = await this.redis.set(
      key,
      sessionId,
      'EX',
      timeoutInSec || 31535000,
    );
    return result === 'OK' ? sessionId : null;
  }

  async getLatestSessionIdByKey(key: string): Promise<string> {
    console.info('getLatestSessionIdByKey', key);
    const sessionId = await this.redis.get(key);
    return sessionId;
  }
}
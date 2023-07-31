import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '@qbit-tech/libs-role';
import { UserModel, UserProperties } from '../user/user.entity';
import { verify } from 'jsonwebtoken';
import { SessionService } from '@qbit-tech/libs-authv3';
import { DEFAULT_HASH_TOKEN } from '../../core/constants';
import { EPlatform } from 'apps/base/src/core/constants';

@Injectable()
export class AuthSessionService {
  private readonly logger = new Logger(AuthSessionService.name);

  constructor(
    @InjectModel(UserModel)
    private readonly userRepositories: typeof UserModel,
    private readonly sessionService: SessionService,
  ) {}

  async findOneByUserId(userId: string): Promise<UserProperties> {
    const result = await this.userRepositories.findOne({
      where: { userId },
      include: [
        {
          model: RoleModel,
          as: 'roles',
        },
      ],
    });

    return result ? result.get() : null;
  }

  async validateToken(token: string) {
    let decodedToken: { sessionId: string } = {
      sessionId: 'invalidSessionId',
    };

    if (token) {
      try {
        decodedToken = verify(
          token,
          process.env.SESSION_HASH_TOKEN || DEFAULT_HASH_TOKEN,
          {
            algorithms: ['HS256'],
          },
        ) as { sessionId: string };
      } catch (err) {
        //
      }
    }
    const userFromSession = await this.sessionService.getSession(
      decodedToken.sessionId,
    );
    if (userFromSession) {
      console.info(
        '(userFromSession as any).userId',
        (userFromSession as any).userId,
      );
      console.info(
        '(userFromSession as any).platform',
        (userFromSession as any).platform,
      );

      let latestSessionId;
      if ((userFromSession as any).platform === EPlatform.CMS) {
        // latestSessionId = await this.sessionService.getLatestSessionIdByKey(
        //   'auth_' +
        //     (userFromSession as any).platform +
        //     '_' +
        //     (userFromSession as any).userId,
        // );

        // console.info('latestSessionId', latestSessionId);
        const user = await this.findOneByUserId(
          (userFromSession as any).userId,
        );

        return { decodedToken, userFromSession, user };
      } else {
        // check is latest session, kick old session
        latestSessionId = await this.sessionService.getLatestSessionIdByKey(
          'auth_' + (userFromSession as any).userId,
        );
      }

      console.info('latestSessionId', latestSessionId);

      if (!latestSessionId) {
        return null;
      }

      if (latestSessionId !== decodedToken.sessionId) {
        return null;
      }
      // end check

      const user = await this.findOneByUserId((userFromSession as any).userId);

      return { decodedToken, userFromSession, user };
    } else {
      return null;
    }
  }
}

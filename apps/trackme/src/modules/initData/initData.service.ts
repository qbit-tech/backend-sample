import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '@qbit-tech/libs-role';
import { initData } from './initData';
import { DEFAULT_ROLES } from '../../data/role';
import { InitDataRequest } from './initData.contract';

@Injectable()
export class InitDataService {
  private readonly logger = new Logger(InitDataService.name);

  constructor(
    @InjectModel(RoleModel)
    private readonly roleRepositories: typeof RoleModel,
  ) {}

  // init data
  async init(config: InitDataRequest) {
    this.logger.log('==== init roles ====');
    this.logger.log(DEFAULT_ROLES);
    return initData(this.roleRepositories, DEFAULT_ROLES, 'roleId', config);
  }
}


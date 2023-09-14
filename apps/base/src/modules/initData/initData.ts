import { Op } from 'sequelize';
import { Logger } from '@nestjs/common';

export enum EInitConfigType {
  REPLACE_ALL = 'REPLACE_ALL',
  REPLACE_ALL_BUT_KEEP_NEW_DATA = 'REPLACE_ALL_BUT_KEEP_NEW_DATA',
}
export async function initData(repository: any, arrayData: any[], primaryKey: string, config?: {type?: EInitConfigType}) {
  try {
    if (config) {
      if (config.type === EInitConfigType.REPLACE_ALL) {
        const existingList = await repository.findAll();

        // delete unnecessary data
        const willDeleteData = existingList.filter(existingItem => !arrayData.find(newItem => newItem[primaryKey] === existingItem[primaryKey]));
        const deletedIds = willDeleteData.map(item => item[primaryKey]);
        const whereDestroy = {};

        whereDestroy[primaryKey] = {
          [Op.in]: deletedIds,
        };

        // update data
        const willUpdateData = arrayData.filter(
          newItem =>
            existingList.find(
              existingItem => existingItem[primaryKey] === newItem[primaryKey],
            ),
        );
        const promisesUpdateData = willUpdateData.map(item => {
          const whereUpdateId = {}
          whereUpdateId[primaryKey] = item[primaryKey];
          return repository.update(item, {
            where: whereUpdateId,
          })
        })

        // create new data
        const willCreateData = arrayData.filter(
          newItem =>
            !existingList.find(
              existingItem => existingItem[primaryKey] === newItem[primaryKey],
            ),
        );

        await Promise.all([
          repository.destroy({
            where: whereDestroy,
          }),
          repository.bulkCreate(willCreateData),
          ...promisesUpdateData,
        ]);

        return true;
      } else if (config.type === EInitConfigType.REPLACE_ALL_BUT_KEEP_NEW_DATA) {
        const existingList = await repository.findAll();

        // update data
        const willUpdateData = arrayData.filter(newItem =>
          existingList.find(
            existingItem => existingItem[primaryKey] === newItem[primaryKey],
          ),
        );
        const promisesUpdateData = willUpdateData.map(item => {
          const whereUpdateId = {};
          whereUpdateId[primaryKey] = item[primaryKey];
          return repository.update(item, {
            where: whereUpdateId,
          });
        });

        // create new data
        const willCreateData = arrayData.filter(
          newItem =>
            !existingList.find(
              existingItem => existingItem[primaryKey] === newItem[primaryKey],
            ),
        );

        await Promise.all([
          repository.bulkCreate(willCreateData),
          ...promisesUpdateData,
        ]);

        return true;
      } else {
        return false;
      }
    }

    // DEFAULT
    const checkExist = await repository.findAll({
      where: {
        [primaryKey]: {
          [Op.in]: arrayData.map(item => item[primaryKey]),
        },
      },
    });
    console.info('checkExist', JSON.stringify(checkExist));

    if (checkExist.length === arrayData.length) {
      console.info('checkExist.length === arrayData.length');
      return true;
    } else if (checkExist && checkExist.length > 0) {
      console.info('checkExist && checkExist.length > 0');
      await repository.bulkCreate(
        arrayData.filter(
          item => !checkExist.find(el => el[primaryKey] === item[primaryKey]),
        ),
      );
      return true;
    } else {
      console.info('else --');
      await repository.bulkCreate(arrayData);
      return true;
    }
    
  } catch(err) {
    Logger.error('err initData', err);
    return Promise.reject(err);
  }
}
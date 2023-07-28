import { convertDataToArray } from 'libs/utils/typeChecker';
import { OrderItem } from 'sequelize';

const convertSortQuery = (order?: string): OrderItem[] => {
  if (!order) return undefined;

  return convertDataToArray(order).map(item => {
    let split = item.split(':');
    let direction =
      split[1] && split[1].toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    return [split[0], direction];
  });
};
export { convertSortQuery };

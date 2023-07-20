import { convertToReadableText } from './text';

/**
 *
 * @param suspectList = ["A","B"]
 * @param fullList = ["A","B","C","D"]
 *
 * lostData = ["C", "D"]
 */
export function detectLostData(suspectList: string[], fullList: string[]) {
  return fullList.filter(item => !suspectList.includes(item));
}

/**
 *
 * @param suspectList = ["A","B"]
 * @param fullList = ["A","B","C","D"]
 *
 * newData = ["C", "D"]
 */
export function detectNewData(myList: string[], targetedList: string[]) {
  return myList.filter(item => !targetedList.includes(item));
}

export function detectArrayData(suspectList: string[], fullList: string[]) {
  const lostData = detectLostData(suspectList, fullList);
  const newData = detectNewData(suspectList, fullList);

  return { lostData, newData };
}

export function groupByMultiLevel(
  arr: any[],
  keys: string[],
  currLevel?: number,
  keyDescription?: string,
) {
  return arr.reduce((acc: any[], curr) => {
    if (keys.length > 0) {
      const key = keys[0];
      const findIndex = acc.findIndex(item => item[key] === curr[key]);
      if (findIndex === -1) {
        const newKeys = keys.filter((_, index) => index !== 0);
        acc.push({
          name: convertToReadableText(curr[key]),
          [key]: curr[key],
          raws: [curr],
          level: currLevel ? currLevel : 0,
        });
        acc[acc.length - 1].items = groupByMultiLevel(
          acc[acc.length - 1].raws,
          newKeys,
          (currLevel || 0) + 1,
        );

        if (acc[acc.length - 1].items.length > 1 && [keys.length - 2]) {
          acc[acc.length - 1].name = convertToReadableText(
            curr[keys[keys.length - 2]],
          );
        }

        if (keyDescription) {
          acc[acc.length - 1].description = acc[acc.length - 1].raws
            .map((item: any) =>
              convertToReadableText(item[keyDescription])?.toLowerCase(),
            )
            .join(', ');
        }
      } else {
        acc[findIndex].raws.push(curr);
        const newKeys = keys.filter((_, index) => index !== 0);
        acc[findIndex].items = groupByMultiLevel(
          acc[findIndex].raws,
          newKeys,
          (currLevel || 0) + 1,
        );

        if (keyDescription) {
          acc[findIndex].description = acc[findIndex].raws
            .map((item: any) =>
              convertToReadableText(item[keyDescription])?.toLowerCase(),
            )
            .join(', ');
        }
      }
    }
    return acc;
  }, []);
}
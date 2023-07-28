function clean(obj) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj;
}

function cleanParamMapping(obj) {
  let arr = Object.keys(obj).map(key =>
    Array.isArray(obj[key]) && obj[key].length > 0
      ? key + '=' + obj[key].join(',')
      : (typeof obj[key] === 'string' || typeof obj[key] === 'number') &&
        obj[key]
      ? key + '=' + obj[key]
      : typeof obj[key] === 'boolean'
      ? key + '=' + (obj[key] ? '1' : '0')
      : '',
  );

  arr = arr.filter(item => item)
  return arr;
}

export function generateResultPagination(count: number, query: any) {
  console.info('generateResultPagination query', query);
  if (query.limit) {
    query.limit = Number(query.limit);
  } else {
    query.limit = 0;
  }
  if (query.offset) {
    query.offset = Number(query.offset);
  } else {
    query.offset = 0;
  }
  let nextQuery = JSON.parse(JSON.stringify(query));
  let prevQuery = JSON.parse(JSON.stringify(query));

  let prevOffset = undefined;
  let nextOffset = undefined;
  if (query.limit || query.offset) {
    prevOffset = Number(query.offset) - Number(query.limit);
    nextOffset = Number(query.offset) + Number(query.limit);

    if (prevOffset < 0) {
      prevOffset = undefined;
    }
    if (nextOffset > count) {
      nextOffset = undefined;
    }
    if (count === 0) {
      prevOffset = undefined;
      nextOffset = undefined;
    }
  }

  if (query.limit && nextOffset) {
    nextQuery = {
      ...nextQuery,
      limit: Number(query.limit),
      offset: nextOffset,
    };
  } else {
    nextQuery = null;
  }
  if (query.limit && prevOffset) {
    prevQuery = {
      ...prevQuery,
      limit: Number(query.limit),
      offset: prevOffset,
    };
  } else if (query.offset > 0) {
    prevQuery = {
      ...prevQuery,
      limit: Number(query.limit),
      offset: undefined,
    };
  } else {
    prevQuery = null;
  }

  let prevQueryString = null;
  if (prevQuery) {
    console.info('prevQueryString before clean', prevQuery);
    prevQuery = clean({ ...prevQuery });
    console.info('prevQueryString after clean', prevQuery);
    prevQueryString = '?' + cleanParamMapping({ ...prevQuery }).join('&');
  }
  console.info('prevQueryString', prevQueryString);

  let nextQueryString = null;
  if (nextQuery) {
    console.info('nextQueryString before clean', nextQuery);
    nextQuery = clean({ ...nextQuery });
    console.info('nextQueryString after clean', nextQuery);
    nextQueryString = '?' + cleanParamMapping({ ...nextQuery }).join('&');
  }
  console.info('nextQueryString', nextQueryString)

  return {
    count,
    next: nextQueryString,
    prev: prevQueryString,
  };
}

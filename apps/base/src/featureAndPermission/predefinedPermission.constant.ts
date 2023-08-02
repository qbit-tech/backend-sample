export const PERMISSIONS_VIEW = {
  DETAIL: {
    __type: 'DETAIL',
    __title: 'Detail',
    value: true,
  },
  LIST: {
    __type: 'LIST',
    __title: 'List',
    value: true,
  },
};
export const PERMISSIONS_LIST = {
  LIST: {
    __type: 'LIST',
    __title: 'List',
    value: true,
  },
};

export const PERMISSIONS_LIST_UPDATE = {
  LIST: {
    __type: 'LIST',
    __title: 'List',
    value: true,
  },
  UPDATE: {
    __type: 'UPDATE',
    __title: 'Update',
    value: true,
  },
};

export const PERMISSIONS_CREATE_UPDATE = {
  CREATE: {
    __type: 'CREATE',
    __title: 'Create',
    value: true,
  },
  UPDATE: {
    __type: 'UPDATE',
    __title: 'Update',
    value: true,
  },
};

export const PERMISSIONS_LIST_CREATE_UPDATE = {
  LIST: {
    __type: 'LIST',
    __title: 'List',
    value: true,
  },
  CREATE: {
    __type: 'CREATE',
    __title: 'Create',
    value: true,
  },
  UPDATE: {
    __type: 'UPDATE',
    __title: 'Update',
    value: true,
  },
};

export const PERMISSIONS_DELETE = {
  DELETE: {
    __type: 'DELETE',
    __title: 'Delete',
    value: true,
  },
};

export const PERMISSIONS_CRUD = {
  ...PERMISSIONS_VIEW,
  ...PERMISSIONS_CREATE_UPDATE,
  ...PERMISSIONS_DELETE,
};

export const PERMISSIONS_CRUD_WITHOUT_DELETE = {
  ...PERMISSIONS_VIEW,
  ...PERMISSIONS_CREATE_UPDATE,
};

export const PERMISSIONS_CRUD_WITHOUT_DETAIL = {
  ...PERMISSIONS_LIST,
  ...PERMISSIONS_CREATE_UPDATE,
  ...PERMISSIONS_DELETE,
};

import { PERMISSIONS_CRUD, PERMISSIONS_CRUD_WITHOUT_DELETE, PERMISSIONS_CRUD_WITHOUT_DETAIL, PERMISSIONS_LIST, PERMISSIONS_LIST_CREATE_UPDATE, PERMISSIONS_LIST_UPDATE, PERMISSIONS_VIEW } from './predefinedPermission.constant';

export const FEATURE_PERMISSIONS = {
  AUTH: {
    __type: 'AUTH',
    __title: 'Auth',
    __description: 'Auth permission',
    LOGIN_MOBILE_APP_CUSTOMER: {
      __type: 'LOGIN_MOBILE_APP_CUSTOMER',
      __title: 'Login Mobile App',
      value: true,
    },
    LOGIN_CMS_ADMIN: {
      __type: 'LOGIN_CMS_ADMIN',
      __title: 'Login CMS Admin',
      value: true,
    },
  },
  USER: {
    __type: 'USER',
    __title: 'User',
    __description: 'Manage user',

    ...PERMISSIONS_CRUD_WITHOUT_DELETE,
    FORCE_DELETE_OTHER_USER: {
      __type: 'FORCE_DELETE_OTHER_USER',
      __title: 'Force delete other user',
      value: true,
    },
  },
  PRODUCT: {
    __type: 'PRODUCT',
    __title: 'Product',
    __description: 'Manage Product',

    ...PERMISSIONS_CRUD,
  },
  PRODUCT_CATEGORY: {
    __type: 'PRODUCT_CATEGORY',
    __title: 'Product Category',
    __description: 'Manage Product Category',

    ...PERMISSIONS_CRUD,
  },
  PRODUCT_STOCKS: {
    __type: 'PRODUCT_STOCKS',
    __title: 'Product STOCKS',
    __description: 'Manage Product Stocks',

    ...PERMISSIONS_CRUD,
  },
  PRODUCT_STORE: {
    __type: 'PRODUCT_STORE',
    __title: 'Product Store',
    __description: 'Manage Product Store',

    ...PERMISSIONS_CRUD,
  },
  PRODUCT_VARIANTS: {
    __type: 'PRODUCT_VARIANTS',
    __title: 'Product Variants',
    __description: 'Manage Product Variants',

    ...PERMISSIONS_CRUD,
  },
  ROLE: {
    __type: 'ROLE',
    __title: 'Role',
    __description: 'Manage role',

    ...PERMISSIONS_CRUD,
  },
  TAG: {
    __type: 'TAG',
    __title: 'Tag',
    __description: 'Manage tag',

    ...PERMISSIONS_CRUD,
  },
};

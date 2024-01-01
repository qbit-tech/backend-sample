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
    PRODUCT_STORE: {
        LIST: {
            value: true,
            __type: "LIST",
            __title: "List"
        },
        CREATE: {
            value: true,
            __type: "CREATE",
            __title: "Create"
        },
        DELETE: {
            value: true,
            __type: "DELETE",
            __title: "Delete"
        },
        DETAIL: {
            value: true,
            __type: "DETAIL",
            __title: "Detail"
        },
        UPDATE: {
            value: true,
            __type: "UPDATE",
            __title: "Update"
        },
        __type: "PRODUCT_STORE",
        __title: "PRODUCT_STORE",
        __description: "Manage Product Store"
    },
    PRODUCT_VARIANTS: {
        LIST: {
            value: true,
            __type: "LIST",
            __title: "List"
        },
        CREATE: {
            value: true,
            __type: "CREATE",
            __title: "Create"
        },
        DELETE: {
            value: true,
            __type: "DELETE",
            __title: "Delete"
        },
        DETAIL: {
            value: true,
            __type: "DETAIL",
            __title: "Detail"
        },
        UPDATE: {
            value: true,
            __type: "UPDATE",
            __title: "Update"
        },
        __type: "PRODUCT_VARIANTS",
        __title: "Product Variants",
        __description: "Manage Product Variants"
    },
    PRODUCT: {
        LIST: {
            value: true,
            __type: "LIST",
            __title: "List"
        },
        CREATE: {
            value: true,
            __type: "CREATE",
            __title: "Create"
        },
        DELETE: {
            value: true,
            __type: "DELETE",
            __title: "Delete"
        },
        DETAIL: {
            value: true,
            __type: "DETAIL",
            __title: "Detail"
        },
        UPDATE: {
            value: true,
            __type: "UPDATE",
            __title: "Update"
        },
        __type: "PRODUCT",
        __title: "Product",
        __description: "Manage Product"
    },
    PRODUCT_CATEGORY: {
        LIST: {
            value: true,
            __type: "LIST",
            __title: "List"
        },
        CREATE: {
            value: true,
            __type: "CREATE",
            __title: "Create"
        },
        DELETE: {
            value: true,
            __type: "DELETE",
            __title: "Delete"
        },
        DETAIL: {
            value: true,
            __type: "DETAIL",
            __title: "Detail"
        },
        UPDATE: {
            value: true,
            __type: "UPDATE",
            __title: "Update"
        },
        __type: "PRODUCT_CATEGORY",
        __title: "Product Category",
        __description: "Manage Product Category"
    },
    PRODUCT_STOCKS: {
        LIST: {
            value: true,
            __type: "LIST",
            __title: "List"
        },
        CREATE: {
            value: true,
            __type: "CREATE",
            __title: "Create"
        },
        DELETE: {
            value: true,
            __type: "DELETE",
            __title: "Delete"
        },
        DETAIL: {
            value: true,
            __type: "DETAIL",
            __title: "Detail"
        },
        UPDATE: {
            value: true,
            __type: "UPDATE",
            __title: "Update"
        },
        __type: "PRODUCT_STOCKS",
        __title: "Product Stocks",
        __description: "Manage Product Stocks"
    },
    FAQ: {
        __type: 'FAQ',
        __title: 'FAQ',
        __description: 'Manage FAQ',

        ...PERMISSIONS_CRUD,
    },
    FAQ_GROUP: {
        __type: 'FAQ_GROUP',
        __title: 'FAQ Group',
        __description: 'Manage FAQ Group',

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
    STORE: {
        __type: 'STORE',
        __title: 'Store',
        __description: 'Manage region',

        ...PERMISSIONS_CRUD,
    },
    REGION: {
        __type: 'REGION',
        __title: 'Region',
        __description: 'Manage region',

        ...PERMISSIONS_CRUD,
    },
    BANNER: {
        __type: 'BANNER',
        __title: 'Banner',
        __description: 'Manage banner',

        ...PERMISSIONS_CRUD,
    },
};
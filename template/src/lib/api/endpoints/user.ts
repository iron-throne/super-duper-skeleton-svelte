const BASE_USER = '/users/';

export const USER = {
    LIST:  BASE_USER,
    BY_ID: `${BASE_USER}:id`,   // used for GET, PUT, DELETE — method differs
};

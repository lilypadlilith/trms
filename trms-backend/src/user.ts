import logger from './log';
import userService from './dynamodb/user.service';

export default class User {
    constructor(public username: string = '',
        public password: string = '',
        public realname: string = '',
        public role: string = 'employee',
        public superior: string = ''
    ) { };
}

export async function login(name: string, password: string): Promise<User|null> {
    logger.debug(`${name +' '+ password}`);
    return await userService.getUser(name).then((user)=> {
        if (user && user.password === password) {
            return user
        } else {
            return null;
        }
    })
}

export default class User {
    constructor(public username: string = '',
        public password: string = '',
        public realname: string = '',
        public role: string = 'employee',
        public superior: string = ''
    ) { };
}
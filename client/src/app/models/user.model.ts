export class User {

    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public nickname: string,
        public email: string,
        public password: string
    ){}
}
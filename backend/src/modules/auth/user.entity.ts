export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static fromObject(obj: {
    id: number;
    name: string;
    email: string;
    password: string;
  }) {
    return new User(obj.id, obj.name, obj.email, obj.password);
  }
}

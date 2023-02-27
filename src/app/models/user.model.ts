export class User {

  rfc?: string;
  name?: string;
  email?: string;
  password?: string;
  slug?: string;

  constructor(rfc?: string, name?: string, email?: string,
    password?: string, slug?: string) {
    this.rfc = rfc;
    this.name = name;
    this.email = email;
    this.password = password;
    this.slug = slug;
  }

}

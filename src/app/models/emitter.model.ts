
export class Emitter {

  userId?: number;
  bussinessName?: string;
  rfc?: string;
  expeditionPlace?: string;
  taxRegime?: string ;
  status?: number;
  slugEmitter?: string;
  slugUser?: string;

  constructor(userId: number, bussinessName: string, rfc: string,
    expeditionPlace: string, taxRegime: string, status: number, slug: string,
    slugEmitter: string, slugUser: string) {

    this.userId = userId;
    this.bussinessName = bussinessName;
    this.rfc = rfc;
    this.expeditionPlace = expeditionPlace;
    this.taxRegime = taxRegime;
    this.status = status;
    this.slugEmitter = slugEmitter;
    this.slugUser = slugUser;
    
  }

}

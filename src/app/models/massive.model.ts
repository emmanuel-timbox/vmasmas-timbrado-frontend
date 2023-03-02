export class Massive {
  userId?: number;
  rfc?: string;
  rfc_receptor?: string;
  correo?: string;
  fechaIncial?: number;
  fechafinal?: number;
  complemento?: string;
  tipo_so?: string;
  rfc_acuentaAterceros?: string;
  tipo_com?: string;
  uuid?: string;
  rfcR_uuid?: string;
  slugMassive?: string;
  slugUser?: string;


  constructor(userId: number, rfc: string, 
    rfc_receptor: string, correo: string, fechaIncial: number, fechafinal: number, complemento: string, tipo_so: string, 
    rfc_acuentaAterceros: string, uuid: string, slugMassive: string, tipo_com: string,status: number, slug: string,
    slugEmitter: string, slugUser: string) {

    this.userId = userId;
    this.rfc = rfc;
    this.rfc_receptor = rfc_receptor;
    this.correo = correo;
    this.fechaIncial = fechaIncial;
    this.complemento = complemento;
    this.tipo_so = tipo_so;
    this.rfc_acuentaAterceros = rfc_acuentaAterceros;
    this.tipo_com = tipo_com;
    this.uuid = uuid;
    this.slugMassive = slugMassive;
    this.slugUser = slugUser;
  }

  }
  
export class Massive {
  userId?: number;
  rfc?: string;
  RfcReceptor?: string;
  RfcSolicitante?: string;
  correo?: string;
  FechaInicial?: number;
  FechaFinal?: number;
  Complemento?: string;
  TipoSolicitud?: string;
  rfc_acuentaAterceros?: string;
  TipoComprobante?: string;
  uuid?: string;
  rfcR_uuid?: string;
  slugMassive?: string;
  slugUser?: string;
  rack_url?:string;


  constructor(userId: number, rfc: string,
    RfcReceptor: string,
    RfcSolicitante: string,
    correo: string,
    FechaInicial: number, FechaFinal: number,
    Complemento: string,
    TipoSolicitud: string,
    rfc_acuentaAterceros: string,
    uuid: string,
    slugMassive: string,
    TipoComprobante: string,status: number, slug: string,
    slugUser: string, rack_url: string) {

    this.userId = userId;
    this.rfc = rfc;
    this.RfcReceptor = RfcReceptor;
    this.RfcSolicitante = RfcSolicitante;
    this.correo = correo;
    this.FechaInicial = FechaInicial;
    this.FechaFinal = FechaFinal;
    this.Complemento = Complemento;
    this.TipoSolicitud = TipoSolicitud;
    this.rfc_acuentaAterceros = rfc_acuentaAterceros;
    this.TipoComprobante = TipoComprobante;
    this.uuid = uuid;
    this.slugMassive = slugMassive;
    this.rack_url = rack_url;
    this.slugUser = slugUser;
  }








  }

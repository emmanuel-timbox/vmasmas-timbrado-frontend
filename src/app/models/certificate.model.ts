export class Certificate {

  certificateNumber?: string;
  rfcCertificate?: string;
  indetify?: string;
  verifiedBy?: string;
  dateExpiry?: string;
  certificate?: File;
  slugCertificate?: string;
  slugEmitter?: string;

  constructor(certificateNumber?: string, rfcCertificate?: string,identity?: string,
    verifiedBy?: string, dateExpiry?: string, certificate?: File,
    slugCertificate?: string, slugEmitter?: string) {

      this.certificateNumber = certificateNumber;
      this.rfcCertificate = rfcCertificate;
      this.indetify = identity;
      this.verifiedBy = verifiedBy;
      this.dateExpiry = dateExpiry;
      this.certificate = certificate;
      this.slugCertificate = slugCertificate;
      this.slugEmitter = slugEmitter;

    }

}


export class Receiver {

    issuerId?: number;
    rfc?: string;
    bussinessName?: string;
    cfdiUse?: string;
    receivingTaxDomicile?: string;
    recipientTaxRegimen?: string;
    taxIdNumber?: string;
    tax_residence?: string;
    status?: number;
    slugReceiver?: string;
    slugEmitter?: string;

    constructor(issuerId: number, rfc: string, bussinessName: string, 
        cfdiUse: string, receivingTaxDomicile: string, recipientTaxRegimen: string, 
        taxIdNumber: string, tax_residence: string, status: number, slugReceiver: string, 
        slugEmitter: string) {

        this.issuerId = issuerId;
        this.rfc = rfc;
        this.bussinessName = bussinessName;
        this.cfdiUse = cfdiUse;
        this.receivingTaxDomicile = receivingTaxDomicile;
        this.recipientTaxRegimen = recipientTaxRegimen;
        this.taxIdNumber = taxIdNumber;
        this.tax_residence = tax_residence;
        this.status = status;
        this.slugReceiver = slugReceiver;
        this.slugEmitter = slugEmitter;
    }

}

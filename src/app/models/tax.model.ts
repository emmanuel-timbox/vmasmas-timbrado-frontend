
export class Tax {

  
  taxKey?: string;
  taxName?: string;
  taxRate?: number;
  slugTax?: string;
  slugUser?: string;

  constructor(taxKey?: string, taxName?: string, taxRate?: number,
    slugTax?: string, slugUser?: string) {
    this.taxKey = taxKey; // 011
    this.taxName = taxName; //nombre
    this.taxRate = taxRate; //valor impuesto
    this.slugTax = slugTax;
    this.slugUser = slugUser;
  }
}


export class Concept{

    userId?: number;
    productKey?: string;
    idNumber?: string;
    unitKey?: string;
    unit?: string;
    description?: string;
    taxObject?: string;
    slugConcept?: string;   
  
    constructor(
        userId?: number,
        productKey?: string,
        idNumber?: string,
        unitKey?: string,
        unit?: string,
        description?: string,
        taxObject?: string,
        slugConcept?: string,
        ) {
  
            this.userId = userId;
            this.productKey = productKey;
            this.idNumber = idNumber;
            this.unitKey = unitKey;
            this.unit = unit;
            this.description = description;
            this.taxObject = taxObject;
            this.slugConcept = slugConcept;
      
    }
  
  }
  
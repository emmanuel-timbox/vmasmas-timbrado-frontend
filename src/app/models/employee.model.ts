
export class Employee {

  bussiness_name?: string;
  rfc?: string;
  cfdi_use?: string;
  receiving_tax_domicile?: string;
  recipient_tax_regimen?: string;
  slug_receiver?: string;
  curp?: string;
  social_security_number?: string;
  work_start_date?: string;
  antiquity?: string;
  type_contract?: string;
  unionized?: string;
  type_working_day?: string;
  regime_type?: string;
  employee_number?: string;
  departament?: string;
  job?: string;
  occupational_risk?: string;
  payment_frequency?: string;
  banck?: string;
  banck_account?: string;
  base_salary?: string;
  daily_salary?: string;
  federative_entity_key?: string;
  slug_employee?: string;
  id?: null

  constructor(bussiness_name?: string, rfc?: string, cfdi_use?: string, receiving_tax_domicile?: string,
    slug_receiver?: string, recipient_tax_regime?: string, curp?: string, social_security_number?: string,
    work_start_date?: string, antiquity?: string, type_contract?: string, unionized?: string,
    type_working_day?: string, regime_type?: string, employee_number?: string, departement?: string,
    job?: string, occupational_rick?: string, payment_frequency?: string, banck?: string,
    banck_account?: string, base_salary?: string, daily_salary?: string, federative_entity_key?: string,
    slug_employee?: string, id?: null
  ) {

    this.bussiness_name = bussiness_name;
    this.rfc = rfc;
    this.cfdi_use = cfdi_use;
    this.receiving_tax_domicile = receiving_tax_domicile;
    this.recipient_tax_regimen = recipient_tax_regime;
    this.slug_receiver = slug_receiver;
    this.curp = curp;
    this.social_security_number = social_security_number;
    this.work_start_date = work_start_date;
    this.antiquity = antiquity;
    this.type_contract = type_contract;
    this.unionized = unionized;
    this.type_working_day = type_working_day;
    this.regime_type = regime_type;
    this.employee_number = employee_number;
    this.departament = departement;
    this.job = job;
    this.occupational_risk = occupational_rick;
    this.payment_frequency = payment_frequency;
    this.banck = banck;
    this.banck_account = banck_account;
    this.base_salary = base_salary;
    this.daily_salary = daily_salary;
    this.federative_entity_key = federative_entity_key;
    this.slug_employee = slug_employee;
    this.id = id

  }

}

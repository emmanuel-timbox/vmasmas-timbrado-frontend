
export class Employe {

  userId?: number;
  rfc?: string;
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
  risk_put?: string;
  put?: string;
  payment_frequency?: string;
  banck?: string;
  banck_account?: string;
  base_salary?: string;
  daily_salary?: string;
  federative_entity_key?: string;

  constructor(user_id: number, rfc: string, curp: string, social_security_number: string, work_start_date: string, antiquity: string, type_contract: string,
    unionized: string, type_working_day: string, employee_number: string, departament: string, risk_put: string, put: string, payment_frequency: string,
    banck: string, banck_account: string, base_salary: string, daily_salary: string, federative_entity_key: string, regime_type: string,
     slug: string,
    ) {

    this.userId = user_id;
    this.rfc = rfc;
    this.social_security_number = social_security_number;
    this.work_start_date = work_start_date;
    this.antiquity = antiquity;
    this.type_contract = type_contract;
    this.unionized = unionized;
    this.type_working_day = type_working_day;
    this.regime_type = regime_type;
    this.employee_number = employee_number;
    this.departament = departament;
    this.risk_put = risk_put;
    this.payment_frequency = payment_frequency;
    this.banck = banck;
    this.banck_account = banck_account;
    this.base_salary = base_salary;
    this.daily_salary = daily_salary;
    this.federative_entity_key = federative_entity_key;
  

  }

}

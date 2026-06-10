/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Retail & HR Core
export interface branch {
  bid: number;
  bname: string;
  bphone: string;
  baddress: string;
  bcity: string;
}

export interface shift {
  sid: number;
  stype: string;
  stime: number;
  sdate: Date;
  semp_num: number;
  snotes: string;
  bid: number; 
}

export interface employee {
  eid: number;
  ename: string;
  eemail: string;
  ephone: string;
  eaddress: string;
  edate: Date;
  eseniority: number;
}

export interface role {
  rid: number;
  rname: string;
  rdescription: string;
  rrequirements_json: JSON;
}

//Junction Tables
export interface schedule { eid: number; sid: number; }
export interface has { eid: number; rid: number; hsalary: number; }
export interface participate { eid: number; evid: number; }
export interface assignTo { eid: number; gid: number; }

// 2. event & guidence
export interface event {
  evid: number;
  evdate: Date;
  evdescription: string;
  evtype: string;
  evbudget: number;
}

export interface guidence {
  gid: number;
  glocation: string;
  gdate: Date;
  ginstructor: string;
  gdescription_json: JSON;
}

// 3. Factory & Manufacturing
export interface department {
  de_id: number;
  de_name: string;
  location: string;
  budget: number;
  manager_name: string;
  eid: number; 
  pl_id: number; 
}

export interface product_line {
  pl_id: number;
  factory_location: string;
  capacity: number;
  status: string;
  last_maintenance: Date;
  p_id: number;
}

export interface product {
  p_id: number;
  p_name: string;
  p_price: number;
  p_data:Date;
  p_weight: number; 
}

export interface design {
  d_id: number;
  d_name: string;
  d_description: string;
  d_data: Date;
  json_specs: JSON;
  p_id: number; 
}


export interface requires { d_id: number; r_id: number; }
export interface includs { r_id: number; order_id: number; }

// 4. Supply Chain
export interface rawMaterial {
  r_id: number;
  r_name: string;
  r_price: number;
  unit_measure: string;
  stock_quantity: number;
}

export interface supplyOrder {
  order_id: number;
  order_date: Date;
  total: number;
  order_status: string;
  shipping_method: string;
  s_id: number; 
}

export interface supplier {
  s_id: number;
  company_name: string;
  phone: string;
  address: string;
  supplier_metadata: JSON;
}
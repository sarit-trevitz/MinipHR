/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  employee, role, branch, shift, event, guidence,
  department, product_line, product, design, rawMaterial, supplyOrder, supplier,
  schedule, participate, assignTo, has, requires
} from '../types';

interface HRContextType {
  isConnected: boolean;
  dbMode: string;
  
  employee: employee[];
  role: role[];
  branch: branch[];
  shift: shift[];
  event: event[];
  guidence: guidence[];
  department: department[];
  product_lines: product_line[]; 
  product: product[];
  design: design[];
  rawmaterial: rawMaterial[];  
  supplyorder: supplyOrder[];  
  supplier: supplier[];
  requires: requires[];

  schedule: schedule[];
  participate: participate[];
  assignTo: assignTo[];
  has: has[];
  
  constraints: any[];
  triggers: any[];
  

  createRecord: (tableName: string, recordData: any) => Promise<boolean>;
  updateRecord: (tableName: string, idCol: string, idVal: number | string, recordData: any) => Promise<boolean>;
  deleteRecord: (tableName: string, idCol: string, idVal: number | string) => Promise<boolean>;
  runSqlQuery: (queryId: string) => Promise<any>;
  runSqlProcedure: (procedureId: string, parameters: any) => Promise<any>;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export function HRProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [dbMode, setDbMode] = useState('Docker Cluster Live');

  const [employee, setemployee] = useState<employee[]>([]);
  const [role, setrole] = useState<role[]>([]);
  const [branch, setbranch] = useState<branch[]>([]);
  const [shift, setshift] = useState<shift[]>([]);
  const [event, setevent] = useState<event[]>([]);
  const [guidence, setguidence] = useState<guidence[]>([]);
  const [department, setdepartment] = useState<department[]>([]);
  const [product_lines, setproduct_lines] = useState<product_line[]>([]);
  const [product, setproduct] = useState<product[]>([]);
  const [design, setdesign] = useState<design[]>([]);
  const [rawmaterial, setrawmaterial] = useState<rawMaterial[]>([]);
  const [supplyorder, setsupplyorder] = useState<supplyOrder[]>([]);
  const [supplier, setsupplier] = useState<supplier[]>([]);

  const [schedule, setschedule] = useState<schedule[]>([]);
  const [participate, setparticipate] = useState<participate[]>([]);
  const [assignTo, setassignTo] = useState<assignTo[]>([]);
  const [has, sethas] = useState<has[]>([]);
  const [requires, setrequires] = useState<requires[]>([]);
  const [constraints, setConstraints] = useState<any[]>([]);
  const [triggers, setTriggers] = useState<any[]>([]);

  const syncDatabaseContextState = async () => {
    try {
      const dbTables = [
        'employee', 'role', 'branch', 'shift', 'event', 'guidence', 
        'department', 'product_line', 'product', 'design', 'rawmaterial',  
        'supplyorder', 'supplier', 'schedule', 'participate', 'assignto', 'has','requires'
      ];

      const responses = await Promise.all(
        dbTables.map(table => fetch(`/api/${table}`).then(res => {
          if (!res.ok) throw new Error(`Fetch failed for table: ${table}`);
          return res.json();
        }))
      );

      setemployee(responses[0]);
      setrole(responses[1]);
      setbranch(responses[2]);
      setshift(responses[3]);
      setevent(responses[4]);
      setguidence(responses[5]);
      setdepartment(responses[6]);
      setproduct_lines(responses[7]);
      setproduct(responses[8]);
      setdesign(responses[9]);
      setrawmaterial(responses[10]);
      setsupplyorder(responses[11]);
      setsupplier(responses[12]);
      setschedule(responses[13]);
      setparticipate(responses[14]);
      setassignTo(responses[15]);
      sethas(responses[16]);
      setrequires(responses[17]);

      const metadataRes = await fetch('/api/database/metadata');
      if (metadataRes.ok) {
        const metadata = await metadataRes.json();
        setConstraints(metadata.constraints || []);
        setTriggers(metadata.triggers || []);
      }

      setIsConnected(true);
      setDbMode('Docker Cluster Live');
    } catch (err) {
      console.error("Context synchronization breakdown:", err);
      setIsConnected(false);
      setDbMode('Sandbox Offline Fallback Mode');
    }
  };

  useEffect(() => {
    syncDatabaseContextState();
  }, []);

  const createRecord = async (tableName: string, recordData: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (res.ok) {
        await syncDatabaseContextState();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Generic create payload rejected:", err);
      return false;
    }
  };

  const updateRecord = async (tableName: string, idCol: string, idVal: number | string, recordData: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/crud/${tableName}/${idCol}/${idVal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (res.ok) {
        await syncDatabaseContextState();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Generic update criteria failed:", err);
      return false;
    }
  };

  const deleteRecord = async (tableName: string, idCol: string, idVal: number | string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/crud/${tableName}/${idCol}/${idVal}`, { method: 'DELETE' });
      if (res.ok) {
        await syncDatabaseContextState();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Generic delete statement failed:", err);
      return false;
    }
  };

  const runSqlQuery = async (queryId: string): Promise<any> => {
    const res = await fetch('/api/database/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryId })
    });
    if (!res.ok) throw new Error("SQL Select pipeline exception raised from cluster node.");
    const data = await res.json();
    return data.result;
  };

  const runSqlProcedure = async (procedureId: string, parameters: any): Promise<any> => {
    const res = await fetch(`/api/database/procedure/${procedureId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameters)
    });
    if (!res.ok) throw new Error("Stored program compilation aborted via catalog trigger violations.");
    return await res.json();
  };

  return (
    <HRContext.Provider value={{
      isConnected, dbMode,
      employee, role, branch, shift, event, guidence, department, product_lines, product, design, rawmaterial, supplyorder, supplier,
      schedule, participate, assignTo, has, requires, constraints, triggers,
      createRecord, updateRecord, deleteRecord, runSqlQuery, runSqlProcedure
    }}>
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error('useHR hook context must be wrapped implicitly inside an HRProvider boundary layout node.');
  }
  return context;
}
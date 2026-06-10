/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Factory, 
  User, 
  Layers, 
  MapPin, 
  DollarSign, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  TrendingUp,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { department as DepartmentType } from '../types';

export default function DepartmentPage() {
  const { department: departmentList, employee, product_lines, createRecord, updateRecord, deleteRecord } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentType | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const initialFormState = {
    de_id: '',
    de_name: '',
    location: '',
    budget: '', 
    manager_name: '', 
    eid: '',          
    pl_id: ''         
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingDepartment(null);
    
    const firstEmp = employee[0];
    const firstEmpId = firstEmp ? (firstEmp.eid !== undefined ? firstEmp.eid : (firstEmp as any).Eid) : '';
    
    const firstPl = product_lines[0];
    const firstPlId = firstPl ? (firstPl.pl_id !== undefined ? firstPl.pl_id : (firstPl as any).Pl_id) : '';

    setFormData({
      ...initialFormState,
      budget: '50000.00',
      eid: firstEmpId ? String(firstEmpId) : '',
      pl_id: firstPlId ? String(firstPlId) : ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: any) => {
    setEditingDepartment(dept);
    
    // חילוץ סופר-מוגן של כל השדות כדי להתמודד עם אותיות גדולות/קטנות וערכי null מפוסטגרס 🛠️
    const deptId = dept.de_id !== undefined ? dept.de_id : (dept.De_id !== undefined ? dept.De_id : '');
    const deptName = dept.de_name || dept.De_name || '';
    const deptLocation = dept.location || dept.Location || '';
    const deptBudget = dept.budget !== undefined ? dept.budget : (dept.Budget !== undefined ? dept.Budget : '');
    const deptManagerName = dept.manager_name || dept.Manager_name || '';
    
    // נרמול קשיח למפתחות הזרים למניעת איפוס בטופס העריכה
    const deptEid = dept.eid !== undefined ? dept.eid : (dept.Eid !== undefined ? dept.Eid : '');
    const deptPlid = dept.pl_id !== undefined ? dept.pl_id : (dept.Pl_id !== undefined ? dept.Pl_id : '');

    setFormData({
      de_id: String(deptId),
      de_name: deptName,
      location: deptLocation,
      budget: deptBudget !== null && deptBudget !== undefined ? String(deptBudget) : '', 
      manager_name: deptManagerName,
      eid: deptEid !== null && deptEid !== undefined ? String(deptEid) : '',
      pl_id: deptPlid !== null && deptPlid !== undefined ? String(deptPlid) : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 1. ניקוי והמרה בטוחה של התקציב
    const numBudget = Number(formData.budget);
    const parsedBudget = isNaN(numBudget) ? 0.00 : numBudget;

    // 2. בניית ה-Payload עם המרה מפורשת למספר (Number)
    // אם הערך ריק, נשלח 0 או null בהתאם למה שהטבלה שלך דורשת ב-SQL
    const payload = {
      de_name: formData.de_name,
      location: formData.location,
      budget: parsedBudget,
      manager_name: formData.manager_name,
      // כאן התיקון: מבטיחים שה-ID הוא מספר ולא טקסט
      eid: formData.eid ? parseInt(formData.eid, 10) : null,
      pl_id: formData.pl_id ? parseInt(formData.pl_id, 10) : null
    };

    try {
      if (editingDepartment) {
        const targetDeId = editingDepartment.de_id || (editingDepartment as any).De_id;
        console.log("Sending update payload:", payload); // תפתחי את ה-Console כדי לראות מה נשלח בדיוק
        const success = await updateRecord('department', 'de_id', targetDeId, payload);
        if (success) setIsModalOpen(false);
      } else {
        const success = await createRecord('department', {
          de_id: formData.de_id ? Number(formData.de_id) : departmentList.length + 1,
          ...payload
        });
        if (success) setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("העדכון נכשל. בדקי ב-Console מה השגיאה מהשרת.");
    }
  };

  const filteredDepartments = departmentList.filter(dept => {
    if (searchQuery.trim() === '') return true;
    const deptName = String(dept.de_name || (dept as any).De_name || '').toLowerCase();
    return deptName.includes(searchQuery.trim().toLowerCase());
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Manufacturing Departments</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Monitor infrastructure divisions, financial budget limits, and direct mappings between site supervisors and assembly lines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by Department Name..."
              className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-bold w-full sm:w-[220px] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-sm placeholder:font-sans placeholder:font-normal placeholder:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 hover:bg-brand-ink/5 rounded-md opacity-40 hover:opacity-100 transition-all cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button 
            onClick={handleOpenAdd}
            className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            Establish Department
          </button>
        </div>
      </header>

      {searchQuery && (
        <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-brand-primary/5 px-5 py-3 rounded-2xl border border-brand-primary/10">
          <Search size={14} />
          <span>Filtering active schema records. Matching datasets for query string: <strong>"{searchQuery}"</strong></span>
        </div>
      )}

      {/* Grid rendering all live relational departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => {
            const deptId = dept.de_id !== undefined ? dept.de_id : (dept as any).De_id;
            const deptName = dept.de_name || (dept as any).De_name;
            const deptLocation = dept.location || (dept as any).Location;
            const deptBudget = dept.budget !== undefined ? dept.budget : (dept as any).Budget;
            const deptEid = dept.eid !== undefined ? dept.eid : (dept as any).Eid;
            const deptPlid = dept.pl_id !== undefined ? dept.pl_id : (dept as any).Pl_id;
            const deptManagerName = dept.manager_name || (dept as any).Manager_name;

            const matchedEmployee = employee.find(e => Number(e.eid || (e as any).Eid) === Number(deptEid));
            const matchedLine = product_lines.find(pl => Number(pl.pl_id || (pl as any).Pl_id) === Number(deptPlid));

            return (
              <motion.div 
                key={deptId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
              >
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <button 
                    onClick={() => handleOpenEdit(dept)}
                    className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    onClick={() => deleteRecord('department', 'de_id', deptId)}
                    className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div>
                  <div className="h-24 bg-brand-primary/10 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-primary opacity-[0.02]" />
                    <Factory size={36} className="text-brand-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-black tracking-widest text-brand-ink shadow-sm">
                      {deptId}
                    </div>
                  </div>

                  <div className="p-8 space-y-5">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">{deptName}</h3>
                      <div className="flex items-center gap-1.5 text-brand-secondary font-black uppercase tracking-widest text-[9px]">
                        <MapPin size={10} />
                        <span>{deptLocation || 'Unassigned Facility'}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-brand-ink/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Assigned Manager (EID JOIN)</p>
                          <p className="text-xs font-bold text-brand-ink/80">
                            {matchedEmployee ? (matchedEmployee.ename || (matchedEmployee as any).Ename) : `ID: ${deptEid || 'None'}`}
                          </p>
                          {deptManagerName && (
                            <p className="text-[9px] text-brand-ink/40 font-mono mt-0.5">Alias notation: {deptManagerName}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                          <Layers size={14} />
                        </div>
                        <div>
                          <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Active Production Line (PL_ID JOIN)</p>
                          <p className="text-xs font-bold text-brand-ink/80">
                            {matchedLine ? (matchedLine.factory_location || (matchedLine as any).Factory_location) : `Line Key: ${deptPlid || 'None'}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono font-black text-brand-ink text-sm">
                    <DollarSign size={13} className="opacity-30" />
                    <span>{Number(deptBudget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-600 font-sans">
                    <TrendingUp size={11} />
                    <span>Active Budget Allocation</span>
                  </div>
                </div>

              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-16 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-secondary">
              <X size={24} />
            </div>
            <p className="text-sm font-black italic serif text-brand-ink">No manufacturing departments matched</p>
            <p className="text-[11px] opacity-40 font-medium mt-1">Refine your keyword strings inside the query bar input.</p>
          </div>
        )}
      </div>

      {/* Structural Data Management Overlay Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-brand-primary text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    {editingDepartment ? 'Update Division Profile' : 'Register Infrastructure Tuple'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingDepartment ? 'Information Catalog Synchronization' : 'Relational Expansion Transaction'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {!editingDepartment && (
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Department ID (Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. 5"
                        value={formData.de_id}
                        onChange={e => setFormData({...formData, de_id: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Department Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. Logistics & Assembly"
                      value={formData.de_name}
                      onChange={e => setFormData({...formData, de_name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Facility Location</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. Sector G-4"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Financial Allocation Budget (₪)</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. 50000.75"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Supervisor Name Tag Notation</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="Free-text manager alias"
                      value={formData.manager_name}
                      onChange={e => setFormData({...formData, manager_name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Bound Employee Manager (FK Mapping)</label>
                    <select
                      required
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.eid}
                      onChange={e => setFormData({...formData, eid: e.target.value})}
                    >
                      <option value="">Select Employee</option>
                      {employee.map(emp => {
                        const empId = emp.eid !== undefined ? emp.eid : (emp as any).Eid;
                        const empName = emp.ename || (emp as any).Ename;
                        return <option key={String(empId)} value={String(empId)}>{empName}</option>;
                      })}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Bound Product Line (FK Mapping)</label>
                    <select
                      required
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.pl_id}
                      onChange={e => setFormData({...formData, pl_id: e.target.value})}
                    >
                      <option value="">Select Line</option>
                      {product_lines.map(pl => {
                        const plId = pl.pl_id !== undefined ? pl.pl_id : (pl as any).Pl_id;
                        const factoryLocation = pl.factory_location || (pl as any).Factory_location;
                        return <option key={String(plId)} value={String(plId)}>{factoryLocation}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
                  >
                    Cancel Transaction
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/10 cursor-pointer"
                  >
                    <Check size={18} />
                    {editingDepartment ? 'Commit Changes' : 'Execute Tuple'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
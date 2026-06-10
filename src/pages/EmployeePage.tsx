/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2,
  Mail, 
  Phone, 
  DollarSign,
  Briefcase,
  X,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // התאמה ל-framer-motion היציב
import { useHR } from '../context/HRContext';
import { employee as EmployeeType } from '../types'; // שימוש בטיפוס באותיות קטנות לפי קובץ ה-types

export default function EmployeePage() { // שם הקומפוננטה שונה לאות גדולה
  // שינוי שמות המערכים למניעת התנגשויות ודריסת משתנים גלובליים בלולאות
  const { 
    employee: employeeList, 
    role: roleList, 
    has, 
    createRecord, 
    updateRecord, 
    deleteRecord 
  } = useHR();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);
  
  // הגדרת State הכולל את כל שדות העובד ואת שדות טבלת הקשר Has
  const [formData, setFormData] = useState({
    eid: '',
    ename: '',
    eemail: '',
    ephone: '',
    eaddress: '',
    edate: new Date().toISOString().split('T')[0],
    eseniority: 0,
    rid: '',      // שיוך לתפקיד בטבלת הקשר
    hsalary: 50   // קביעת שכר בטבלת הקשר
  });

  const filteredEmployee = employeeList.filter(emp => 
    emp.ename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.eemail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(emp.eid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      eid: '',
      ename: '',
      eemail: '',
      ephone: '',
      eaddress: '',
      edate: new Date().toISOString().split('T')[0],
      eseniority: 0,
      rid: roleList[0]?.rid ? String(roleList[0].rid) : '',
      hsalary: 50
    });
    setIsModalOpen(true);
  };

  // דרישה: בזמן עדכון (update) - המערכת מביאה את יתר השדות מהמפתח ומשם מעדכנים
  const handleOpenEdit = (emp: EmployeeType) => {
    setEditingEmployee(emp);

    // שליפת רשומת השכר והתפקיד הנוכחית של העובד מטבלת הקשר
    const currentHas = has.find(h => h.eid === emp.eid);

    // פרסור בטוח של התאריך לטופס
    let formattedDate = '';
    if (emp.edate) {
      const d = new Date(emp.edate);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    }

    setFormData({
      eid: String(emp.eid),
      ename: emp.ename || '',
      eemail: emp.eemail || '',
      ephone: emp.ephone || '',
      eaddress: emp.eaddress || '',
      edate: formattedDate,
      eseniority: emp.eseniority || 0,
      rid: currentHas ? String(currentHas.rid) : roleList[0]?.rid ? String(roleList[0].rid) : '',
      hsalary: currentHas ? currentHas.hsalary : 50
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const employeePayload = {
      ename: formData.ename,
      eemail: formData.eemail,
      ephone: formData.ephone,
      eaddress: formData.eaddress,
      edate: formData.edate ? new Date(formData.edate) : new Date(),
      eseniority: Number(formData.eseniority)
    };

    if (editingEmployee) {
      // 1. עדכון ישות העובד בטבלה הראשית (עמידה בחתימה התקנית של ה-API הגנרי)
      const empSuccess = await updateRecord('employee', 'eid', editingEmployee.eid, employeePayload);
      
      if (empSuccess && formData.rid) {
        // 2. עדכון רשומת התפקיד והשכר בטבלת הקשר בעקיפין
        await updateRecord('has', 'eid', editingEmployee.eid, {
          rid: Number(formData.rid),
          hsalary: Number(formData.hsalary)
        });
      }
      setIsModalOpen(false);
    } else {
      const targetEid = formData.eid ? Number(formData.eid) : employeeList.length + 1;
      
      // 1. יצירת רשומת עובד חדשה
      const empSuccess = await createRecord('employee', {
        eid: targetEid,
        ...employeePayload
      });

      if (empSuccess && formData.rid) {
        // 2. קישור לתפקיד ולשכר בטבלת הקשר Has
        await createRecord('has', {
          eid: targetEid,
          rid: Number(formData.rid),
          hsalary: Number(formData.hsalary)
        });
      }
      setIsModalOpen(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Personnel Roster</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">Centralized registry for managing human resources profiles and role definitions.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer">
          <UserPlus size={16} /> Onboard New Employee
        </button>
      </header>

      <div className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-ink/5 bg-brand-ink/[0.01]">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            <input type="text" placeholder="Search staff by name or email..." className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-ink/[0.02]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Identity</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Role & Salary (Has Junction)</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Contact & Address</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.2em] font-black opacity-40">Seniority</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/5">
              {filteredEmployee.map((emp) => {
                // דרישה: הצגת שמות ותפקידים במקום מזהים (IDs) בעזרת find על מפתחות זרים
                const relation = has.find(hr => hr.eid === emp.eid);
                const matchedRole = roleList.find(r => r.rid === relation?.rid); // שונה שם המשתנה מ-role ל-matchedRole למניעת קריסה
                
                return (
                  <tr key={emp.eid} className="hover:bg-brand-primary/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-ink text-white flex items-center justify-center font-black">{emp.ename?.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-sm text-brand-ink">{emp.ename}</p>
                          <p className="text-[9px] opacity-40 font-mono">PRIMARY KEY EID: {emp.eid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase text-brand-secondary flex items-center gap-1"><Briefcase size={12}/>{matchedRole?.rname || 'Unassigned'}</span>
                      <p className="text-[9px] opacity-50 flex items-center gap-1 font-mono mt-0.5"><DollarSign size={10} /> {relation?.hsalary?.toLocaleString() || '0'} / hr</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold opacity-70 leading-relaxed">
                      <div className="flex items-center gap-1"><Mail size={12} className="opacity-40"/> {emp.eemail}</div>
                      <div className="flex items-center gap-1"><Phone size={12} className="opacity-40"/> {emp.ephone}</div>
                      <div className="flex items-center gap-1 text-[10px] opacity-50 font-medium"><MapPin size={11}/> {emp.eaddress}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-brand-ink/70">
                      <div className="flex items-center gap-1"><Award size={13} className="text-brand-primary opacity-60"/><span>{emp.eseniority || 0} Years</span></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(emp)} className="p-2 hover:bg-brand-ink/5 rounded-lg text-brand-primary"><Edit2 size={13} /></button>
                        <button onClick={() => deleteRecord('employee', 'eid', emp.eid)} className="p-2 hover:bg-brand-secondary/10 rounded-lg text-brand-secondary"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* מודאל ניהול פרופיל מקיף המאפשר CRUD מלא לשתי הטבלאות הקשורות */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-ink/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-xl rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-black italic serif text-brand-ink">
                  {editingEmployee ? 'Update Staff Member Profile' : 'Onboard Employee Profile Token'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-brand-ink/5 rounded-lg"><X size={18}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!editingEmployee && (
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Employee ID (Numeric Primary Key)</label>
                      <input required type="number" placeholder="e.g. 104" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-mono font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.eid} onChange={e => setFormData({...formData, eid: e.target.value})} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.ename} onChange={e => setFormData({...formData, ename: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Email Address</label>
                    <input required type="email" placeholder="john@enterprise.com" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.eemail} onChange={e => setFormData({...formData, eemail: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Phone Line</label>
                    <input required type="text" placeholder="050-1234567" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.ephone} onChange={e => setFormData({...formData, ephone: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Seniority Years</label>
                    <input required type="number" min="0" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-mono font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.eseniority} onChange={e => setFormData({...formData, eseniority: Number(e.target.value) || 0})} />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Physical Residence Address</label>
                    <input required type="text" placeholder="123 Herzl St, Tel Aviv" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.eaddress} onChange={e => setFormData({...formData, eaddress: e.target.value})} />
                  </div>
                 

                  {/* דרישת שיוך תפקיד ושכר בעקיפין דרך טבלת קשר מתוך המסך */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Corporate Position Designation (FK Mapping)</label>
                    <select required className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary appearance-none bg-white" value={formData.rid} onChange={e => setFormData({...formData, rid: e.target.value})}>
                      <option value="">Select Role</option>
                      {roleList.map(r => <option key={r.rid} value={r.rid}>{r.rname}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Hourly Salary Assignment (Has.hsalary)</label>
                    <input required type="number" min="0" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-mono font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.hsalary} onChange={e => setFormData({...formData, hsalary: Number(e.target.value) || 0})} />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-brand-ink/10 cursor-pointer hover:bg-brand-ink/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs cursor-pointer hover:opacity-90 transition-opacity">Commit Record</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Truck, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  Search,
  Database,
  MapPin,
  Phone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // התאמה לגרסה היציבה של framer-motion
import { useHR } from '../context/HRContext';
import { supplier as SupplierType } from '../types'; // שימוש בטיפוס באותיות קטנות לפי קובץ ה-types

export default function SupplierPage() { // שם הקומפוננטה שונה לאות גדולה
  // שינוי שם המשתנה ל-supplierList למניעת התנגשויות ודריסת משתנים גלובליים
  const { supplier: supplierList, createRecord, updateRecord, deleteRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierType | null>(null);

  const initialFormState = {
    s_id: '',
    company_name: '',
    phone: '',
    address: '',
    supplier_metadata: '{"tier": "Premium", "lead_time_days": 5, "active_contract": true}'
  };

  const [formData, setFormData] = useState(initialFormState);

  // שימוש ב-supplierList המעודכן לצורך פילטור בטוח
  const filteredSupplier = supplierList.filter(s => 
    s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.s_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SupplierType) => {
    setEditingSupplier(item);
    setFormData({
      s_id: String(item.s_id),
      company_name: item.company_name || '',
      phone: item.phone || '',
      address: item.address || '',
      supplier_metadata: item.supplier_metadata ? JSON.stringify(item.supplier_metadata, null, 2) : '{}'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ניסיון פרסור של מחרוזת הטקסט מהטופס בחזרה לאובייקט JSON חוקי
    let parsedMetadata = {};
    try {
      parsedMetadata = JSON.parse(formData.supplier_metadata);
    } catch (err) {
      alert("שגיאה: שדה Supplier Metadata אינו מכיל מבנה JSON תקין.");
      return;
    }

    const payload = {
      company_name: formData.company_name,
      phone: formData.phone,
      address: formData.address,
      supplier_metadata: parsedMetadata
    };

    if (editingSupplier) {
      const success = await updateRecord('supplier', 's_id', editingSupplier.s_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('supplier', {
        s_id: formData.s_id ? Number(formData.s_id) : supplierList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Logistical Supplier Matrix</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Centralized index ledger for tracking external supply vendors, company node telecommunications, and metadata attributes.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer">
          <Plus size={16} /> Register Supplier Node
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input type="text" placeholder="Search supplier by company name or identifier ID..." className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: SUPPLIER</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupplier.map((supplierItem) => ( // שימוש ב-supplierItem למניעת דריסה
          <motion.div key={supplierItem.s_id} className="bg-white rounded-[2rem] border border-brand-ink/5 p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative">
            <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button onClick={() => handleOpenEdit(supplierItem)} className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"><Edit2 size={13} /></button>
              <button onClick={() => deleteRecord('supplier', 's_id', supplierItem.s_id)} className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"><Trash2 size={13} /></button>
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <Truck size={36} className="text-brand-secondary opacity-20" />
                <div className="bg-brand-ink text-white font-mono text-[8px] font-black px-2.5 py-1 rounded-full">SUPPLIER ID: {supplierItem.s_id}</div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">{supplierItem.company_name}</h3>
                <div className="space-y-1 text-xs text-brand-ink/70 font-medium">
                  <p className="flex items-center gap-1.5"><Phone size={13} className="opacity-40" /> {supplierItem.phone || 'No phone'}</p>
                  <p className="flex items-center gap-1.5"><MapPin size={13} className="opacity-40" /> {supplierItem.address || 'No address'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-ink/5 flex items-center justify-between bg-brand-ink/[0.01]">
              <span className="text-[9px] font-mono font-black text-brand-ink/40 uppercase">Metadata Integrity</span>
              <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-600 font-sans"><Info size={11} /> <span>Node Verified</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-ink/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-black italic serif text-brand-ink">
                  {editingSupplier ? 'Modify Supplier Credentials' : 'Register Supplier Entity Token'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-brand-ink/5 rounded-lg"><X size={18}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
                <div className="space-y-4">
                  {!editingSupplier && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Supplier ID (Numeric Primary Key)</label>
                      <input required type="number" placeholder="e.g. 8" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-mono font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.s_id} onChange={e => setFormData({...formData, s_id: e.target.value})} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Company Corporate Name</label>
                    <input required type="text" placeholder="e.g. Global Logistics Inc." className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Telecommunication Phone Line</label>
                    <input required type="text" placeholder="e.g. +972-3-1234567" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Physical HQ Address</label>
                    <input required type="text" placeholder="e.g. 45 HaMasger St, Tel Aviv" className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Supplier Metadata Payload (JSON Text area)</label>
                    <textarea required className="w-full p-3.5 bg-brand-ink/5 rounded-xl text-sm font-mono font-bold border-none focus:ring-2 focus:ring-brand-primary h-28 resize-none bg-white" value={formData.supplier_metadata} onChange={e => setFormData({...formData, supplier_metadata: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-brand-ink/10 cursor-pointer hover:bg-brand-ink/5 transition-colors">Cancel</button>
                  <button type="submit" className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black text-xs uppercase cursor-pointer hover:opacity-90 transition-opacity">{editingSupplier ? 'Sync Changes' : 'Execute Tuple'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
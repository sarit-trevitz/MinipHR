/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, FormEvent } from 'react';
import { 
  Layers, 
  Package, 
  MapPin, 
  Activity, 
  Wrench, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  Gauge,
  Search,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { product_line as ProductLineType } from '../types';
 
export default function ProductLinePage() {
  const { product_lines: productLinesList, product, department, createRecord, updateRecord, deleteRecord } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ProductLineType | null>(null);
  
  const [searchId, setSearchId] = useState('');
 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
 
  const initialFormState = {
    pl_id: '',
    factory_location: '',
    capacity: 5000,
    status: 'Active',
    last_maintenance: new Date().toISOString().split('T')[0],
    p_id: ''
  };
 
  const [formData, setFormData] = useState(initialFormState);
 
  const handleOpenAdd = () => {
    setEditingLine(null);
    setFormData({
      ...initialFormState,
      p_id: product[0]?.p_id ? String(product[0].p_id) : ''
    });
    setIsModalOpen(true);
  };
 
  const handleOpenEdit = (line: ProductLineType) => {
    setEditingLine(line);
    let formattedDate = '';
    if (line.last_maintenance) {
      const d = new Date(line.last_maintenance);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }
 
    setFormData({
      pl_id: String(line.pl_id),
      factory_location: line.factory_location || '',
      capacity: line.capacity || 0,
      status: line.status || 'Active',
      last_maintenance: formattedDate,
      p_id: String(line.p_id)
    });
    setIsModalOpen(true);
  };
 
  const handleDeleteClick = (line: ProductLineType) => {
    const isUsedByDepartment = department.some(dept => {
      const deptPlid = dept.pl_id !== undefined ? dept.pl_id : (dept as any).Pl_id;
      return Number(deptPlid) === Number(line.pl_id);
    });
 
    if (isUsedByDepartment) {
      setAlertMessage("This production line cannot be deleted because it is assigned to an existing department.");
      setIsAlertOpen(true);
      return;
    }
 
    deleteRecord('product_line', 'pl_id', line.pl_id);
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      factory_location: formData.factory_location,
      capacity: Number(formData.capacity),
      status: formData.status,
      last_maintenance: formData.last_maintenance ? new Date(formData.last_maintenance) : new Date(),
      p_id: Number(formData.p_id)
    };
 
    if (editingLine) {
      const success = await updateRecord('product_line', 'pl_id', editingLine.pl_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('product_line', {
        pl_id: formData.pl_id ? Number(formData.pl_id) : productLinesList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };
 
  const formatDisplayDate = (dateInput: any): string => {
    if (!dateInput) return 'N/A';
    const d = new Date(dateInput);
    return !isNaN(d.getTime()) ? d.toLocaleDateString('he-IL') : 'N/A';
  };
 
  const filteredLines = productLinesList.filter(line => 
    String(line.pl_id).includes(searchId)
  );
 
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Factory Product Lines</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Monitor mechanical line capacities, tracking system assembly components, maintenance timestamps, and associated product models.
          </p>
        </div>
 
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by ID..."
              className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-bold w-full sm:w-[180px] focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
          >
            <Plus size={16} />
            Deploy Production Line
          </button>
        </div>
      </header>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[70vh] p-2 no-scrollbar">
        {filteredLines.length > 0 ? (
          filteredLines.map((line) => {
            const matchedProduct = product.find(p => p.p_id === line.p_id);
 
            return (
              <motion.div key={line.pl_id} className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="h-24 bg-brand-ink/5 flex items-center justify-center relative">
                  <Layers size={36} className="text-brand-secondary opacity-20" />
                  <div className="absolute top-4 right-4 bg-brand-ink text-white font-mono text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest">
                    LINE CODE: {line.pl_id}
                  </div>
                </div>
 
                <div className="p-8 space-y-5">
                  <h3 className="text-2xl font-black italic serif text-brand-ink">{line.factory_location}</h3>
                  
                  <div className="space-y-3 pt-2 border-t border-brand-ink/5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                        <Package size={14} />
                      </div>
                      <div>
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Target Model</p>
                        <p className="text-xs font-bold text-brand-ink/80">{matchedProduct?.p_name || 'Unmapped'}</p>
                      </div>
                    </div>
                  </div>
                </div>
 
                <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <button onClick={() => handleOpenEdit(line)} className="p-2 text-brand-primary hover:bg-brand-ink/5 rounded-lg"><Edit2 size={14}/></button>
                     <button onClick={() => handleDeleteClick(line)} className="p-2 text-brand-secondary hover:bg-brand-ink/5 rounded-lg"><Trash2 size={14}/></button>
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{formatDisplayDate(line.last_maintenance)}</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center opacity-40 italic">No lines found.</p>
        )}
      </div>
 
  
      <AnimatePresence>
        {isAlertOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAlertOpen(false)}
              className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center overflow-hidden border border-brand-ink/5"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-brand-secondary" />
              <div className="w-16 h-16 bg-brand-secondary/10 text-brand-secondary flex items-center justify-center rounded-2xl mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-2">
                Action Restricted
              </h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest font-black mb-4">
                Relational Integrity Shield
              </p>
              <p className="text-sm font-medium text-brand-ink/70 leading-relaxed px-2 mb-8">
                {alertMessage}
              </p>
              <button
                onClick={() => setIsAlertOpen(false)}
                className="w-full bg-brand-ink text-white hover:bg-brand-secondary py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-md transition-all cursor-pointer"
              >
                Acknowledge Requirement
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
              <div className="p-8 bg-brand-primary text-white shrink-0">
                <h3 className="text-2xl font-black italic serif">Configure Pipeline</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto no-scrollbar">
                <input required type="number" placeholder="ID" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.pl_id} onChange={e => setFormData({...formData, pl_id: e.target.value})} />
                <input required type="text" placeholder="Location" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.factory_location} onChange={e => setFormData({...formData, factory_location: e.target.value})} />
                <input required type="number" placeholder="Capacity" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
                <select className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Active</option><option>Maintenance</option><option>Offline</option>
                </select>
                <input required type="date" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.last_maintenance} onChange={e => setFormData({...formData, last_maintenance: e.target.value})} />
                <select required className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.p_id} onChange={e => setFormData({...formData, p_id: e.target.value})}>
                    {product.map(p => <option key={p.p_id} value={p.p_id}>{p.p_name}</option>)}
                </select>
                <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-xl font-black uppercase text-xs">Commit</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
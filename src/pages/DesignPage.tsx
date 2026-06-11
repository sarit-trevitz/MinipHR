/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, FormEvent } from 'react';
import { 
  ClipboardList, 
  Package, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  Search,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { design as DesignType } from '../types';
 
export default function DesignPage() {
  const { design: designList, product, requires, createRecord, updateRecord, deleteRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<DesignType | null>(null);
 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
 
  const initialFormState = {
    d_id: '',
    d_name: '',
    d_description: '',
    d_data: new Date().toISOString().split('T')[0],
    json_specs: '{"sole_type": "Rubber", "cushioning": "High", "waterproof": true}',
    p_id: ''
  };
 
  const [formData, setFormData] = useState(initialFormState);
 
  const filteredDesign = designList.filter(d => 
    d.d_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(d.d_id).toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleOpenAdd = () => {
    setEditingDesign(null);
    setFormData({ 
      ...initialFormState, 
      p_id: product[0]?.p_id ? String(product[0].p_id) : '' 
    });
    setIsModalOpen(true);
  };
 
  const handleOpenEdit = (item: DesignType) => {
    setEditingDesign(item);
    let formattedDate = '';
    if (item.d_data) {
      const d = new Date(item.d_data);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }
 
    setFormData({
      d_id: String(item.d_id),
      d_name: item.d_name || '',
      d_description: item.d_description || '',
      d_data: formattedDate,
      json_specs: item.json_specs ? JSON.stringify(item.json_specs, null, 2) : '{}',
      p_id: String(item.p_id)
    });
    setIsModalOpen(true);
  };
 
  const handleDeleteClick = (designItem: DesignType) => {
    const hasRequires = (requires || []).some(r => {
      const rDid = r.d_id !== undefined ? r.d_id : (r as any).D_id;
      return Number(rDid) === Number(designItem.d_id);
    });
 
    if (hasRequires) {
      setAlertMessage("This design cannot be deleted because it has existing raw material requirements linked to it.");
      setIsAlertOpen(true);
      return;
    }
 
    deleteRecord('design', 'd_id', designItem.d_id);
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let parsedJsonSpecs = {};
    try {
      parsedJsonSpecs = JSON.parse(formData.json_specs);
    } catch (err) {
      alert("שגיאה: שדה JSON Specs אינו מכיל מבנה JSON תקין.");
      return;
    }
 
    const payload = {
      d_name: formData.d_name,
      d_description: formData.d_description,
      d_data: formData.d_data ? new Date(formData.d_data) : new Date(),
      json_specs: parsedJsonSpecs,
      p_id: Number(formData.p_id)
    };
 
    if (editingDesign) {
      const success = await updateRecord('design', 'd_id', editingDesign.d_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('design', {
        d_id: formData.d_id ? Number(formData.d_id) : designList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };
 
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Model Design Blueprints</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Administer blueprint specifications, technical material layers, JSON specifications text, and direct product model connections.
          </p>
        </div>
     
        <button 
          onClick={handleOpenAdd}
          className="bg-brand-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer"
        >
          <Plus size={16} /> Register New Design
        </button>
      </header>
 
      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Search blueprints by name or identifier..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[60vh] p-2 no-scrollbar">
        {filteredDesign.map((designItem) => {
          const matchedProduct = product.find(p => p.p_id === designItem.p_id);
          return (
            <motion.div key={designItem.d_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden flex flex-col justify-between group relative">
              

              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button 
                  onClick={() => handleOpenEdit(designItem)}
                  className="p-2 bg-white rounded-xl text-brand-secondary hover:bg-brand-ink hover:text-white transition-colors shadow-sm cursor-pointer border border-brand-ink/5"
                  title="Edit Design Attributes"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(designItem)}
                  className="p-2 bg-white rounded-xl text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors shadow-sm cursor-pointer border border-brand-ink/5"
                  title="Delete Design Specification"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="h-24 bg-brand-secondary/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-secondary opacity-[0.03]" />
                <ClipboardList size={36} className="text-brand-secondary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-black tracking-widest text-brand-ink shadow-sm">{designItem.d_id}</div>
              </div>
              
              <div className="p-8 space-y-5">
                <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">{designItem.d_name}</h3>
                <p className="text-[11px] text-brand-ink/60 leading-relaxed font-sans min-h-[2.5rem]">{designItem.d_description}</p>
                <div className="pt-4 border-t border-brand-ink/5 flex items-center gap-2">
                  <Package size={14} className="opacity-40" />
                  <span className="text-xs font-bold">{matchedProduct?.p_name || 'Unallocated'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
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
 
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm" />
            <motion.div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              <div className="p-8 bg-brand-secondary text-white shrink-0">
                <h3 className="text-2xl font-black italic serif">Blueprint Configuration</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto no-scrollbar flex-1">
                <input required type="number" placeholder="Design ID" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.d_id} onChange={e => setFormData({...formData, d_id: e.target.value})} />
                <input required type="text" placeholder="Name" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.d_name} onChange={e => setFormData({...formData, d_name: e.target.value})} />
                <input required type="date" className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.d_data} onChange={e => setFormData({...formData, d_data: e.target.value})} />
                <textarea required placeholder="Description" className="w-full p-4 bg-brand-ink/5 rounded-xl h-20" value={formData.d_description} onChange={e => setFormData({...formData, d_description: e.target.value})} />
                <textarea required placeholder="JSON Specs" className="w-full p-4 bg-brand-ink/5 rounded-xl font-mono h-32" value={formData.json_specs} onChange={e => setFormData({...formData, json_specs: e.target.value})} />
                <select required className="w-full p-4 bg-brand-ink/5 rounded-xl" value={formData.p_id} onChange={e => setFormData({...formData, p_id: e.target.value})}>
                  {product.map(p => <option key={p.p_id} value={p.p_id}>{p.p_name}</option>)}
                </select>
                <button type="submit" className="w-full bg-brand-secondary text-white py-4 rounded-xl font-black uppercase text-xs">Commit</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
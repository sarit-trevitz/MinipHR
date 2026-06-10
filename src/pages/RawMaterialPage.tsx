/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Boxes, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  DollarSign,
  Layers,
  Search,
  Database,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // התאמה לגרסה היציבה של framer-motion
import { useHR } from '../context/HRContext';
import { rawMaterial as RawMaterialType } from '../types'; // התאמה מדויקת לטיפוס בקובץ ה-types

export default function RawMaterialPage() { // שם הקומפוננטה שונה לאות גדולה
  // שינוי שם המערך ל-rawMaterialList למניעת התנגשויות ודריסת משתנים גלובליים
  const { rawmaterial: rawMaterialList, createRecord, updateRecord, deleteRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterialType | null>(null);

  const initialFormState = {
    r_id: '',
    r_name: '',
    r_price: 25,
    unit_measure: 'Meter',
    stock_quantity: 1000
  };

  const [formData, setFormData] = useState(initialFormState);

  // שימוש ב-rawMaterialList המעודכן לצורך פילטור בטוח
  const filteredMaterials = rawMaterialList.filter(rm => 
    rm.r_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(rm.r_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Requirement Fulfilled: Instantly auto-fills all interactive inputs from selected raw material token metadata
  const handleOpenEdit = (material: RawMaterialType) => {
    setEditingMaterial(material);
    setFormData({
      r_id: String(material.r_id),
      r_name: material.r_name || '',
      r_price: material.r_price || 0,
      unit_measure: material.unit_measure || 'Meter',
      stock_quantity: material.stock_quantity || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const payload = {
      r_name: formData.r_name,
      r_price: Number(formData.r_price),
      unit_measure: formData.unit_measure,
      stock_quantity: Number(formData.stock_quantity)
    };

    if (editingMaterial) {
      // Dispatching PUT request targeting the specified primary key ID column 'r_id'
      const success = await updateRecord('rawmaterial', 'r_id', editingMaterial.r_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      // Dispatching POST request inserting a new inventory block inside PostgreSQL catalog
      const success = await createRecord('rawmaterial', {
        r_id: formData.r_id ? Number(formData.r_id) : rawMaterialList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Raw Materials Inventory</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Manage factory warehouse supplies, unit pricing logs, raw textiles, and available material resource limits.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
        >
          <Plus size={16} />
          Register Raw Supply
        </button>
      </header>

      {/* Control Search Panel bar */}
      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Search material assets by label or key ID..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: rawmaterial</span>
        </div>
      </div>

      {/* Grid rendering database catalog supply components directly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <motion.div 
            key={material.r_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
          >
            {/* Tuple CRUD control operators panel */}
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button 
                onClick={() => handleOpenEdit(material)}
                className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 size={13} />
              </button>
              <button 
                onClick={() => deleteRecord('rawmaterial', 'r_id', material.r_id)}
                className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div>
              {/* Card visual banner context */}
              <div className="h-24 bg-brand-secondary/10 relative overflow-hidden flex items-center justify-center">
                <Boxes size={36} className="text-brand-secondary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-brand-ink text-white font-mono text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest shadow-sm">
                  MATERIAL ID: {material.r_id}
                </div>
              </div>

              <div className="p-8 space-y-5">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">{material.r_name}</h3>
                  <div className="flex items-center gap-1.5 text-brand-secondary font-black uppercase tracking-widest text-[9px] font-mono">
                    <Layers size={10} />
                    <span>Unit Scale: {material.unit_measure || 'Piece'}</span>
                  </div>
                </div>

                {/* Stock volume evaluation metrics */}
                <div className="bg-brand-ink/[0.02] border border-brand-ink/5 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Warehouse Balance</p>
                    <p className="text-lg font-mono font-black text-brand-ink">
                      {material.stock_quantity ? material.stock_quantity.toLocaleString() : '0'}
                    </p>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm ${
                    (material.stock_quantity || 0) > 200 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {(material.stock_quantity || 0) > 200 ? 'Stable' : 'Low Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial tracking footer */}
            <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between bg-brand-ink/[0.01]">
              <div className="flex items-center gap-0.5 font-mono font-black text-brand-ink text-sm">
                <DollarSign size={13} className="opacity-30" />
                <span>{material.r_price ? material.r_price.toLocaleString() : '0'}</span>
                <span className="text-[9px] font-sans opacity-40 font-bold ml-1">/ {material.unit_measure}</span>
              </div>
              <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-brand-primary font-sans">
                <TrendingUp size={11} />
                <span>Base Supply Cost</span>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Relational Supply Properties Entry Overlay Form Modal */}
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
              <div className="p-8 bg-brand-secondary text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    {editingMaterial ? 'Update Supply Parameters' : 'Register Material Asset'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingMaterial ? 'Information Catalog Sync' : 'Procurement Resource Addition'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-4">
                  
                  {!editingMaterial && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Material ID Code (Numeric Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. 8"
                        value={formData.r_id}
                        onChange={e => setFormData({...formData, r_id: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Material Label Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="e.g. Suede Leather, Premium Rubber"
                      value={formData.r_name}
                      onChange={e => setFormData({...formData, r_name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Unit Standard Cost (₪)</label>
                      <input 
                        required
                        type="number" 
                        min="0"
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        value={formData.r_price}
                        onChange={e => setFormData({...formData, r_price: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Unit of Measure</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. Meter, Kg, Sheet"
                        value={formData.unit_measure}
                        onChange={e => setFormData({...formData, unit_measure: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Initial Warehouse Stock Quantity</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      value={formData.stock_quantity}
                      onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
                  >
                    Cancel Supply
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-secondary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/10 cursor-pointer"
                  >
                    <Check size={18} />
                    {editingMaterial ? 'Commit Refinement' : 'Execute Supply Asset'}
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
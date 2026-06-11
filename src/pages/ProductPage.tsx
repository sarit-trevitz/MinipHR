/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, FormEvent } from 'react';
import { 
  Package, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  DollarSign,
  Scale,
  Search,
  Database,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { product as ProductType } from '../types';
 
export default function ProductPage() {
  const { product: productList, product_lines, design, createRecord, updateRecord, deleteRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
 
  const initialFormState = {
    p_id: '',
    p_name: '',
    p_price: 150,
    p_data: new Date().toISOString().split('T')[0],
    p_weight: 0.45
  };
 
  const [formData, setFormData] = useState(initialFormState);
 
  const filteredProduct = productList.filter(p => 
    p.p_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.p_id).toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };
 
  const handleOpenEdit = (item: ProductType) => {
    setEditingProduct(item);
 
    let formattedDate = '';
    if (item.p_data) {
      const d = new Date(item.p_data);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }
 
    setFormData({
      p_id: String(item.p_id),
      p_name: item.p_name || '',
      p_price: item.p_price || 0,
      p_data: formattedDate,
      p_weight: item.p_weight || 0
    });
    setIsModalOpen(true);
  };
 
  const handleDeleteClick = (productItem: ProductType) => {
    const usedInProductLine = product_lines.some(pl => {
      const plPid = pl.p_id !== undefined ? pl.p_id : (pl as any).P_id;
      return Number(plPid) === Number(productItem.p_id);
    });
 
    const usedInDesign = design.some(d => {
      const dPid = d.p_id !== undefined ? d.p_id : (d as any).P_id;
      return Number(dPid) === Number(productItem.p_id);
    });
 
    if (usedInProductLine || usedInDesign) {
      setAlertMessage("This product cannot be deleted because it is referenced in an existing product line or design.");
      setIsAlertOpen(true);
      return;
    }
 
    deleteRecord('product', 'p_id', productItem.p_id);
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    const payload = {
      p_name: formData.p_name,
      p_price: Number(formData.p_price),
      p_data: formData.p_data ? new Date(formData.p_data) : new Date(),
      p_weight: Number(formData.p_weight)
    };
 
    if (editingProduct) {
      const success = await updateRecord('product', 'p_id', editingProduct.p_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('product', {
        p_id: formData.p_id ? Number(formData.p_id) : productList.length + 1,
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
 
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Product Catalog Index</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Manage enterprise product definitions, master price logs, inventory shoe molds, and metadata weight criteria.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
        >
          <Plus size={16} />
          Register New Product
        </button>
      </header>
 
      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Filter models by descriptive name or key ID..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: PRODUCT</span>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProduct.map((productItem) => (
          <motion.div 
            key={productItem.p_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
          >
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button 
                onClick={() => handleOpenEdit(productItem)}
                className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 size={13} />
              </button>
              <button 
                onClick={() => handleDeleteClick(productItem)}
                className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
 
            <div>
              <div className="h-24 bg-brand-primary/5 relative overflow-hidden flex items-center justify-center">
                <Package size={36} className="text-brand-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-black tracking-widest text-brand-ink shadow-sm">
                  PRODUCT ID: {productItem.p_id}
                </div>
              </div>
 
              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">{productItem.p_name}</h3>
                  <div className="flex items-center gap-1.5 text-brand-secondary font-mono text-[9px] font-bold">
                    <Calendar size={11} />
                    <span>Catalog Date: {formatDisplayDate(productItem.p_data)}</span>
                  </div>
                </div>
 
                <div className="bg-brand-ink/5 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[7px] uppercase tracking-widest font-black opacity-40">
                    <Scale size={10} />
                    <span>Specifications Profile (P_WEIGHT Column)</span>
                  </div>
                  <p className="text-xs font-bold text-brand-ink/80 leading-relaxed font-sans">
                    Standard Unit Mass: <span className="font-mono font-black text-brand-primary">{productItem.p_weight || 0} kg</span>
                  </p>
                </div>
              </div>
            </div>
 
            <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between bg-brand-ink/[0.01]">
              <div className="flex items-center gap-0.5 font-mono font-black text-brand-primary text-base">
                <DollarSign size={14} className="opacity-40" />
                <span>{productItem.p_price ? productItem.p_price.toLocaleString() : '0'}</span>
              </div>
              <span className="text-[8px] tracking-wider uppercase opacity-40 font-black">
                MSRP UNIT PRICE
              </span>
            </div>
          </motion.div>
        ))}
      </div>
 
      {/* מודאל אזהרה */}
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
 
  \
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
              className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-brand-primary text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    {editingProduct ? 'Update Model Catalog' : 'Register New Catalog Token'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingProduct ? 'Data Asset Modification' : 'Catalog Portfolio Injection'}
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
                  {!editingProduct && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Product ID Code (Numeric Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. 102"
                        value={formData.p_id}
                        onChange={e => setFormData({...formData, p_id: e.target.value})}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Product Model Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. Air Comfort Max"
                      value={formData.p_name}
                      onChange={e => setFormData({...formData, p_name: e.target.value})}
                    />
                  </div>
 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Standard MSRP Price (₪)</label>
                      <input 
                        required
                        type="number" 
                        min="0"
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        value={formData.p_price}
                        onChange={e => setFormData({...formData, p_price: parseInt(e.target.value) || 0})}
                      />
                    </div>
 
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Unit Product Mass (kg)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        min="0"
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        value={formData.p_weight}
                        onChange={e => setFormData({...formData, p_weight: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
 
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Catalog Log Input Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      value={formData.p_data}
                      onChange={e => setFormData({...formData, p_data: e.target.value})}
                    />
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
                    {editingProduct ? 'Commit Asset Update' : 'Execute Tuple'}
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
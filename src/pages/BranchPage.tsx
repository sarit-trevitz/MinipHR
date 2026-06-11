

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  MapPin, 
  Phone, 
  Plus,
  X,
  Check,
  Navigation,
  Store,
  Edit2,
  Trash2,
  Search,
  Database,
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { branch as BranchType } from '../types';

export default function BranchPage() {
  const { branch: branchList, shift: shiftList, createRecord, updateRecord, deleteRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchType | null>(null);

 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const initialFormState = {
    bid: '',
    bname: '',
    baddress: '',
    bphone: '',
    bcity: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredBranches = branchList.filter((b) =>
    b.bname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(b.bid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BranchType) => {
    setEditingBranch(item);
    setFormData({
      bid: String(item.bid),
      bname: item.bname,
      baddress: item.baddress,
      bphone: item.bphone,
      bcity: item.bcity
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      const success = await updateRecord('branch', 'bid', editingBranch.bid, {
        bname: formData.bname,
        baddress: formData.baddress,
        bphone: formData.bphone,
        bcity: formData.bcity
      });
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('branch', {
        bid: formData.bid ? Number(formData.bid) : branchList.length + 1,
        bname: formData.bname,
        baddress: formData.baddress,
        bphone: formData.bphone,
        bcity: formData.bcity
      });
      if (success) setIsModalOpen(false);
    }
  };

  
  const handleDeleteClick = (branchItem: BranchType) => {
    
    const dependentShiftsCount = shiftList.filter(s => {
      const shiftBid = s.bid !== undefined ? s.bid : (s as any).Bid;
      return Number(shiftBid) === Number(branchItem.bid);
    }).length;

    if (dependentShiftsCount > 0) {
      setAlertMessage("This store node cannot be deleted because there are active operational shifts assigned to this branch location.");
      setIsAlertOpen(true);
      return;
    }

    deleteRecord('branch', 'bid', Number(branchItem.bid));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Retail Store Branches</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Centralized logistical repository displaying real-time branch locations, communication nodes, and administrative entities.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-brand-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer"
        >
          <Plus size={16} />
          Add Store Location
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Search branches by title or key ID..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: BRANCH</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branchItem) => (
          <motion.div 
            key={branchItem.bid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative"
          >
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button 
                onClick={() => handleOpenEdit(branchItem)}
                className="p-2 bg-white rounded-xl text-brand-secondary hover:bg-brand-ink hover:text-white transition-colors shadow-sm cursor-pointer border border-brand-ink/5"
                title="Edit Branch Attributes"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => handleDeleteClick(branchItem)}
                className="p-2 bg-white rounded-xl text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors shadow-sm cursor-pointer border border-brand-ink/5"
                title="Delete Location Node"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="h-24 bg-brand-secondary/10 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-secondary opacity-[0.03]" />
              <Store size={36} className="text-brand-secondary opacity-20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-mono font-black uppercase tracking-widest text-brand-ink">
                {branchItem.bid}
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black tracking-tighter italic serif mb-1">{branchItem.bname}</h3>
                <div className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-[9px]">
                  <Navigation size={10} />
                  <span>{branchItem.bcity} Cluster Node</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Physical Address</p>
                    <p className="text-xs font-bold leading-tight text-brand-ink/80">{branchItem.baddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Telecommunication Line</p>
                    <p className="text-xs font-bold leading-tight text-brand-ink/80">{branchItem.bphone}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* מודאל אזהרה דקורטיבי ומעוצב - חסימת מחיקה סניף */}
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

      {/* Structured CRUD Modification Form Modal */}
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
                    {editingBranch ? 'Update Location Attributes' : 'Register New Location'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingBranch ? 'Relational Data Sync' : 'Network Expansion Transaction'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-ink/10">
                <div className="space-y-4">
                  {!editingBranch && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Branch ID (Key Field)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. 12"
                        value={formData.bid}
                        onChange={e => setFormData({...formData, bid: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Branch Descriptive Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="e.g. Tel Aviv Center"
                      value={formData.bname}
                      onChange={e => setFormData({...formData, bname: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">City Node</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="e.g. Tel Aviv"
                      value={formData.bcity}
                      onChange={e => setFormData({...formData, bcity: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Physical Location Address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="Full street location details"
                      value={formData.baddress}
                      onChange={e => setFormData({...formData, baddress: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Contact Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="03-1234567"
                      value={formData.bphone}
                      onChange={e => setFormData({...formData, bphone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
                  >
                    Cancel Transaction
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer"
                  >
                    <Check size={18} />
                    {editingBranch ? 'Sync Changes' : 'Commit Tuple'}
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
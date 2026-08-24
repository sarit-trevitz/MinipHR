
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  X,
  Check,
  Edit2,
  Trash2,
  Clock,
  FileText,
  Hash,
  MapPin,
  Search,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek } from 'date-fns';
import { useHR } from '../context/HRContext';
import { shift as ShiftType } from '../types';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default function ShiftPage() {
  const { shift: shiftList, branch: branchList, employee: employeeList, schedule, createRecord, updateRecord, deleteRecord } = useHR();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftType | null>(null);
  
  const [searchSid, setSearchSid] = useState('');

  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const initialFormState = {
    sid: '',
    bid: '',
    sdate: format(new Date(), 'yyyy-MM-dd'),
    stype: 'Morning',
    stime: '8',
    semp_num: 5,
    snotes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleOpenAdd = () => {
    setEditingShift(null);
    setFormData({
      ...initialFormState,
      bid: branchList[0]?.bid ? String(branchList[0].bid) : '',
      sdate: format(selectedDate, 'yyyy-MM-dd')
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingShift(item);
    
    let formattedDate = format(new Date(), 'yyyy-MM-dd');
    const rawDate = item.sdate || item.Sdate;
    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().split('T')[0];
      }
    }

    setFormData({
      sid: String(item.sid || item.Sid || ''),
      bid: String(item.bid || item.Bid || ''),
      sdate: formattedDate,
      stype: item.stype || item.Stype || 'Morning',
      stime: String(item.stime || item.Stime || 8),
      semp_num: item.semp_num || item.Semp_num || 5,
      snotes: item.snotes || item.Snotes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      bid: Number(formData.bid),
      sdate: formData.sdate ? new Date(formData.sdate) : new Date(),
      stype: formData.stype,
      stime: Number(formData.stime),
      semp_num: Number(formData.semp_num),
      snotes: formData.snotes
    };

    if (editingShift) {
      const targetSid = editingShift.sid || (editingShift as any).Sid;
      const success = await updateRecord('shift', 'sid', targetSid, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('shift', {
        sid: formData.sid ? Number(formData.sid) : shiftList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };

  
  const handleDeleteClick = (shiftItem: any) => {
    const shiftId = shiftItem.sid !== undefined ? shiftItem.sid : (shiftItem as any).Sid;
    
    
    const assignedCount = (schedule || []).filter(sch => {
      const schSid = sch.sid !== undefined ? sch.sid : (sch as any).Sid;
      return Number(schSid) === Number(shiftId);
    }).length;

    if (assignedCount > 0) {
      setAlertMessage("This shift layout cannot be purged because active personnel are currently assigned to this time slot.");
      setIsAlertOpen(true);
      return;
    }

    deleteRecord('shift', 'sid', Number(shiftId));
  };

  const isSameDayCheck = (shiftDateInput: any, targetDateObj: Date): boolean => {
    if (!shiftDateInput) return false;
    const targetStr = format(targetDateObj, 'yyyy-MM-dd');
    if (shiftDateInput instanceof Date) {
      return shiftDateInput.toISOString().split('T')[0] === targetStr;
    }
    return String(shiftDateInput).split('T')[0] === targetStr;
  };

  const renderShiftCard = (shiftItem: any) => {
    const shiftId = shiftItem.sid !== undefined ? shiftItem.sid : (shiftItem as any).Sid;
    const shiftType = shiftItem.stype || (shiftItem as any).Stype || 'Morning';
    const shiftTime = shiftItem.stime !== undefined ? shiftItem.stime : (shiftItem as any).Stime;
    const shiftCapacity = shiftItem.semp_num !== undefined ? shiftItem.semp_num : (shiftItem as any).Semp_num;
    const shiftNotes = shiftItem.snotes || (shiftItem as any).Snotes;
    const shiftBid = shiftItem.bid !== undefined ? shiftItem.bid : (shiftItem as any).Bid;

    const assignedEmps = (schedule || []).filter(sch => {
      const schSid = sch.sid !== undefined ? sch.sid : (sch as any).Sid;
      return Number(schSid) === Number(shiftId);
    });
    const progress = (assignedEmps.length / (shiftCapacity || 1)) * 100;

    const matchedBranchObj = branchList.find(b => Number(b.bid || (b as any).Bid) === Number(shiftBid));
    const branchDisplayName = matchedBranchObj 
      ? `${matchedBranchObj.bname || (matchedBranchObj as any).Bname} (${matchedBranchObj.bcity || (matchedBranchObj as any).Bcity})`
      : `Unknown Store (ID: ${shiftBid})`;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={shiftId} 
        className="bg-white rounded-[2rem] border border-brand-ink/5 p-8 hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative overflow-hidden"
      >
        <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
          <button 
            onClick={() => handleOpenEdit(shiftItem)}
            className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
            title="Edit Shift Configuration"
          >
            <Edit2 size={12} />
          </button>
          <button 
            onClick={() => handleDeleteClick(shiftItem)}
            className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
            title="Delete Shift Tuple"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[8px] font-mono font-black uppercase tracking-widest ${
                shiftType === 'Morning' ? 'bg-orange-100 text-orange-600' :
                shiftType === 'Afternoon' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {shiftType} Slot
              </span>
            </div>
            
            <div className="space-y-1.5 text-xs text-brand-ink/70 font-medium">
              <div className="flex items-center gap-2">
                <Hash size={13} className="opacity-40" />
                <span>Shift ID Key: <strong className="font-mono text-brand-primary">{shiftId}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="opacity-40" />
                <span>Start Timeline: <strong>{shiftTime}:00</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="opacity-40 mt-0.5" />
                <span>Assigned Branch: <strong>{branchDisplayName}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right flex flex-col justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-widest font-black opacity-30 mb-0.5">Required Staff Headcount</p>
              <p className="text-3xl font-black font-mono tracking-tighter text-brand-ink">
                {assignedEmps.length}<span className="opacity-20 mx-1.5">/</span>{shiftCapacity || 0}
              </p>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded-lg self-start md:self-end mt-2 font-mono">
              {Math.max((shiftCapacity || 0) - assignedEmps.length, 0)} Open Slots Left
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-brand-ink/5">
          <div className="space-y-2">
            <p className="text-[8px] uppercase tracking-widest font-black opacity-30">Assigned Team Personnel</p>
            <div className="flex flex-wrap gap-2">
              {assignedEmps.map(schKey => {
                const schEid = schKey.eid !== undefined ? schKey.eid : (schKey as any).Eid;
                const personObj = employeeList.find(e => Number(e.eid || (e as any).Eid) === Number(schEid));
                const personName = personObj ? (personObj.ename || (personObj as any).Ename) : `EID: ${schEid}`;
                
                return (
                  <div 
                    key={schEid} 
                    title={`Employee ID: ${schEid}`}
                    className="px-3 py-1.5 bg-brand-ink text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <div className="w-4 h-4 bg-white/20 rounded-md flex items-center justify-center text-[8px] font-black uppercase">
                      {personName.charAt(0)}
                    </div>
                    <span>{personName}</span>
                  </div>
                );
              })}
              {assignedEmps.length === 0 && (
                <p className="text-[10px] italic opacity-40 font-medium py-1">No personnel mapped to this tuple layout yet.</p>
              )}
            </div>
          </div>

          <div className="w-full h-1.5 bg-brand-ink/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                progress >= 100 ? 'bg-emerald-500' : 'bg-brand-primary'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {shiftNotes && (
            <div className="flex items-start gap-1.5 bg-brand-ink/[0.02] p-3 rounded-xl border border-brand-ink/5">
              <FileText size={12} className="opacity-30 mt-0.5 shrink-0" />
              <p className="text-[10px] font-medium opacity-60 leading-relaxed">Annotation: {shiftNotes}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const globalFilteredShifts = shiftList.filter(s => {
    const shiftId = s.sid !== undefined ? s.sid : (s as any).Sid;
    return String(shiftId).includes(searchSid.trim());
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Shift Rosters & Calendars</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Administer and map weekly personnel shifts, staffing capacity requirements, and operational schedules per store node.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by Shift SID..."
              className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-mono font-bold w-full sm:w-[200px] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-sm placeholder:font-sans placeholder:font-normal placeholder:opacity-50"
              value={searchSid}
              onChange={(e) => setSearchSid(e.target.value)}
            />
            {searchSid && (
              <button 
                onClick={() => setSearchSid('')}
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
            Schedule Shift Token
          </button>
        </div>
      </header>

      <AnimatePresence>
        {!searchSid && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-brand-ink/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden shrink-0"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-3 hover:bg-brand-ink/5 rounded-xl transition-colors border border-brand-ink/5 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center min-w-[180px]">
                <h3 className="text-xl font-black tracking-tighter italic serif text-brand-ink">{format(selectedDate, 'MMMM yyyy')}</h3>
                <p className="text-[8px] uppercase tracking-widest font-black opacity-30 mt-1">Weekly Timeline Operations</p>
              </div>
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-3 hover:bg-brand-ink/5 rounded-xl transition-colors border border-brand-ink/5 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto md:pb-0 no-scrollbar">
              {weekDays.map((day, i) => {
                const dayFormatted = format(day, 'yyyy-MM-dd');
                const isToday = dayFormatted === format(new Date(), 'yyyy-MM-dd');
                const isSelected = dayFormatted === format(selectedDate, 'yyyy-MM-dd');
                
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={`min-w-[60px] h-20 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                        : 'bg-brand-ink/5 text-brand-ink hover:bg-brand-ink/10'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider font-mono font-black opacity-50 mb-1">{format(day, 'EEE')}</span>
                    <span className="text-lg font-black font-mono">{format(day, 'd')}</span>
                    {isToday && !isSelected && (
                      <div className="absolute bottom-2 w-1 h-1 bg-brand-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {searchSid.trim() !== '' ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between text-xs font-bold text-brand-primary bg-brand-primary/5 px-5 py-3 rounded-2xl border border-brand-primary/10">
              <span className="flex items-center gap-2">
                <Search size={14} />
                <span>Global Dataset Filter. Matching records found: <strong>{globalFilteredShifts.length}</strong></span>
              </span>
              <button onClick={() => setSearchSid('')} className="text-[10px] uppercase font-black tracking-wider opacity-60 hover:opacity-100 transition-opacity">Clear Search</button>
            </div>

            {globalFilteredShifts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {globalFilteredShifts.map(shiftItem => renderShiftCard(shiftItem))}
              </div>
            ) : (
              <div className="bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-16 text-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-secondary">
                  <X size={24} />
                </div>
                <p className="text-sm font-black italic serif text-brand-ink">No exact tuple query matched</p>
                <p className="text-[11px] opacity-40 font-medium mt-1">Double check your database primary keys for SID: "{searchSid}"</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {branchList.map(branchItem => {
              const currentBid = branchItem.bid || (branchItem as any).Bid;
              const branchShifts = shiftList.filter(s => {
                const shiftBid = s.bid !== undefined ? s.bid : (s as any).Bid;
                const shiftDate = s.sdate !== undefined ? s.sdate : (s as any).Sdate;
                return Number(shiftBid) === Number(currentBid) && isSameDayCheck(shiftDate, selectedDate);
              });
              
              return (
                <div key={currentBid} className="space-y-6">
                  <div className="flex items-center gap-4 px-2">
                    <div className="w-2 h-8 bg-brand-secondary rounded-full" />
                    <h3 className="text-xl font-black tracking-tighter italic serif text-brand-ink">
                      {branchItem.bname || (branchItem as any).Bname} ({branchItem.bcity || (branchItem as any).Bcity})
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {branchShifts.length > 0 ? (
                      branchShifts.map(shiftItem => renderShiftCard(shiftItem))
                    ) : (
                      <div className="bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <CalendarIcon size={24} className="opacity-20" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-30">No store shift allocated</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Relational Integrity Alert Modal */}
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

      {/* Structured CRUD Form Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 bg-brand-primary text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    {editingShift ? 'Modify Shift Record' : 'Commit New Shift Allocation'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingShift ? 'Synchronize Profiles' : 'Resource Scheduling Phase'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 text-left no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  {!editingShift && (
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Shift ID (Numeric Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. 24"
                        value={formData.sid}
                        onChange={e => setFormData({...formData, sid: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Associated Store Branch Node (FK Selection)</label>
                    <select 
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.bid}
                      onChange={e => setFormData({...formData, bid: e.target.value})}
                    >
                      <option value="">Choose Targeted Branch</option>
                      {branchList.map(b => {
                        const bId = b.bid !== undefined ? b.bid : (b as any).Bid;
                        const bName = b.bname || (b as any).Bname;
                        const bCity = b.bcity || (b as any).Bcity;
                        return <option key={bId} value={bId}>{bName} ({bCity})</option>;
                      })}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Calendar Allocation Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      value={formData.sdate}
                      onChange={e => setFormData({...formData, sdate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Shift Category Block</label>
                    <select 
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.stype}
                      onChange={e => setFormData({...formData, stype: e.target.value})}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Start Time (24h representation)</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      max="23"
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. 8"
                      value={formData.stime}
                      onChange={e => setFormData({...formData, stime: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Capacity Staff Limit Counter</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      value={formData.semp_num}
                      onChange={e => setFormData({...formData, semp_num: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Log Annotation Notes</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="Add any specific requirements or notes..."
                      value={formData.snotes}
                      onChange={e => setFormData({...formData, snotes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
                  >
                    Cancel Transaction
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                  >
                    <Check size={18} />
                    {editingShift ? 'Sync Changes' : 'Commit Tuple'}
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
// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { useState, FormEvent } from 'react';
// import { 
//   Calendar, 
//   DollarSign, 
//   Plus,
//   X,
//   Check,
//   PartyPopper,
//   ArrowRight,
//   Edit2,
//   Trash2,
//   Search,
//   Hash,
//   Activity
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useHR } from '../context/HRContext';
// import { event as EventType } from '../types';

// export default function EventPage() {
//   const { event: eventList, employee: employeeList, participate, createRecord, updateRecord, deleteRecord } = useHR();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isManageOpen, setIsManageOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
//   const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  
//   // סטייט חדש עבור שורת החיפוש לפי מזהה אירוע (EVid) 🔍
//   const [searchEvid, setSearchEvid] = useState('');
  
//   const initialFormState = {
//     evid: '',
//     evdate: new Date().toISOString().split('T')[0],
//     evdescription: '',
//     evtype: 'Social',
//     evbudget: 1000
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const handleOpenAdd = () => {
//     setEditingEvent(null);
//     setFormData(initialFormState);
//     setIsModalOpen(true);
//   };

//   const handleOpenEdit = (item: EventType) => {
//     setEditingEvent(item);

//     let formattedDate = '';
//     if (item.evdate) {
//       const d = new Date(item.evdate);
//       formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
//     }

//     setFormData({
//       evid: String(item.evid),
//       evdate: formattedDate,
//       evdescription: item.evdescription || '',
//       evtype: item.evtype || 'Social',
//       evbudget: item.evbudget || 0
//     });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       evdate: formData.evdate ? new Date(formData.evdate) : new Date(),
//       evdescription: formData.evdescription,
//       evtype: formData.evtype,
//       evbudget: Number(formData.evbudget)
//     };

//     if (editingEvent) {
//       const success = await updateRecord('event', 'evid', editingEvent.evid, payload);
//       if (success) setIsModalOpen(false);
//     } else {
//       const success = await createRecord('event', {
//         evid: formData.evid ? Number(formData.evid) : eventList.length + 1,
//         ...payload
//       });
//       if (success) setIsModalOpen(false);
//     }
//   };

//   const formatDisplayDate = (dateInput: any): string => {
//     if (!dateInput) return 'N/A';
//     const d = new Date(dateInput);
//     return !isNaN(d.getTime()) ? d.toLocaleDateString('he-IL') : 'N/A';
//   };

//   // פונקציית סינון: תומכת בחיפוש לפי מזהה אירוע גלובלי
//   const filteredEvents = eventList.filter(e => {
//     if (searchEvid.trim() === '') return true;
//     const targetEvid = e.evid !== undefined ? e.evid : (e as any).Evid;
//     return String(targetEvid).includes(searchEvid.trim());
//   });

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8 text-left"
//     >
//       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
//         <div>
//           <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Corporate Events Portfolio</h2>
//           <p className="text-xs opacity-50 max-w-xl font-medium">
//             Plan, coordinate, and review organizational campaigns, workshops, social events, and budgeting logs.
//           </p>
//         </div>

//         {/* שילוב בקר החיפוש החדש בראש העמוד */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
//           <div className="relative flex items-center">
//             <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
//             <input 
//               type="text"
//               placeholder="Search by Event EVid..."
//               className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-mono font-bold w-full sm:w-[200px] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-sm placeholder:font-sans placeholder:font-normal placeholder:opacity-50"
//               value={searchEvid}
//               onChange={(e) => setSearchEvid(e.target.value)}
//             />
//             {searchEvid && (
//               <button 
//                 onClick={() => setSearchEvid('')}
//                 className="absolute right-3 p-1 hover:bg-brand-ink/5 rounded-md opacity-40 hover:opacity-100 transition-all cursor-pointer"
//               >
//                 <X size={12} />
//               </button>
//             )}
//           </div>

//           <button 
//             onClick={handleOpenAdd}
//             className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer shrink-0"
//           >
//             <Plus size={16} />
//             Create System Event
//           </button>
//         </div>
//       </header>

//       {/* אינדיקציית חיפוש קטנה */}
//       {searchEvid && (
//         <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-brand-primary/5 px-5 py-3 rounded-2xl border border-brand-primary/10">
//           <Search size={14} />
//           <span>Active filter applied. Showing matched datasets for Event ID: <strong>"{searchEvid}"</strong></span>
//         </div>
//       )}

//       {/* Renders Event Tuples Directly From Catalog */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredEvents.length > 0 ? (
//           filteredEvents.map((eventItem) => {
//             const eventId = eventItem.evid !== undefined ? eventItem.evid : (eventItem as any).Evid;
//             const eventType = eventItem.evtype || (eventItem as any).Evtype || "Social";
//             const eventDescription = eventItem.evdescription || (eventItem as any).Evdescription || "No description layout parameter mapped.";
//             const eventDate = eventItem.evdate !== undefined ? eventItem.evdate : (eventItem as any).Evdate;
//             const eventBudget = eventItem.evbudget !== undefined ? eventItem.evbudget : (eventItem as any).Evbudget;

//             const attendees = participate.filter(p => {
//               const pEvid = p.evid !== undefined ? p.evid : (p as any).Evid;
//               return Number(pEvid) === Number(eventId);
//             });
//             const attendanceRate = employeeList.length > 0 ? (attendees.length / employeeList.length) * 100 : 0;

//             return (
//               <motion.div 
//                 key={eventId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
//               >
//                 <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                   <button 
//                     onClick={() => handleOpenEdit(eventItem)}
//                     className="p-2 bg-white rounded-xl text-brand-primary hover:bg-brand-ink hover:text-white transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
//                     title="Modify Event Constraints"
//                   >
//                     <Edit2 size={13} />
//                   </button>
//                   <button 
//                     onClick={() => deleteRecord('event', 'evid', eventId)}
//                     className="p-2 bg-white rounded-xl text-brand-primary hover:bg-brand-secondary hover:text-white transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
//                     title="Purge Event Tuple"
//                   >
//                     <Trash2 size={13} />
//                   </button>
//                 </div>

//                 <div>
//                   <div className="h-36 bg-brand-ink relative overflow-hidden flex flex-col justify-end p-6">
//                     <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-transparent opacity-90" />
//                     <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest font-mono">
//                       {eventType}
//                     </div>
                    
//                     {/* תיקון: הצגת תיאור האירוע ככותרת הראשית של הבלוק הויזואלי 🛠️ */}
//                     <div className="relative z-10">
//                       <h3 className="text-lg font-black text-white tracking-tight italic serif line-clamp-2 leading-tight">
//                         {eventDescription}
//                       </h3>
//                     </div>
                    
//                     <div className="absolute -right-2 -top-2 opacity-10 rotate-12 pointer-events-none">
//                       <PartyPopper size={80} className="text-white" />
//                     </div>
//                   </div>
                  
//                   <div className="p-6 space-y-4">
//                     <div className="grid grid-cols-2 gap-3 bg-brand-ink/[0.01] p-3 rounded-xl border border-brand-ink/5">
//                       <div className="space-y-0.5">
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Event Schema ID</p>
//                         <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-brand-ink">
//                           <Hash size={12} className="opacity-40" />
//                           <strong>{eventId}</strong>
//                         </div>
//                       </div>
//                       <div className="space-y-0.5">
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Categorical Type</p>
//                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary font-sans">
//                           <Activity size={12} className="opacity-40" />
//                           <span>{eventType}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="space-y-0.5">
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Execution Date</p>
//                         <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
//                           <Calendar size={12} className="text-brand-primary" />
//                           {formatDisplayDate(eventDate)}
//                         </div>
//                       </div>
//                       <div className="space-y-0.5">
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Allocated Budget</p>
//                         <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
//                           <DollarSign size={12} className="text-brand-secondary" />
//                           ₪{eventBudget ? eventBudget.toLocaleString() : '0'}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-1.5">
//                       <div className="flex items-center justify-between">
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Relational Attendance Ratio</p>
//                         <p className="text-[9px] font-mono font-black uppercase tracking-widest">{Math.round(attendanceRate)}%</p>
//                       </div>
//                       <div className="w-full h-1 bg-brand-ink/5 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-brand-primary transition-all duration-1000"
//                           style={{ width: `${attendanceRate}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6 pt-0 border-t border-brand-ink/5 mt-auto flex items-center justify-between h-16 bg-brand-ink/[0.01]">
//                   <div className="flex -space-x-2">
//                     {attendees.slice(0, 4).map(pKey => {
//                       const pEid = pKey.eid !== undefined ? pKey.eid : (pKey as any).Eid;
//                       const mappedUser = employeeList.find(e => Number(e.eid || (e as any).Eid) === Number(pEid));
//                       return (
//                         <div 
//                           key={pEid} 
//                           className="w-6 h-6 rounded-full border-2 border-white bg-brand-ink text-white flex items-center justify-center text-[8px] font-black italic serif shadow-sm" 
//                           title={mappedUser ? `${mappedUser.ename || (mappedUser as any).Ename} (ID: ${pEid})` : `Staff ID: ${pEid}`}
//                         >
//                           {mappedUser ? (mappedUser.ename || (mappedUser as any).Ename || 'E').charAt(0) : 'E'}
//                         </div>
//                       );
//                     })}
//                     {attendees.length > 4 && (
//                       <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-ink/10 flex items-center justify-center text-[8px] font-black font-mono">
//                         +{attendees.length - 4}
//                       </div>
//                     )}
//                   </div>
//                   <button 
//                     onClick={() => {
//                       setSelectedEvent(eventItem);
//                       setIsManageOpen(true);
//                     }}
//                     className="text-[9px] uppercase font-black text-brand-primary hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer font-sans"
//                   >
//                     Manage Relations <ArrowRight size={10} />
//                   </button>
//                 </div>
//               </motion.div>
//             );
//           })
//         ) : (
//           <div className="col-span-full bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-16 text-center">
//             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-secondary">
//               <X size={24} />
//             </div>
//             <p className="text-sm font-black italic serif text-brand-ink">No exact event entity matched</p>
//             <p className="text-[11px] opacity-40 font-medium mt-1">Double check your schema key pointers for query catalog ID: "{searchEvid}"</p>
//           </div>
//         )}
//       </div>

//       {/* Relational Event Properties Modification Form Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsModalOpen(false)}
//               className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
//             />
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
//             >
//               <div className="p-8 bg-brand-secondary text-white flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-black tracking-tighter italic serif">
//                     {editingEvent ? 'Modify Event Tuple' : 'Declare Event Property'}
//                   </h3>
//                   <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
//                     {editingEvent ? 'Synchronize Record' : 'Relational Planning Stage'}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
//                 <div className="space-y-4">
//                   {!editingEvent && (
//                     <div className="space-y-2">
//                       <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Event Identification (Numeric Key ID)</label>
//                       <input 
//                         required
//                         type="number" 
//                         className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
//                         placeholder="e.g. 15"
//                         value={formData.evid}
//                         onChange={e => setFormData({...formData, evid: e.target.value})}
//                       />
//                     </div>
//                   )}

//                   <div className="space-y-2">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Event Description Narrative</label>
//                     <textarea 
//                       required
//                       className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all resize-none h-20"
//                       placeholder="Describe target goals, operational tasks..."
//                       value={formData.evdescription}
//                       onChange={e => setFormData({...formData, evdescription: e.target.value})}
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Execution Target Date</label>
//                       <div className="relative">
//                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
//                         <input 
//                           required
//                           type="date" 
//                           className="w-full pl-10 pr-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
//                           value={formData.evdate}
//                           onChange={e => setFormData({...formData, evdate: e.target.value})}
//                         />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Categorical Type</label>
//                       <select 
//                         className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all appearance-none bg-white"
//                         value={formData.evtype}
//                         onChange={e => setFormData({...formData, evtype: e.target.value})}
//                       >
//                         <option value="Social">Social</option>
//                         <option value="Professional">Professional</option>
//                         <option value="Training">Training</option>
//                         <option value="Holiday">Holiday</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Allocated Budget Financials (₪)</label>
//                     <div className="relative">
//                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
//                       <input 
//                         required
//                         type="number" 
//                         min="0"
//                         className="w-full pl-10 pr-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
//                         value={formData.evbudget}
//                         onChange={e => setFormData({...formData, evbudget: parseInt(e.target.value) || 0})}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <button 
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
//                   >
//                     Cancel Transaction
//                   </button>
//                   <button 
//                     type="submit"
//                     className="flex-1 bg-brand-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer"
//                   >
//                     <Check size={18} />
//                     {editingEvent ? 'Apply Sync' : 'Commit Entity'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Relational Inspection Dialog Drawer for target attendees list management */}
//       <AnimatePresence>
//         {isManageOpen && selectedEvent && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsManageOpen(false)}
//               className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
//             />
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden"
//             >
//               <div className="p-8 bg-brand-ink text-white flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-black tracking-tighter italic serif">
//                     Junction Log Matrix: {selectedEvent.evdescription || (selectedEvent as any).Evdescription}
//                   </h3>
//                   <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">Information Schema Mapping</p>
//                 </div>
//                 <button 
//                   onClick={() => setIsManageOpen(false)}
//                   className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="p-8 space-y-6 text-left">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div className="bg-brand-ink/5 p-6 rounded-2xl">
//                     <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2">Relational Budget Target</p>
//                     <p className="text-2xl font-black tracking-tighter italic serif text-brand-secondary">
//                       ₪{(selectedEvent.evbudget !== undefined ? selectedEvent.evbudget : (selectedEvent as any).Evbudget)?.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-brand-ink/5 p-6 rounded-2xl">
//                     <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2">Junction Table Context</p>
//                     <p className="text-2xl font-black tracking-tighter italic serif text-brand-primary">PARTICIPATE</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <h4 className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Linked Employee Tuples via FK (ID-to-Name Mapping)</h4>
//                   <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl pr-1">
//                     {participate.filter(p => Number(p.evid !== undefined ? p.evid : (p as any).Evid) === Number(selectedEvent.evid !== undefined ? selectedEvent.evid : (selectedEvent as any).Evid)).length === 0 ? (
//                       <p className="text-xs opacity-40 font-bold p-4 text-center">No assigned employee tuples are bound to this event transaction context.</p>
//                     ) : (
//                       participate.filter(p => Number(p.evid !== undefined ? p.evid : (p as any).Evid) === Number(selectedEvent.evid !== undefined ? selectedEvent.evid : (selectedEvent as any).Evid)).map((relation, idx) => {
//                         const pEid = relation.eid !== undefined ? relation.eid : (relation as any).Eid;
//                         const targetUserObj = employeeList.find(e => Number(e.eid || (e as any).Eid) === Number(pEid));
//                         return (
//                           <div key={idx} className="flex items-center justify-between p-4 bg-brand-ink/5 rounded-xl font-mono">
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary font-bold text-xs font-sans">
//                                 {targetUserObj ? (targetUserObj.ename || (targetUserObj as any).Ename || 'E').charAt(0) : 'E'}
//                               </div>
//                               <span className="text-xs font-bold font-sans text-brand-ink">
//                                 {targetUserObj ? (targetUserObj.ename || (targetUserObj as any).Ename) : 'Unknown Staff Member'}
//                               </span>
//                             </div>
//                             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 text-brand-secondary">FOREIGN KEY EID: {pEid}</span>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="p-8 pt-0">
//                 <button 
//                   onClick={() => setIsManageOpen(false)}
//                   className="w-full bg-brand-ink text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer"
//                 >
//                   Dismiss Structural Management
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }








/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, FormEvent } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Plus,
  X,
  Check,
  PartyPopper,
  ArrowRight,
  Edit2,
  Trash2,
  Search,
  Hash,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { event as EventType } from '../types';
 
export default function EventPage() {
  const { event: eventList, employee: employeeList, participate, createRecord, updateRecord, deleteRecord } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  
  const [searchEvid, setSearchEvid] = useState('');
 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const initialFormState = {
    evid: '',
    evdate: new Date().toISOString().split('T')[0],
    evdescription: '',
    evtype: 'Social',
    evbudget: 1000
  };
 
  const [formData, setFormData] = useState(initialFormState);
 
  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };
 
  const handleOpenEdit = (item: EventType) => {
    setEditingEvent(item);
 
    let formattedDate = '';
    if (item.evdate) {
      const d = new Date(item.evdate);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }
 
    setFormData({
      evid: String(item.evid),
      evdate: formattedDate,
      evdescription: item.evdescription || '',
      evtype: item.evtype || 'Social',
      evbudget: item.evbudget || 0
    });
    setIsModalOpen(true);
  };
 
  const handleDeleteClick = (eventItem: EventType, eventId: any) => {
    const hasParticipants = participate.some(p => {
      const pEvid = p.evid !== undefined ? p.evid : (p as any).Evid;
      return Number(pEvid) === Number(eventId);
    });
 
    if (hasParticipants) {
      setAlertMessage("This event cannot be deleted because there are employees participating in it.");
      setIsAlertOpen(true);
      return;
    }
 
    deleteRecord('event', 'evid', eventId);
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    const payload = {
      evdate: formData.evdate ? new Date(formData.evdate) : new Date(),
      evdescription: formData.evdescription,
      evtype: formData.evtype,
      evbudget: Number(formData.evbudget)
    };
 
    if (editingEvent) {
      const success = await updateRecord('event', 'evid', editingEvent.evid, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('event', {
        evid: formData.evid ? Number(formData.evid) : eventList.length + 1,
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
 
  const filteredEvents = eventList.filter(e => {
    if (searchEvid.trim() === '') return true;
    const targetEvid = e.evid !== undefined ? e.evid : (e as any).Evid;
    return String(targetEvid).includes(searchEvid.trim());
  });
 
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Corporate Events Portfolio</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Plan, coordinate, and review organizational campaigns, workshops, social events, and budgeting logs.
          </p>
        </div>
 
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by Event EVid..."
              className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-mono font-bold w-full sm:w-[200px] focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-sm placeholder:font-sans placeholder:font-normal placeholder:opacity-50"
              value={searchEvid}
              onChange={(e) => setSearchEvid(e.target.value)}
            />
            {searchEvid && (
              <button 
                onClick={() => setSearchEvid('')}
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
            Create System Event
          </button>
        </div>
      </header>
 
      {searchEvid && (
        <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-brand-primary/5 px-5 py-3 rounded-2xl border border-brand-primary/10">
          <Search size={14} />
          <span>Active filter applied. Showing matched datasets for Event ID: <strong>"{searchEvid}"</strong></span>
        </div>
      )}
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((eventItem) => {
            const eventId = eventItem.evid !== undefined ? eventItem.evid : (eventItem as any).Evid;
            const eventType = eventItem.evtype || (eventItem as any).Evtype || "Social";
            const eventDescription = eventItem.evdescription || (eventItem as any).Evdescription || "No description layout parameter mapped.";
            const eventDate = eventItem.evdate !== undefined ? eventItem.evdate : (eventItem as any).Evdate;
            const eventBudget = eventItem.evbudget !== undefined ? eventItem.evbudget : (eventItem as any).Evbudget;
 
            const attendees = participate.filter(p => {
              const pEvid = p.evid !== undefined ? p.evid : (p as any).Evid;
              return Number(pEvid) === Number(eventId);
            });
            const attendanceRate = employeeList.length > 0 ? (attendees.length / employeeList.length) * 100 : 0;
 
            return (
              <motion.div 
                key={eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
              >
                <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleOpenEdit(eventItem)}
                    className="p-2 bg-white rounded-xl text-brand-primary hover:bg-brand-ink hover:text-white transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
                    title="Modify Event Constraints"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(eventItem, eventId)}
                    className="p-2 bg-white rounded-xl text-brand-primary hover:bg-brand-secondary hover:text-white transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
                    title="Purge Event Tuple"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
 
                <div>
                  <div className="h-36 bg-brand-ink relative overflow-hidden flex flex-col justify-end p-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest font-mono">
                      {eventType}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-black text-white tracking-tight italic serif line-clamp-2 leading-tight">
                        {eventDescription}
                      </h3>
                    </div>
                    <div className="absolute -right-2 -top-2 opacity-10 rotate-12 pointer-events-none">
                      <PartyPopper size={80} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 bg-brand-ink/[0.01] p-3 rounded-xl border border-brand-ink/5">
                      <div className="space-y-0.5">
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Event Schema ID</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-brand-ink">
                          <Hash size={12} className="opacity-40" />
                          <strong>{eventId}</strong>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Categorical Type</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary font-sans">
                          <Activity size={12} className="opacity-40" />
                          <span>{eventType}</span>
                        </div>
                      </div>
                    </div>
 
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Execution Date</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
                          <Calendar size={12} className="text-brand-primary" />
                          {formatDisplayDate(eventDate)}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Allocated Budget</p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
                          <DollarSign size={12} className="text-brand-secondary" />
                          ₪{eventBudget ? eventBudget.toLocaleString() : '0'}
                        </div>
                      </div>
                    </div>
 
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30">Relational Attendance Ratio</p>
                        <p className="text-[9px] font-mono font-black uppercase tracking-widest">{Math.round(attendanceRate)}%</p>
                      </div>
                      <div className="w-full h-1 bg-brand-ink/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary transition-all duration-1000"
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
 
                <div className="p-6 pt-0 border-t border-brand-ink/5 mt-auto flex items-center justify-between h-16 bg-brand-ink/[0.01]">
                  <div className="flex -space-x-2">
                    {attendees.slice(0, 4).map(pKey => {
                      const pEid = pKey.eid !== undefined ? pKey.eid : (pKey as any).Eid;
                      const mappedUser = employeeList.find(e => Number(e.eid || (e as any).Eid) === Number(pEid));
                      return (
                        <div 
                          key={pEid} 
                          className="w-6 h-6 rounded-full border-2 border-white bg-brand-ink text-white flex items-center justify-center text-[8px] font-black italic serif shadow-sm" 
                          title={mappedUser ? `${mappedUser.ename || (mappedUser as any).Ename} (ID: ${pEid})` : `Staff ID: ${pEid}`}
                        >
                          {mappedUser ? (mappedUser.ename || (mappedUser as any).Ename || 'E').charAt(0) : 'E'}
                        </div>
                      );
                    })}
                    {attendees.length > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-ink/10 flex items-center justify-center text-[8px] font-black font-mono">
                        +{attendees.length - 4}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEvent(eventItem);
                      setIsManageOpen(true);
                    }}
                    className="text-[9px] uppercase font-black text-brand-primary hover:text-brand-ink transition-colors flex items-center gap-1 cursor-pointer font-sans"
                  >
                    Manage Relations <ArrowRight size={10} />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-16 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-secondary">
              <X size={24} />
            </div>
            <p className="text-sm font-black italic serif text-brand-ink">No exact event entity matched</p>
            <p className="text-[11px] opacity-40 font-medium mt-1">Double check your schema key pointers for query catalog ID: "{searchEvid}"</p>
          </div>
        )}
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
 
      {/* Add/Edit Modal */}
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
                    {editingEvent ? 'Modify Event Tuple' : 'Declare Event Property'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingEvent ? 'Synchronize Record' : 'Relational Planning Stage'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
 
              <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
                <div className="space-y-4">
                  {!editingEvent && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Event Identification (Numeric Key ID)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. 15"
                        value={formData.evid}
                        onChange={e => setFormData({...formData, evid: e.target.value})}
                      />
                    </div>
                  )}
 
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Event Description Narrative</label>
                    <textarea 
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all resize-none h-20"
                      placeholder="Describe target goals, operational tasks..."
                      value={formData.evdescription}
                      onChange={e => setFormData({...formData, evdescription: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Execution Target Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                        <input 
                          required
                          type="date" 
                          className="w-full pl-10 pr-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                          value={formData.evdate}
                          onChange={e => setFormData({...formData, evdate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Categorical Type</label>
                      <select 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all appearance-none bg-white"
                        value={formData.evtype}
                        onChange={e => setFormData({...formData, evtype: e.target.value})}
                      >
                        <option value="Social">Social</option>
                        <option value="Professional">Professional</option>
                        <option value="Training">Training</option>
                        <option value="Holiday">Holiday</option>
                      </select>
                    </div>
                  </div>
 
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Allocated Budget Financials (₪)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                      <input 
                        required
                        type="number" 
                        min="0"
                        className="w-full pl-10 pr-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        value={formData.evbudget}
                        onChange={e => setFormData({...formData, evbudget: parseInt(e.target.value) || 0})}
                      />
                    </div>
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
                    {editingEvent ? 'Apply Sync' : 'Commit Entity'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Manage Modal */}
      <AnimatePresence>
        {isManageOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManageOpen(false)}
              className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-brand-ink text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    Junction Log Matrix: {selectedEvent.evdescription || (selectedEvent as any).Evdescription}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">Information Schema Mapping</p>
                </div>
                <button 
                  onClick={() => setIsManageOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-brand-ink/5 p-6 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2">Relational Budget Target</p>
                    <p className="text-2xl font-black tracking-tighter italic serif text-brand-secondary">
                      ₪{(selectedEvent.evbudget !== undefined ? selectedEvent.evbudget : (selectedEvent as any).Evbudget)?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-brand-ink/5 p-6 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-2">Junction Table Context</p>
                    <p className="text-2xl font-black tracking-tighter italic serif text-brand-primary">PARTICIPATE</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Linked Employee Tuples via FK (ID-to-Name Mapping)</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl pr-1">
                    {participate.filter(p => Number(p.evid !== undefined ? p.evid : (p as any).Evid) === Number(selectedEvent.evid !== undefined ? selectedEvent.evid : (selectedEvent as any).Evid)).length === 0 ? (
                      <p className="text-xs opacity-40 font-bold p-4 text-center">No assigned employee tuples are bound to this event transaction context.</p>
                    ) : (
                      participate.filter(p => Number(p.evid !== undefined ? p.evid : (p as any).Evid) === Number(selectedEvent.evid !== undefined ? selectedEvent.evid : (selectedEvent as any).Evid)).map((relation, idx) => {
                        const pEid = relation.eid !== undefined ? relation.eid : (relation as any).Eid;
                        const targetUserObj = employeeList.find(e => Number(e.eid || (e as any).Eid) === Number(pEid));
                        return (
                          <div key={idx} className="flex items-center justify-between p-4 bg-brand-ink/5 rounded-xl font-mono">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary font-bold text-xs font-sans">
                                {targetUserObj ? (targetUserObj.ename || (targetUserObj as any).Ename || 'E').charAt(0) : 'E'}
                              </div>
                              <span className="text-xs font-bold font-sans text-brand-ink">
                                {targetUserObj ? (targetUserObj.ename || (targetUserObj as any).Ename) : 'Unknown Staff Member'}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 text-brand-secondary">FOREIGN KEY EID: {pEid}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 pt-0">
                <button 
                  onClick={() => setIsManageOpen(false)}
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  Dismiss Structural Management
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
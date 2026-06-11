// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { useState, FormEvent } from 'react';
// import { 
//   FileText, 
//   Plus, 
//   X, 
//   Check, 
//   Edit2, 
//   Trash2,
//   DollarSign,
//   Truck,
//   Calendar,
//   Search,
//   Database
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion'; // התאמה לגרסה היציבה של framer-motion
// import { useHR } from '../context/HRContext';
// import { supplyOrder as SupplyOrderType } from '../types'; // התאמה מדויקת לטיפוס מקובץ ה-types

// export default function SupplyOrderPage() { // שם הקומפוננטה שונה לאות גדולה
//   // שינוי שמות המערכים למניעת התנגשויות ודריסת משתנים גלובליים בלולאות
//   const { supplyorder: supplyOrderList, supplier: supplierList, createRecord, updateRecord, deleteRecord } = useHR();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState<SupplyOrderType | null>(null);

//   const initialFormState = {
//     order_id: '',
//     order_date: new Date().toISOString().split('T')[0],
//     total: 0,
//     order_status: 'Pending',
//     shipping_method: 'Standard Express',
//     s_id: '' // Foreign key target tracking associated Supplier tuple
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   // שימוש ב-supplyOrderList המעודכן לצורך פילטור בטוח
//   const filteredOrders = supplyOrderList.filter(so => 
//     String(so.order_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
//     so.order_status?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleOpenAdd = () => {
//     setEditingOrder(null);
//     setFormData({
//       ...initialFormState,
//       s_id: supplierList[0]?.s_id ? String(supplierList[0].s_id) : ''
//     });
//     setIsModalOpen(true);
//   };

//   // Requirement Fulfilled: Auto-fills update modal fields immediately from selected record context attributes
//   const handleOpenEdit = (order: SupplyOrderType) => {
//     setEditingOrder(order);

//     // המרת אובייקט ה-Date/String של התאריך למחרוזת קלט חוקית YYYY-MM-DD
//     let formattedDate = '';
//     if (order.order_date) {
//       const d = new Date(order.order_date);
//       formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
//     }

//     setFormData({
//       order_id: String(order.order_id),
//       order_date: formattedDate,
//       total: order.total || 0,
//       order_status: order.order_status || 'Pending',
//       shipping_method: order.shipping_method || '',
//       s_id: String(order.s_id || '')
//     });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       order_date: formData.order_date ? new Date(formData.order_date) : new Date(),
//       total: Number(formData.total),
//       order_status: formData.order_status,
//       shipping_method: formData.shipping_method,
//       s_id: Number(formData.s_id)
//     };

//     if (editingOrder) {
//       const success = await updateRecord('supplyorder', 'order_id', editingOrder.order_id, payload);
//       if (success) setIsModalOpen(false);
//     } else {
//       const success = await createRecord('supplyorder', {
//         order_id: formData.order_id ? Number(formData.order_id) : supplyOrderList.length + 1,
//         ...payload
//       });
//       if (success) setIsModalOpen(false);
//     }
//   };

//   // פונקציית עזר להצגת תאריך בפורמט מקומי קריא
//   const formatDisplayDate = (dateInput: any): string => {
//     if (!dateInput) return 'N/A';
//     const d = new Date(dateInput);
//     return !isNaN(d.getTime()) ? d.toLocaleDateString('he-IL') : 'N/A';
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-8 text-left"
//     >
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Supply Purchasing Orders</h2>
//           <p className="text-xs opacity-50 max-w-xl font-medium">
//             Monitor incoming raw supply pipelines, tracking total contract financials, shipping methods, and vendor constraints.
//           </p>
//         </div>
//         <button 
//           onClick={handleOpenAdd}
//           className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
//         >
//           <Plus size={16} />
//           Create Purchase Order
//         </button>
//       </header>

//       {/* Control Search Panel bar */}
//       <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
//         <div className="relative max-w-md w-full">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
//           <input 
//             type="text" 
//             placeholder="Search transactions by identifier or status token..."
//             className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
//           <Database size={12} />
//           <span>SCHEMA TABLE: supplyorder</span>
//         </div>
//       </div>

//       {/* Grid rendering database purchasing orders components directly */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredOrders.map((order) => {
//           // דרישה: הצגת שמות ספקים במקום מזהים (JOIN בעזרת find על מפתחות זרים)
//           const matchedSupplier = supplierList.find(s => s.s_id === order.s_id);

//           return (
//             <motion.div 
//               key={order.order_id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
//             >
//               {/* Tuple CRUD control operators panel */}
//               <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
//                 <button 
//                   onClick={() => handleOpenEdit(order)}
//                   className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
//                 >
//                   <Edit2 size={13} />
//                 </button>
//                 <button 
//                   onClick={() => deleteRecord('supplyorder', 'order_id', order.order_id)}
//                   className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
//                 >
//                   <Trash2 size={13} />
//                 </button>
//               </div>

//               <div>
//                 {/* Visual Header */}
//                 <div className="h-24 bg-brand-ink/5 relative overflow-hidden flex items-center justify-center">
//                   <FileText size={36} className="text-brand-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
//                   <div className="absolute top-4 right-4 bg-brand-ink text-white font-mono text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest shadow-sm">
//                     ORDER ID: {order.order_id}
//                   </div>
                  
//                   {/* Status Toggle Badges mapping column string constraints */}
//                   <div className="absolute top-4 left-4">
//                     <span className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${
//                       order.order_status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
//                       order.order_status === 'Processing' ? 'bg-blue-100 text-blue-700' :
//                       'bg-amber-100 text-amber-700'
//                     }`}>
//                       {order.order_status || 'Pending'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Card Context Body */}
//                 <div className="p-8 space-y-5">
//                   <div>
//                     <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">Receipt Index: #{order.order_id}</h3>
//                     <div className="flex items-center gap-1.5 text-brand-secondary font-black uppercase tracking-widest text-[9px] font-mono">
//                       <Truck size={10} />
//                       <span>Logistics: {order.shipping_method || 'Freight Delivery'}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-3 pt-4 border-t border-brand-ink/5">
//                     {/* Resolved Supplier mapping string (JOIN Substitution context) */}
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
//                         <Truck size={14} />
//                       </div>
//                       <div>
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Procuring Supplier Contract (S_ID JOIN)</p>
//                         <p className="text-xs font-bold text-brand-ink/80">
//                           {matchedSupplier ? matchedSupplier.company_name : `Supplier ID: ${order.s_id || 'Unlinked'}`}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Operational execution timestamp criteria */}
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
//                         <Calendar size={14} />
//                       </div>
//                       <div>
//                         <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Transaction Registry Date</p>
//                         <p className="text-xs font-mono font-bold text-brand-ink/80">
//                           {formatDisplayDate(order.order_date)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Total contract financial sum tracking footer layout */}
//               <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between bg-brand-ink/[0.01]">
//                 <div className="flex items-center gap-0.5 font-mono font-black text-brand-primary text-base">
//                   <DollarSign size={14} className="opacity-40" />
//                   <span>{order.total ? order.total.toLocaleString() : '0'}</span>
//                 </div>
//                 <span className="text-[8px] tracking-wider uppercase opacity-40 font-black">
//                   TOTAL CONTRACT AMOUNT
//                 </span>
//               </div>

//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Relational Properties Modification Overlay Form Modal */}
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
//               className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden"
//             >
//               <div className="p-8 bg-brand-primary text-white flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-black tracking-tighter italic serif">
//                     {editingOrder ? 'Configure Purchase Transaction' : 'Declare Procurement Manifest'}
//                   </h3>
//                   <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
//                     {editingOrder ? 'Relational Record Sync' : 'Financial Contract Addition'}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="p-8 space-y-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
//                   {!editingOrder && (
//                     <div className="sm:col-span-2 space-y-1">
//                       <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Purchase Order ID (Numeric Primary Key)</label>
//                       <input 
//                         required
//                         type="number" 
//                         className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
//                         placeholder="e.g. 99"
//                         value={formData.order_id}
//                         onChange={e => setFormData({...formData, order_id: e.target.value})}
//                       />
//                     </div>
//                   )}

//                   <div className="space-y-1">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Contract Creation Date</label>
//                     <input 
//                       required
//                       type="date" 
//                       className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
//                       value={formData.order_date}
//                       onChange={e => setFormData({...formData, order_date: e.target.value})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Total Valuation Billing (₪)</label>
//                     <input 
//                       required
//                       type="number" 
//                       min="0"
//                       className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
//                       value={formData.total}
//                       onChange={e => setFormData({...formData, total: parseInt(e.target.value) || 0})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Shipping Express Method</label>
//                     <input 
//                       required
//                       type="text" 
//                       className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
//                       placeholder="e.g. Air Freight International, Ocean Cargo"
//                       value={formData.shipping_method}
//                       onChange={e => setFormData({...formData, shipping_method: e.target.value})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Procurement Lifecycle Status</label>
//                     <select
//                       required
//                       className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
//                       value={formData.order_status}
//                       onChange={e => setFormData({...formData, order_status: e.target.value})}
//                     >
//                       <option value="Pending">Pending Approval</option>
//                       <option value="Processing">Processing Order</option>
//                       <option value="Completed">Completed & Delivered</option>
//                     </select>
//                   </div>

//                   {/* Supplier FK Selection Dropdown list mapping values dynamically */}
//                   <div className="sm:col-span-2 space-y-1">
//                     <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Associated Supplying Contractor (FK Mapping Selection)</label>
//                     <select
//                       required
//                       className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
//                       value={formData.s_id}
//                       onChange={e => setFormData({...formData, s_id: e.target.value})}
//                     >
//                       <option value="">Choose Supplier</option>
//                       {supplierList.map(s => (
//                         <option key={s.s_id} value={s.s_id}>{s.company_name} (ID: {s.s_id})</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <button 
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-brand-ink/10 hover:bg-brand-ink/5 transition-all cursor-pointer"
//                   >
//                     Cancel Transaction
//                   </button>
//                   <button 
//                     type="submit"
//                     className="flex-1 bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/10 cursor-pointer"
//                   >
//                     <Check size={18} />
//                     {editingOrder ? 'Sync Valuation' : 'Commit Relational Order'}
//                   </button>
//                 </div>
//               </form>
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
  FileText, 
  Plus, 
  X, 
  Check, 
  Edit2, 
  Trash2,
  DollarSign,
  Truck,
  Calendar,
  Search,
  Database,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useHR } from '../context/HRContext';
import { supplyOrder as SupplyOrderType } from '../types'; 

export default function SupplyOrderPage() { 
  const { 
    supplyorder: supplyOrderList, 
    supplier: supplierList, 
    includes: includesList, 
    createRecord, 
    updateRecord, 
    deleteRecord 
  } = useHR();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SupplyOrderType | null>(null);

  // ניהול מודאל האזהרה המעוצב של האפליקציה (בדיוק כמו בתמונה)
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const initialFormState = {
    order_id: '',
    order_date: new Date().toISOString().split('T')[0],
    total: 0,
    order_status: 'Pending',
    shipping_method: 'Standard Express',
    s_id: '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredOrders = supplyOrderList.filter(so => 
    String(so.order_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    so.order_status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingOrder(null);
    setFormData({
      ...initialFormState,
      s_id: supplierList[0]?.s_id ? String(supplierList[0].s_id) : ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: SupplyOrderType) => {
    setEditingOrder(order);

    let formattedDate = '';
    if (order.order_date) {
      const d = new Date(order.order_date);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }

    setFormData({
      order_id: String(order.order_id),
      order_date: formattedDate,
      total: order.total || 0,
      order_status: order.order_status || 'Pending',
      shipping_method: order.shipping_method || '',
      s_id: String(order.s_id || '')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      order_date: formData.order_date ? new Date(formData.order_date) : new Date(),
      total: Number(formData.total),
      order_status: formData.order_status,
      shipping_method: formData.shipping_method,
      s_id: Number(formData.s_id)
    };

    if (editingOrder) {
      const success = await updateRecord('supplyorder', 'order_id', editingOrder.order_id, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('supplyorder', {
        order_id: formData.order_id ? Number(formData.order_id) : supplyOrderList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };

  // פונקציית בדיקה האם קיימים חומרי גלם או פריטים מקושרים בטבלת INCLUDES
  const getLinkedItemsCount = (orderId: number): number => {
    if (!includesList || !Array.isArray(includesList)) return 0;
    return includesList.filter((item: any) => Number(item.order_id) === Number(orderId)).length;
  };

  // ניהול לחיצת מחיקה והקפצת מודאל האזהרה המעוצב (ללא הודעות דפדפן)
  const handleDeleteClick = (order: SupplyOrderType) => {
    const linkedItemsCount = getLinkedItemsCount(order.order_id);
    
    if (linkedItemsCount > 0) {
      // חסימה מוחלטת והצגת המודאל המעוצב עם הטקסט המדויק מהתמונה שלך
      setAlertMessage("This order cannot be deleted because there are active\n.materials assigned to it");
      setIsAlertOpen(true);
      return; // עוצר כאן ולא מוחק כלום!
    }

    // מחיקה ישירה ושקטה רק אם אין שום דבר מקושר (בלי confirm דפדפן מציק)
    deleteRecord('supplyorder', 'order_id', Number(order.order_id));
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
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Supply Purchasing Orders</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Monitor incoming raw supply pipelines, tracking total contract financials, shipping methods, and vendor constraints.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
        >
          <Plus size={16} />
          Create Purchase Order
        </button>
      </header>

      {/* סרגל חיפוש */}
      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Search transactions by identifier or status token..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: supplyorder</span>
        </div>
      </div>

      {/* גריד כרטיסי הזמנות */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const matchedSupplier = supplierList.find(s => s.s_id === order.s_id);

          return (
            <motion.div 
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
            >
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button 
                  onClick={() => handleOpenEdit(order)}
                  className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-primary shadow-sm hover:bg-brand-ink hover:text-white transition-colors cursor-pointer"
                  title="Configure Purchase Transaction"
                >
                  <Edit2 size={13} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(order)}
                  className="p-2 bg-white rounded-xl border border-brand-ink/5 text-brand-secondary shadow-sm hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer"
                  title="Purge Definition Tuple"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div>
                <div className="h-24 bg-brand-ink/5 relative overflow-hidden flex items-center justify-center">
                  <FileText size={36} className="text-brand-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-brand-ink text-white font-mono text-[8px] font-black px-2.5 py-1 rounded-full tracking-widest shadow-sm">
                    ORDER ID: {order.order_id}
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${
                      order.order_status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      order.order_status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.order_status || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-5">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-1">Receipt Index: #{order.order_id}</h3>
                    <div className="flex items-center gap-1.5 text-brand-secondary font-black uppercase tracking-widest text-[9px] font-mono">
                      <Truck size={10} />
                      <span>Logistics: {order.shipping_method || 'Freight Delivery'}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-brand-ink/5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                        <Truck size={14} />
                      </div>
                      <div>
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Procuring Supplier Contract (S_ID JOIN)</p>
                        <p className="text-xs font-bold text-brand-ink/80">
                          {matchedSupplier ? matchedSupplier.company_name : `Supplier ID: ${order.s_id || 'Unlinked'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-brand-ink/5 rounded-lg flex items-center justify-center text-brand-ink shrink-0">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <p className="text-[7px] uppercase tracking-widest font-black opacity-30 mb-0.5">Transaction Registry Date</p>
                        <p className="text-xs font-mono font-bold text-brand-ink/80">
                          {formatDisplayDate(order.order_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto border-t border-brand-ink/5 h-16 flex items-center justify-between bg-brand-ink/[0.01]">
                <div className="flex items-center gap-0.5 font-mono font-black text-brand-primary text-base">
                  <DollarSign size={14} className="opacity-40" />
                  <span>{order.total ? order.total.toLocaleString() : '0'}</span>
                </div>
                <span className="text-[8px] tracking-wider uppercase opacity-40 font-black">
                  TOTAL CONTRACT AMOUNT
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* מודאל אזהרה דקורטיבי ומעוצב (Custom Alert Modal) - זהה לחלוטין לצילום המסך ששלחת */}
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
              {/* הפס הטורקיז העליון המדויק מהתמונה שלך */}
              <div className="absolute top-0 inset-x-0 h-2 bg-[#007A78]" />

              <div className="w-16 h-16 bg-[#007A78]/10 text-[#007A78] flex items-center justify-center rounded-2xl mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink mb-2">
                Action Restricted
              </h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest font-black mb-4">
                Relational Integrity Shield
              </p>

              {/* הודעת השגיאה המדויקת עם ירידת השורה והנקודה ההפוכה */}
              <p className="text-sm font-medium text-brand-ink/70 leading-relaxed px-2 mb-8 whitespace-pre-line">
                {alertMessage}
              </p>

              <button
                type="button"
                onClick={() => setIsAlertOpen(false)}
                className="w-full bg-brand-ink text-white hover:bg-[#007A78] py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-md transition-all cursor-pointer"
              >
                Acknowledge Requirement
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* הטופס במודאל (Add/Edit) */}
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
                    {editingOrder ? 'Configure Purchase Transaction' : 'Declare Procurement Manifest'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    Relational Record Sync
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {!editingOrder && (
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Purchase Order ID (Numeric Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. 99"
                        value={formData.order_id}
                        onChange={e => setFormData({...formData, order_id: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Contract Creation Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      value={formData.order_date}
                      onChange={e => setFormData({...formData, order_date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Total Valuation Billing (₪)</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      value={formData.total}
                      onChange={e => setFormData({...formData, total: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Shipping Express Method</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. Air Freight International, Ocean Cargo"
                      value={formData.shipping_method}
                      onChange={e => setFormData({...formData, shipping_method: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Procurement Lifecycle Status</label>
                    <select
                      required
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.order_status}
                      onChange={e => setFormData({...formData, order_status: e.target.value})}
                    >
                      <option value="Pending">Pending Approval</option>
                      <option value="Processing">Processing Order</option>
                      <option value="Completed">Completed & Delivered</option>
                    </select>
                  </div>

                  {/* Combobox נשאר פעיל ומציג רק את שמות החברות בצורה נקייה */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40">Associated Supplying Contractor (FK Mapping Selection)</label>
                    <select
                      required
                      className="w-full px-5 py-3.5 bg-brand-ink/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all appearance-none bg-white"
                      value={formData.s_id}
                      onChange={e => setFormData({...formData, s_id: e.target.value})}
                    >
                      <option value="">Choose Supplier</option>
                      {supplierList.map(s => (
                        <option key={s.s_id} value={s.s_id}>{s.company_name}</option>
                      ))}
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
                    {editingOrder ? 'Sync Valuation' : 'Commit Relational Order'}
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
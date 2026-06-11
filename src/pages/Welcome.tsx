  
// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Footprints, 
//   Users, 
//   MapPin, 
//   PartyPopper, 
//   GraduationCap, 
//   Play, 
//   AlertCircle, 
//   BarChart3,
//   Cpu,
//   RefreshCw,
//   TrendingUp,
//   TrendingDown,
//   ChevronUp,
//   ChevronDown,
//   PackageCheck,
//   Coins,
//   Database
// } from 'lucide-react';
// import { useHR } from '../context/HRContext';

// function cn(...inputs: any[]) {
//   return inputs.filter(Boolean).join(' ');
// }

// const StatCard = ({ title, value, icon: Icon, color }: any) => (
//   <div className="bg-white p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-brand-ink/5 relative overflow-hidden">
//     <div className="flex items-center justify-between relative z-10">
//       <div className={cn(
//         "p-3 rounded-2xl",
//         color === 'primary' ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-secondary/10 text-brand-secondary"
//       )}>
//         <Icon size={24} />
//       </div>
//     </div>
//     <div className="relative z-10">
//       <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black mb-1">{title}</p>
//       <p className="text-4xl font-black tracking-tighter italic serif">{value}</p>
//     </div>
//   </div>
// );

// interface RangeBucket {
//   id: string;
//   label: string;
//   events: string[];
// }

// interface Query2Row {
//   rid: number;
//   rname: string;
//   employeecount: string | number;
// }

// interface WorkflowResult {
//   increased: string[];
//   decreased: string[];
//   aboveAvg: string[];
//   belowAvg: string[];
// }

// interface SupplyWorkflowResult {
//   reordered: string[];
//   priceIncreased: string[];
// }

// export default function Welcome() {
//   const { 
//     employee, 
//     branch: branchList, 
//     event: eventList, 
//     guidence, 
//     role: roleList, 
//     participate, 
//     has,         
//     schedule,
//     assignto,
//     rawMaterial: rawMaterialList,
//     includes: includesList,
//     isConnected, 
//     dbMode 
//   } = useHR();

//   // States עבור שאילתא 1 (טווחים)
//   const [isQuery1Running, setIsQuery1Running] = useState(false);
//   const [query1Results, setQuery1Results] = useState<RangeBucket[] | null>(null);
//   const [maxEventsInRange, setMaxEventsInRange] = useState(1);

//   // States עבור שאילתא 2 (מינימום תפקיד)
//   const [isQuery2Running, setIsQuery2Running] = useState(false);
//   const [query2Results, setQuery2Results] = useState<Query2Row[] | null>(null);

//   // States עבור פרוצדורת HR (פרוגרם 1)
//   const [isHRRunning, setIsHRRunning] = useState(false);
//   const [hrResults, setHRResults] = useState<WorkflowResult | null>(null);

//   // States עבור פרוצדורת אספקה (פרוגרם 2)
//   const [isSupplyRunning, setIsSupplyRunning] = useState(false);
//   const [supplyResults, setSupplyResults] = useState<SupplyWorkflowResult | null>(null);

//   // --- הפעלת שאילתא 1 האמיתית מהשרת (חלוקה לטווחים) ---
//   const handleRunQuery1 = async () => {
//     setIsQuery1Running(true);
//     try {
//       const response = await fetch('/api/custom-queries/event-participation');
//       if (!response.ok) throw new Error();
//       const dbRows = await response.json();

//       const ranges = [
//         { id: 'zero', label: '0 Employees', min: 0, max: 0, events: [] as string[] },
//         { id: 'low', label: '1 - 2 Employees', min: 1, max: 2, events: [] as string[] },
//         { id: 'mid', label: '3 - 5 Employees', min: 3, max: 5, events: [] as string[] },
//         { id: 'high', label: '6+ Employees', min: 6, max: 999, events: [] as string[] }
//       ];

//       dbRows.forEach((row: any) => {
//         const count = Number(row.employeecount || row.EmployeeCount || 0);
//         const desc = row.evdescription || row.EVdescription || "Unnamed Event";
//         const target = ranges.find(r => count >= r.min && count <= r.max);
//         if (target) target.events.push(desc);
//       });

//       setMaxEventsInRange(Math.max(...ranges.map(r => r.events.length), 1));
//       setQuery1Results(ranges);
//     } catch (err) {
//       alert("Error executing Event Participation SQL Query.");
//     } finally {
//       setIsQuery1Running(false);
//     }
//   };

//   // --- הפעלת שאילתא 2 האמיתית מהשרת (מינימום תפקיד) ---
//   const handleRunQuery2 = async () => {
//     setIsQuery2Running(true);
//     try {
//       const response = await fetch('/api/custom-queries/minimum-roles');
//       if (!response.ok) throw new Error();
//       const dbRows = await response.json();
      
//       const normalizedRows = dbRows.map((row: any) => ({
//         rid: row.rid || row.Rid,
//         rname: row.rname || row.Rname,
//         employeecount: row.employeecount || row.EmployeeCount || 0
//       }));

//       setQuery2Results(normalizedRows);
//     } catch (err) {
//       alert("Error executing Minimum Roles SQL Query.");
//     } finally {
//       setIsQuery2Running(false);
//     }
//   };

//   // --- הפעלת פרוצדורת משאבי אנוש ושכר (פרוגרם 1) ---
//   const handleRunHRPipeline = async () => {
//     setIsHRRunning(true);
//     try {
//       const response = await fetch('/api/custom-procedures/run-hr-pipeline', { method: 'POST' });
//       if (!response.ok) throw new Error("Server error");

//       const increasedList: string[] = [];
//       const decreasedList: string[] = [];
//       const aboveAvgList: string[] = [];
//       const belowAvgList: string[] = [];

//       (employee || []).forEach(emp => {
//         const empId = emp.eid || emp.Eid;
//         const empName = emp.ename || emp.Ename;
        
//         const trainingCount = (assignto || []).filter((a: any) => (a.eid || a.Eid) === empId).length;
//         const empHasData = (has || []).find((h: any) => (h.eid || h.Eid) === empId);
        
//         const currentSalary = empHasData ? Number(empHasData.hsalary || empHasData.Hsalary || 0) : 8500;
//         const currentRid = empHasData ? (empHasData.rid || empHasData.Rid) : null;

//         const roleSalaries = (has || []).filter((h: any) => (h.rid || h.Rid) === currentRid).map((h: any) => Number(h.hsalary || h.Hsalary || 0));
//         const avgSalary = roleSalaries.length > 0 ? roleSalaries.reduce((a, b) => a + b, 0) / roleSalaries.length : 8000;

//         let finalSalary = currentSalary;
//         if (trainingCount > 3) {
//           finalSalary = Math.round(currentSalary * 1.05);
//           increasedList.push(empName);
//         } else if (trainingCount === 0 && (currentSalary * 0.95) >= 7000) {
//           finalSalary = Math.round(currentSalary * 0.95);
//           decreasedList.push(empName);
//         }

//         if (trainingCount > 3 && (schedule || []).filter((s: any) => (s.eid || s.Eid) === empId).length < 10) {
//           const penalized = Math.round(finalSalary * 0.95);
//           if (penalized >= 7000) {
//             finalSalary = penalized;
//             if (!decreasedList.includes(empName)) decreasedList.push(empName);
//           }
//         }

//         if (finalSalary > avgSalary) aboveAvgList.push(empName);
//         else if (finalSalary < avgSalary) belowAvgList.push(empName);
//       });

//       setHRResults({ increased: increasedList, decreased: decreasedList, aboveAvg: aboveAvgList, belowAvg: belowAvgList });
//     } catch (err) {
//       console.error("Frontend visualization error:", err);
//       alert("Procedure ran successfully in DB, but failed to render graphics.");
//     } finally {
//       setIsHRRunning(false);
//     }
//   };

//   // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) ---
//   const handleRunSupplyPipeline = async () => {
//     setIsSupplyRunning(true);
//     try {
//       const response = await fetch('/api/custom-procedures/run-supply-pipeline', { method: 'POST' });
//       if (!response.ok) throw new Error("Server error");

//       const reorderedList: string[] = [];
//       const priceIncreasedList: string[] = [];
//       const currentMaterials = rawMaterialList || [];
//       const currentIncludes = includesList || [];

//       currentMaterials.forEach(mat => {
//         const matId = mat.r_id || mat.R_id;
//         const matName = mat.r_name || mat.R_name;
//         const currentStock = Number(mat.stock_quantity || mat.Stock_Quantity || 0);

//         let isReordered = false;
//         if (currentStock < 50) {
//           reorderedList.push(matName);
//           isReordered = true;
//         }

//         const totalOrdersCount = currentIncludes.filter((inc: any) => (inc.r_id || inc.R_id) === matId).length;
//         if (totalOrdersCount > 5 || isReordered) {
//           priceIncreasedList.push(matName);
//         }
//       });

//       setSupplyResults({ reordered: reorderedList, priceIncreased: priceIncreasedList });
//     } catch (err) {
//       console.error("Frontend visualization error:", err);
//       alert("Procedure ran successfully in DB, but failed to render graphics.");
//     } finally {
//       setIsSupplyRunning(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-12 text-left relative overflow-hidden"
//     >
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[120px] -z-10" />

//       {/* Header */}
//       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-brand-ink/5">
//         <div className="flex items-center gap-6">
//           <div className="w-20 h-20 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-brand-primary/20 shrink-0">
//             <Footprints size={40} />
//           </div>
//           <div>
//             <h1 className="text-5xl font-black tracking-tighter italic serif text-brand-ink">
//               BestShoes Store
//             </h1>
//           </div>
//         </div>

//         <div className="bg-white px-6 py-4 rounded-2xl border border-brand-ink/5 shadow-sm shrink-0 flex items-center gap-4">
//           <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
//           <div>
//             <p className="text-[8px] uppercase tracking-widest font-black opacity-40">Database Engine</p>
//             <p className="text-xs font-black uppercase tracking-tight text-brand-ink">
//               {isConnected ? `Connected (${dbMode})` : 'Offline'}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Global Metadata Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Employees" value={employee.length} icon={Users} color="primary" />
//         <StatCard title="Active Branches" value={branchList.length} icon={MapPin} color="secondary" />
//         <StatCard title="Events" value={eventList.length} icon={PartyPopper} color="primary" />
//         <StatCard title="Guidance Seminars" value={guidence.length} icon={GraduationCap} color="secondary" />
//       </div>

//       {/* --- SECTION 1: LIVE RELATIONAL QUERIES --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* QUERY 1: Event Ranges */}
//         <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <BarChart3 size={16} className="text-brand-primary" />
//               <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #3</h3>
//             </div>
//             <h4 className="text-xl font-black italic serif text-brand-ink">Event Participation Ranges</h4>
//           </div>

//           <div className="flex-1 py-2 flex flex-col justify-center">
//             <AnimatePresence mode="wait">
//               {!query1Results ? (
//                 <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
//                   <button 
//                     disabled={isQuery1Running}
//                     onClick={handleRunQuery1} 
//                     className="mx-auto bg-brand-primary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {isQuery1Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
//                     Run PostgreSQL Query
//                   </button>
//                 </div>
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="space-y-4 bg-brand-ink/[0.01] p-4 rounded-2xl border border-brand-ink/5">
//                     {query1Results.map(range => {
//                       const percentage = (range.events.length / maxEventsInRange) * 100;
//                       return (
//                         <div key={range.id} className="space-y-1">
//                           <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
//                             <span className="opacity-50">{range.label}</span>
//                             <span className="text-brand-primary">{range.events.length} Events</span>
//                           </div>
//                           <div className="w-full h-2 bg-brand-ink/5 rounded-full overflow-hidden">
//                             <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percentage}%` }} />
//                           </div>
//                           {range.events.length > 0 && (
//                             <p className="text-[10px] text-brand-ink/60 font-medium pl-2 italic">
//                               Includes: {range.events.join(', ')}
//                             </p>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <button onClick={() => setQuery1Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-primary transition-colors">Clear Buffer</button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* QUERY 2: Minimum Staff */}
//         <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <AlertCircle size={16} className="text-brand-secondary" />
//               <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #8</h3>
//             </div>
//             <h4 className="text-xl font-black italic serif text-brand-ink">Roles With Minimum Staff Assigned</h4>
//           </div>

//           <div className="flex-1 py-2 flex flex-col justify-center">
//             <AnimatePresence mode="wait">
//               {!query2Results ? (
//                 <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
//                   <button 
//                     disabled={isQuery2Running}
//                     onClick={handleRunQuery2} 
//                     className="mx-auto bg-brand-secondary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {isQuery2Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
//                     Run PostgreSQL Query
//                   </button>
//                 </div>
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="divide-y divide-brand-ink/5 border border-brand-ink/5 rounded-2xl overflow-hidden bg-brand-ink/[0.01]">
//                     {query2Results.map((result, index) => (
//                       <div key={index} className="p-4 flex items-center justify-between font-bold">
//                         <p className="text-sm text-brand-ink">{result.rname}</p>
//                         <span className="px-3 py-1.5 rounded-xl bg-brand-secondary/10 text-brand-secondary text-xs font-black uppercase tracking-wider font-mono">
//                           {result.employeecount} Employees
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <button onClick={() => setQuery2Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-secondary transition-colors">Clear Buffer</button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//       </div>

//       {/* --- PIPELINE 1: HR & SALARY PROCEDURES BALANCE --- */}
//       <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
//               <Cpu size={24} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">HR Stored Workflows Balance</h3>
//               <p className="text-xs text-brand-ink/50 mt-0.5">Executes check_shifts_and_adjust_penalties() directly inside PostgreSQL.</p>
//             </div>
//           </div>

//           <button 
//             disabled={isHRRunning}
//             onClick={handleRunHRPipeline}
//             className="px-6 py-4 bg-brand-primary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer disabled:opacity-50"
//           >
//             {isHRRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
//             {isHRRunning ? "Executing in DB..." : "Run HR Routines"}
//           </button>
//         </div>

//         <AnimatePresence mode="wait">
//           {hrResults ? (
//             <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-500/10 space-y-4">
//                 <p className="text-emerald-700 font-black uppercase tracking-wider text-[10px]">Salary Increased</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.increased.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-emerald-500/5">✓ {name}</p>)}
//                   {hrResults.increased.length === 0 && <p className="opacity-40 italic py-2">No records.</p>}
//                 </div>
//               </div>
//               <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-500/10 space-y-4">
//                 <p className="text-rose-700 font-black uppercase tracking-wider text-[10px]">Salary Decreased</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.decreased.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-rose-500/5">⚠️ {name}</p>)}
//                   {hrResults.decreased.length === 0 && <p className="opacity-40 italic py-2">No records.</p>}
//                 </div>
//               </div>
//               <div className="p-6 bg-amber-50/40 rounded-2xl border border-amber-500/10 space-y-4">
//                 <p className="text-amber-700 font-black uppercase tracking-wider text-[10px]">Above Role Average</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.aboveAvg.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-amber-500/5">⬆ {name}</p>)}
//                 </div>
//               </div>
//               <div className="p-6 bg-brand-ink/[0.02] rounded-2xl border border-brand-ink/5 space-y-4">
//                 <p className="text-brand-ink/60 font-black uppercase tracking-wider text-[10px]">Below Role Average</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.belowAvg.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-brand-ink/5">⬇ {name}</p>)}
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="text-center py-10 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
//               <p className="text-xs font-bold opacity-40">PostgreSQL procedural transaction state is ready to deploy.</p>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* --- PIPELINE 2: SUPPLY CHAIN & STOCK PROCEDURES BALANCE --- */}
//       <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-brand-secondary/10 rounded-2xl text-brand-secondary">
//               <Database size={24} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">Supply Chain PL/pgSQL Balance</h3>
//               <p className="text-xs text-brand-ink/50 mt-0.5">Executes increase_material_prices_by_orders_amount() directly inside PostgreSQL.</p>
//             </div>
//           </div>

//           <button 
//             disabled={isSupplyRunning}
//             onClick={handleRunSupplyPipeline}
//             className="px-6 py-4 bg-brand-secondary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-secondary/10 transition-all cursor-pointer disabled:opacity-50"
//           >
//             {isSupplyRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
//             {isSupplyRunning ? "Executing in DB..." : "Run Supply Routines"}
//           </button>
//         </div>

//         <AnimatePresence mode="wait">
//           {supplyResults ? (
//             <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-8 bg-sky-50/60 rounded-3xl border border-sky-500/10 space-y-4">
//                 <div className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-wider text-[11px]">
//                   <PackageCheck size={16} />
//                   <span>Reordered Raw Materials (Stock Restocked +100)</span>
//                 </div>
//                 <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
//                   {supplyResults.reordered.map((name, i) => (
//                     <p key={i} className="bg-white/90 p-3 rounded-xl border border-sky-500/5 flex justify-between items-center shadow-sm">
//                       <span>📦 {name}</span>
//                       <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md uppercase font-black tracking-wider">Trigger Restock</span>
//                     </p>
//                   ))}
//                   {supplyResults.reordered.length === 0 && <p className="opacity-40 italic py-4 text-center">All materials satisfy baseline stock counts (&gt; 50 units).</p>}
//                 </div>
//               </div>

//               <div className="p-8 bg-amber-50/60 rounded-3xl border border-amber-500/10 space-y-4">
//                 <div className="flex items-center gap-2 text-amber-700 font-black uppercase tracking-wider text-[11px]">
//                   <Coins size={16} />
//                   <span>Price Increased Materials (High Demand Mix)</span>
//                 </div>
//                 <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
//                   {supplyResults.priceIncreased.map((name, i) => (
//                     <p key={i} className="bg-white/90 p-3 rounded-xl border border-amber-500/5 flex justify-between items-center shadow-sm">
//                       <span>💰 {name}</span>
//                       <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-black">+10% / +15%</span>
//                     </p>
//                   ))}
//                   {supplyResults.priceIncreased.length === 0 && <p className="opacity-40 italic py-4 text-center">No popular demand changes applied to catalog tuples.</p>}
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="text-center py-12 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
//               <p className="text-xs font-bold opacity-40">Supply Chain inventory routines are loaded and ready to dispatch.</p>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//     </motion.div>
//   );
// }  












































































































// עובד פרוצדורה השניה עם החומרים 


// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Footprints, 
//   Users, 
//   MapPin, 
//   PartyPopper, 
//   GraduationCap, 
//   Play, 
//   AlertCircle, 
//   BarChart3,
//   Cpu,
//   RefreshCw,
//   PackageCheck,
//   Coins,
//   Database
// } from 'lucide-react';
// import { useHR } from '../context/HRContext';

// function cn(...inputs: any[]) {
//   return inputs.filter(Boolean).join(' ');
// }

// const StatCard = ({ title, value, icon: Icon, color }: any) => (
//   <div className="bg-white p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-brand-ink/5 relative overflow-hidden">
//     <div className="flex items-center justify-between relative z-10">
//       <div className={cn(
//         "p-3 rounded-2xl",
//         color === 'primary' ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-secondary/10 text-brand-secondary"
//       )}>
//         <Icon size={24} />
//       </div>
//     </div>
//     <div className="relative z-10">
//       <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black mb-1">{title}</p>
//       <p className="text-4xl font-black tracking-tighter italic serif">{value}</p>
//     </div>
//   </div>
// );

// interface RangeBucket {
//   id: string;
//   label: string;
//   events: string[];
// }

// interface Query2Row {
//   rid: number;
//   rname: string;
//   employeecount: string | number;
// }

// interface WorkflowResult {
//   increased: string[];
//   decreased: string[];
//   aboveAvg: string[];
//   belowAvg: string[];
// }

// interface SupplyWorkflowResult {
//   reordered: string[];
//   priceIncreased: string[];
// }

// export default function Welcome() {
//   const { 
//     employee, 
//     branch: branchList, 
//     event: eventList, 
//     guidence, 
//     role: roleList, 
//     participate, 
//     has,         
//     schedule,
//     assignto,
//     rawMaterial: rawMaterialList,
//     includes: includesList,
//     isConnected, 
//     dbMode 
//   } = useHR();

//   // States עבור שאילתא 1 (טווחים)
//   const [isQuery1Running, setIsQuery1Running] = useState(false);
//   const [query1Results, setQuery1Results] = useState<RangeBucket[] | null>(null);
//   const [maxEventsInRange, setMaxEventsInRange] = useState(1);

//   // States עבור שאילתא 2 (מינימום תפקיד)
//   const [isQuery2Running, setIsQuery2Running] = useState(false);
//   const [query2Results, setQuery2Results] = useState<Query2Row[] | null>(null);

//   // States עבור פרוצדורת HR (פרוגרם 1)
//   const [isHRRunning, setIsHRRunning] = useState(false);
//   const [hrResults, setHRResults] = useState<WorkflowResult | null>(null);

//   // States עבור פרוצדורת אספקה (פרוגרם 2)
//   const [isSupplyRunning, setIsSupplyRunning] = useState(false);
//   const [supplyResults, setSupplyResults] = useState<SupplyWorkflowResult | null>(null);

//   // --- הפעלת שאילתא 1 האמיתית מהשרת (חלוקה לטווחים) ---
//   const handleRunQuery1 = async () => {
//     setIsQuery1Running(true);
//     try {
//       const response = await fetch('/api/custom-queries/event-participation');
//       if (!response.ok) throw new Error();
//       const dbRows = await response.json();

//       const ranges = [
//         { id: 'zero', label: '0 Employees', min: 0, max: 0, events: [] as string[] },
//         { id: 'low', label: '1 - 2 Employees', min: 1, max: 2, events: [] as string[] },
//         { id: 'mid', label: '3 - 5 Employees', min: 3, max: 5, events: [] as string[] },
//         { id: 'high', label: '6+ Employees', min: 6, max: 999, events: [] as string[] }
//       ];

//       dbRows.forEach((row: any) => {
//         const count = Number(row.employeecount || row.EmployeeCount || 0);
//         const desc = row.evdescription || row.EVdescription || "Unnamed Event";
//         const target = ranges.find(r => count >= r.min && count <= r.max);
//         if (target) target.events.push(desc);
//       });

//       setMaxEventsInRange(Math.max(...ranges.map(r => r.events.length), 1));
//       setQuery1Results(ranges);
//     } catch (err) {
//       alert("Error executing Event Participation SQL Query.");
//     } finally {
//       setIsQuery1Running(false);
//     }
//   };

//   // --- הפעלת שאילתא 2 האמיתית מהשרת (מינימום תפקיד) ---
//   const handleRunQuery2 = async () => {
//     setIsQuery2Running(true);
//     try {
//       const response = await fetch('/api/custom-queries/minimum-roles');
//       if (!response.ok) throw new Error();
//       const dbRows = await response.json();
      
//       const normalizedRows = dbRows.map((row: any) => ({
//         rid: row.rid || row.Rid,
//         rname: row.rname || row.Rname,
//         employeecount: row.employeecount || row.EmployeeCount || 0
//       }));

//       setQuery2Results(normalizedRows);
//     } catch (err) {
//       alert("Error executing Minimum Roles SQL Query.");
//     } finally {
//       setIsQuery2Running(false);
//     }
//   };

//   // --- הפעלת פרוצדורת משאבי אנוש ושכר (פרוגרם 1) ---
//   const handleRunHRPipeline = async () => {
//     setIsHRRunning(true);
//     try {
//       const response = await fetch('/api/custom-procedures/run-hr-pipeline', { method: 'POST' });
//       if (!response.ok) throw new Error("Server error");

//       const increasedList: string[] = [];
//       const decreasedList: string[] = [];
//       const aboveAvgList: string[] = [];
//       const belowAvgList: string[] = [];

//       (employee || []).forEach(emp => {
//         const empId = emp.eid || emp.Eid;
//         const empName = emp.ename || emp.Ename;
        
//         const trainingCount = (assignto || []).filter((a: any) => (a.eid || a.Eid) === empId).length;
//         const empHasData = (has || []).find((h: any) => (h.eid || h.Eid) === empId);
        
//         const currentSalary = empHasData ? Number(empHasData.hsalary || empHasData.Hsalary || 0) : 8500;
//         const currentRid = empHasData ? (empHasData.rid || empHasData.Rid) : null;

//         const roleSalaries = (has || []).filter((h: any) => (h.rid || h.Rid) === currentRid).map((h: any) => Number(h.hsalary || h.Hsalary || 0));
//         const avgSalary = roleSalaries.length > 0 ? roleSalaries.reduce((a, b) => a + b, 0) / roleSalaries.length : 8000;

//         let finalSalary = currentSalary;
//         if (trainingCount > 3) {
//           finalSalary = Math.round(currentSalary * 1.05);
//           increasedList.push(empName);
//         } else if (trainingCount === 0 && (currentSalary * 0.95) >= 7000) {
//           finalSalary = Math.round(currentSalary * 0.95);
//           decreasedList.push(empName);
//         }

//         if (trainingCount > 3 && (schedule || []).filter((s: any) => (s.eid || s.Eid) === empId).length < 10) {
//           const penalized = Math.round(finalSalary * 0.95);
//           if (penalized >= 7000) {
//             finalSalary = penalized;
//             if (!decreasedList.includes(empName)) decreasedList.push(empName);
//           }
//         }

//         if (finalSalary > avgSalary) aboveAvgList.push(empName);
//         else if (finalSalary < avgSalary) belowAvgList.push(empName);
//       });

//       setHRResults({ increased: increasedList, decreased: decreasedList, aboveAvg: aboveAvgList, belowAvg: belowAvgList });
//     } catch (err) {
//       console.error("Frontend visualization error:", err);
//       alert("Procedure ran successfully in DB, but failed to render graphics.");
//     } finally {
//       setIsHRRunning(false);
//     }
//   };

//   // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) המתוקנת ---
// // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) המשופרת עם סינון מזהים מדויק ---
// // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) המשופרת והמאובטחת ---
// // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) - מקבלת תוצאה מעובדת מהשרת ---
//   const handleRunSupplyPipeline = async () => {
//     setIsSupplyRunning(true);
//     try {
//       const response = await fetch('/api/custom-procedures/run-supply-pipeline', { method: 'POST' });
//       if (!response.ok) throw new Error("Server error");
      
//       const data = await response.json();
      
//       // השרת כבר עשה את כל הסינונים והשמות, פשוט מציגים את זה ישירות בסטייט!
//       setSupplyResults({ 
//         reordered: data.reordered || [], 
//         priceIncreased: data.priceIncreased || [] 
//       });

//     } catch (err) {
//       console.error("Frontend visualization error:", err);
//       alert("Procedure ran successfully in DB, but failed to render graphics.");
//     } finally {
//       setIsSupplyRunning(false);
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-12 text-left relative overflow-hidden"
//     >
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[120px] -z-10" />

//       {/* Header */}
//       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-brand-ink/5">
//         <div className="flex items-center gap-6">
//           <div className="w-20 h-20 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-brand-primary/20 shrink-0">
//             <Footprints size={40} />
//           </div>
//           <div>
//             <h1 className="text-5xl font-black tracking-tighter italic serif text-brand-ink">
//               BestShoes Store
//             </h1>
//           </div>
//         </div>

//         <div className="bg-white px-6 py-4 rounded-2xl border border-brand-ink/5 shadow-sm shrink-0 flex items-center gap-4">
//           <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
//           <div>
//             <p className="text-[8px] uppercase tracking-widest font-black opacity-40">Database Engine</p>
//             <p className="text-xs font-black uppercase tracking-tight text-brand-ink">
//               {isConnected ? `Connected (${dbMode})` : 'Offline'}
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Global Metadata Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Employees" value={employee.length} icon={Users} color="primary" />
//         <StatCard title="Active Branches" value={branchList.length} icon={MapPin} color="secondary" />
//         <StatCard title="Events" value={eventList.length} icon={PartyPopper} color="primary" />
//         <StatCard title="Guidance Seminars" value={guidence.length} icon={GraduationCap} color="secondary" />
//       </div>

//       {/* --- SECTION 1: LIVE RELATIONAL QUERIES --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* QUERY 1: Event Ranges */}
//         <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <BarChart3 size={16} className="text-brand-primary" />
//               <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #3</h3>
//             </div>
//             <h4 className="text-xl font-black italic serif text-brand-ink">Event Participation Ranges</h4>
//           </div>

//           <div className="flex-1 py-2 flex flex-col justify-center">
//             <AnimatePresence mode="wait">
//               {!query1Results ? (
//                 <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
//                   <button 
//                     disabled={isQuery1Running}
//                     onClick={handleRunQuery1} 
//                     className="mx-auto bg-brand-primary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {isQuery1Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
//                     Run PostgreSQL Query
//                   </button>
//                 </div>
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="space-y-4 bg-brand-ink/[0.01] p-4 rounded-2xl border border-brand-ink/5">
//                     {query1Results.map(range => {
//                       const percentage = (range.events.length / maxEventsInRange) * 100;
//                       return (
//                         <div key={range.id} className="space-y-1">
//                           <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
//                             <span className="opacity-50">{range.label}</span>
//                             <span className="text-brand-primary">{range.events.length} Events</span>
//                           </div>
//                           <div className="w-full h-2 bg-brand-ink/5 rounded-full overflow-hidden">
//                             <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percentage}%` }} />
//                           </div>
//                           {range.events.length > 0 && (
//                             <p className="text-[10px] text-brand-ink/60 font-medium pl-2 italic">
//                               Includes: {range.events.join(', ')}
//                             </p>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <button onClick={() => setQuery1Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-primary transition-colors">Clear Buffer</button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* QUERY 2: Minimum Staff */}
//         <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <AlertCircle size={16} className="text-brand-secondary" />
//               <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #8</h3>
//             </div>
//             <h4 className="text-xl font-black italic serif text-brand-ink">Roles With Minimum Staff Assigned</h4>
//           </div>

//           <div className="flex-1 py-2 flex flex-col justify-center">
//             <AnimatePresence mode="wait">
//               {!query2Results ? (
//                 <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
//                   <button 
//                     disabled={isQuery2Running}
//                     onClick={handleRunQuery2} 
//                     className="mx-auto bg-brand-secondary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
//                   >
//                     {isQuery2Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
//                     Run PostgreSQL Query
//                   </button>
//                 </div>
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <div className="divide-y divide-brand-ink/5 border border-brand-ink/5 rounded-2xl overflow-hidden bg-brand-ink/[0.01]">
//                     {query2Results.map((result, index) => (
//                       <div key={index} className="p-4 flex items-center justify-between font-bold">
//                         <p className="text-sm text-brand-ink">{result.rname}</p>
//                         <span className="px-3 py-1.5 rounded-xl bg-brand-secondary/10 text-brand-secondary text-xs font-black uppercase tracking-wider font-mono">
//                           {result.employeecount} Employees
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <button onClick={() => setQuery2Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-secondary transition-colors">Clear Buffer</button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//       </div>

//       {/* --- PIPELINE 1: HR & SALARY PROCEDURES BALANCE --- */}
//       <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
//               <Cpu size={24} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">HR Stored Workflows Balance</h3>
//               <p className="text-xs text-brand-ink/50 mt-0.5">Executes check_shifts_and_adjust_penalties() directly inside PostgreSQL.</p>
//             </div>
//           </div>

//           <button 
//             disabled={isHRRunning}
//             onClick={handleRunHRPipeline}
//             className="px-6 py-4 bg-brand-primary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer disabled:opacity-50"
//           >
//             {isHRRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
//             {isHRRunning ? "Executing in DB..." : "Run HR Routines"}
//           </button>
//         </div>

//         <AnimatePresence mode="wait">
//           {hrResults ? (
//             <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-500/10 space-y-4">
//                 <p className="text-emerald-700 font-black uppercase tracking-wider text-[10px]">Salary Increased</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.increased.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-emerald-500/5">✓ {name}</p>)}
//                   {hrResults.increased.length === 0 && <p className="opacity-40 italic py-2">No records.</p>}
//                 </div>
//               </div>
//               <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-500/10 space-y-4">
//                 <p className="text-rose-700 font-black uppercase tracking-wider text-[10px]">Salary Decreased</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.decreased.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-rose-500/5">⚠️ {name}</p>)}
//                   {hrResults.decreased.length === 0 && <p className="opacity-40 italic py-2">No records.</p>}
//                 </div>
//               </div>
//               <div className="p-6 bg-amber-50/40 rounded-2xl border border-amber-500/10 space-y-4">
//                 <p className="text-amber-700 font-black uppercase tracking-wider text-[10px]">Above Role Average</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.aboveAvg.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-amber-500/5">⬆ {name}</p>)}
//                 </div>
//               </div>
//               <div className="p-6 bg-brand-ink/[0.02] rounded-2xl border border-brand-ink/5 space-y-4">
//                 <p className="text-brand-ink/60 font-black uppercase tracking-wider text-[10px]">Below Role Average</p>
//                 <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
//                   {hrResults.belowAvg.map((name, i) => <p key={i} className="bg-white/80 p-2 rounded-xl border border-brand-ink/5">⬇ {name}</p>)}
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="text-center py-10 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
//               <p className="text-xs font-bold opacity-40">PostgreSQL procedural transaction state is ready to deploy.</p>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* --- PIPELINE 2: SUPPLY CHAIN & STOCK PROCEDURES BALANCE --- */}
//       <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-brand-secondary/10 rounded-2xl text-brand-secondary">
//               <Database size={24} />
//             </div>
//             <div>
//               <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">Supply Chain PL/pgSQL Balance</h3>
//               <p className="text-xs text-brand-ink/50 mt-0.5">Executes increase_material_prices_by_orders_amount() directly inside PostgreSQL.</p>
//             </div>
//           </div>

//           <button 
//             disabled={isSupplyRunning}
//             onClick={handleRunSupplyPipeline}
//             className="px-6 py-4 bg-brand-secondary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-secondary/10 transition-all cursor-pointer disabled:opacity-50"
//           >
//             {isSupplyRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
//             {isSupplyRunning ? "Executing in DB..." : "Run Supply Routines"}
//           </button>
//         </div>

//         <AnimatePresence mode="wait">
//           {supplyResults ? (
//             <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-8 bg-sky-50/60 rounded-3xl border border-sky-500/10 space-y-4">
//                 <div className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-wider text-[11px]">
//                   <PackageCheck size={16} />
//                   <span>Reordered Raw Materials (Stock Restocked +100)</span>
//                 </div>
//                 <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
//                   {supplyResults.reordered.map((name, i) => (
//                     <p key={i} className="bg-white/90 p-3 rounded-xl border border-sky-500/5 flex justify-between items-center shadow-sm">
//                       <span>📦 {name}</span>
//                       <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md uppercase font-black tracking-wider">Trigger Restock</span>
//                     </p>
//                   ))}
//                   {supplyResults.reordered.length === 0 && <p className="opacity-40 italic py-4 text-center">All materials satisfy baseline stock counts (&gt; 50 units).</p>}
//                 </div>
//               </div>

//               <div className="p-8 bg-amber-50/60 rounded-3xl border border-amber-500/10 space-y-4">
//                 <div className="flex items-center gap-2 text-amber-700 font-black uppercase tracking-wider text-[11px]">
//                   <Coins size={16} />
//                   <span>Price Increased Materials (High Demand Mix)</span>
//                 </div>
//                 <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
//                   {supplyResults.priceIncreased.map((name, i) => (
//                     <p key={i} className="bg-white/90 p-3 rounded-xl border border-amber-500/5 flex justify-between items-center shadow-sm">
//                       <span>💰 {name}</span>
//                       <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-black">+10% / +15%</span>
//                     </p>
//                   ))}
//                   {supplyResults.priceIncreased.length === 0 && <p className="opacity-40 italic py-4 text-center">No popular demand changes applied to catalog tuples.</p>}
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="text-center py-12 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
//               <p className="text-xs font-bold opacity-40">Supply Chain inventory routines are loaded and ready to dispatch.</p>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//     </motion.div>
//   );
// }


















































/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, 
  Users, 
  MapPin, 
  PartyPopper, 
  GraduationCap, 
  Play, 
  AlertCircle, 
  BarChart3,
  Cpu,
  RefreshCw,
  PackageCheck,
  Coins,
  Database
} from 'lucide-react';
import { useHR } from '../context/HRContext';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-brand-ink/5 relative overflow-hidden">
    <div className="flex items-center justify-between relative z-10">
      <div className={cn(
        "p-3 rounded-2xl",
        color === 'primary' ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-secondary/10 text-brand-secondary"
      )}>
        <Icon size={24} />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black mb-1">{title}</p>
      <p className="text-4xl font-black tracking-tighter italic serif">{value}</p>
    </div>
  </div>
);

interface RangeBucket {
  id: string;
  label: string;
  events: string[];
}

interface Query2Row {
  rid: number;
  rname: string;
  employeecount: string | number;
}

// ממשק מעודכן לחלוקת הממוצעים הטהורה ב-HR
interface WorkflowResult {
  aboveAvg: string[];
  belowAvg: string[];
  equalAvg: string[]; 
}

interface SupplyWorkflowResult {
  reordered: string[];
  priceIncreased: string[];
}

export default function Welcome() {
  const { 
    employee, 
    branch: branchList, 
    event: eventList, 
    guidence, 
    isConnected, 
    dbMode 
  } = useHR();

  // States עבור שאילתא 1 (טווחים)
  const [isQuery1Running, setIsQuery1Running] = useState(false);
  const [query1Results, setQuery1Results] = useState<RangeBucket[] | null>(null);
  const [maxEventsInRange, setMaxEventsInRange] = useState(1);

  // States עבור שאילתא 2 (מינימום תפקיד)
  const [isQuery2Running, setIsQuery2Running] = useState(false);
  const [query2Results, setQuery2Results] = useState<Query2Row[] | null>(null);

  // States עבור פרוצדורת HR (פרוגרם 1)
  const [isHRRunning, setIsHRRunning] = useState(false);
  const [hrResults, setHRResults] = useState<WorkflowResult | null>(null);

  // States עבור פרוצדורת אספקה (פרוגרם 2)
  const [isSupplyRunning, setIsSupplyRunning] = useState(false);
  const [supplyResults, setSupplyResults] = useState<SupplyWorkflowResult | null>(null);

  // --- הפעלת שאילתא 1 האמיתית מהשרת (חלוקה לטווחים) ---
  const handleRunQuery1 = async () => {
    setIsQuery1Running(true);
    try {
      const response = await fetch('/api/custom-queries/event-participation');
      if (!response.ok) throw new Error();
      const dbRows = await response.json();

      const ranges = [
        { id: 'zero', label: '0 Employees', min: 0, max: 0, events: [] as string[] },
        { id: 'low', label: '1 - 2 Employees', min: 1, max: 2, events: [] as string[] },
        { id: 'mid', label: '3 - 5 Employees', min: 3, max: 5, events: [] as string[] },
        { id: 'high', label: '6+ Employees', min: 6, max: 999, events: [] as string[] }
      ];

      dbRows.forEach((row: any) => {
        const count = Number(row.employeecount || row.EmployeeCount || 0);
        const desc = row.evdescription || row.EVdescription || "Unnamed Event";
        const target = ranges.find(r => count >= r.min && count <= r.max);
        if (target) target.events.push(desc);
      });

      setMaxEventsInRange(Math.max(...ranges.map(r => r.events.length), 1));
      setQuery1Results(ranges);
    } catch (err) {
      alert("Error executing Event Participation SQL Query.");
    } finally {
      setIsQuery1Running(false);
    }
  };

  // --- הפעלת שאילתא 2 האמיתית מהשרת (מינימום תפקיד) ---
  const handleRunQuery2 = async () => {
    setIsQuery2Running(true);
    try {
      const response = await fetch('/api/custom-queries/minimum-roles');
      if (!response.ok) throw new Error();
      const dbRows = await response.json();
      
      const normalizedRows = dbRows.map((row: any) => ({
        rid: row.rid || row.Rid,
        rname: row.rname || row.Rname,
        employeecount: row.employeecount || row.EmployeeCount || 0
      }));

      setQuery2Results(normalizedRows);
    } catch (err) {
      alert("Error executing Minimum Roles SQL Query.");
    } finally {
      setIsQuery2Running(false);
    }
  };

  // --- הפעלת פרוצדורת משאבי אנוש ושכר (פרוגרם 1) - גרסת ממוצעים טהורה ---
  const handleRunHRPipeline = async () => {
    setIsHRRunning(true);
    try {
      const response = await fetch('/api/custom-procedures/run-hr-pipeline', { method: 'POST' });
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      // עדכון הסטייט עם 3 הרשימות המוכנות שהגיעו ישירות מהשרת האמיתי
      setHRResults({ 
        aboveAvg: data.aboveAvg || [], 
        belowAvg: data.belowAvg || [], 
        equalAvg: data.equalAvg || []
      });

    } catch (err) {
      console.error("Frontend visualization error:", err);
      alert("Procedure ran successfully in DB, but failed to render graphics.");
    } finally {
      setIsHRRunning(false);
    }
  };

  // --- הפעלת פרוצדורת שרשרת אספקה ומלאי (פרוגרם 2) - מקבלת תוצאה מעובדת מהשרת ---
  const handleRunSupplyPipeline = async () => {
    setIsSupplyRunning(true);
    try {
      const response = await fetch('/api/custom-procedures/run-supply-pipeline', { method: 'POST' });
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      
      setSupplyResults({ 
        reordered: data.reordered || [], 
        priceIncreased: data.priceIncreased || [] 
      });

    } catch (err) {
      console.error("Frontend visualization error:", err);
      alert("Procedure ran successfully in DB, but failed to render graphics.");
    } finally {
      setIsSupplyRunning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 text-left relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-brand-ink/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-brand-primary/20 shrink-0">
            <Footprints size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter italic serif text-brand-ink">
              BestShoes Store
            </h1>
          </div>
        </div>

        <div className="bg-white px-6 py-4 rounded-2xl border border-brand-ink/5 shadow-sm shrink-0 flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
          <div>
            <p className="text-[8px] uppercase tracking-widest font-black opacity-40">Database Engine</p>
            <p className="text-xs font-black uppercase tracking-tight text-brand-ink">
              {isConnected ? `Connected (${dbMode})` : 'Offline'}
            </p>
          </div>
        </div>
      </header>

      {/* Global Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={employee.length} icon={Users} color="primary" />
        <StatCard title="Active Branches" value={branchList.length} icon={MapPin} color="secondary" />
        <StatCard title="Events" value={eventList.length} icon={PartyPopper} color="primary" />
        <StatCard title="Guidance Seminars" value={guidence.length} icon={GraduationCap} color="secondary" />
      </div>

      {/* --- SECTION 1: LIVE RELATIONAL QUERIES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* QUERY 1: Event Ranges */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-brand-primary" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #3</h3>
            </div>
            <h4 className="text-xl font-black italic serif text-brand-ink">Event Participation Ranges</h4>
          </div>

          <div className="flex-1 py-2 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!query1Results ? (
                <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
                  <button 
                    disabled={isQuery1Running}
                    onClick={handleRunQuery1} 
                    className="mx-auto bg-brand-primary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isQuery1Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                    Run PostgreSQL Query
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="space-y-4 bg-brand-ink/[0.01] p-4 rounded-2xl border border-brand-ink/5">
                    {query1Results.map(range => {
                      const percentage = (range.events.length / maxEventsInRange) * 100;
                      return (
                        <div key={range.id} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                            <span className="opacity-50">{range.label}</span>
                            <span className="text-brand-primary">{range.events.length} Events</span>
                          </div>
                          <div className="w-full h-2 bg-brand-ink/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          {range.events.length > 0 && (
                            <p className="text-[10px] text-brand-ink/60 font-medium pl-2 italic">
                              Includes: {range.events.join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setQuery1Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-primary transition-colors">Clear Buffer</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* QUERY 2: Minimum Staff */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-brand-ink/5 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-brand-secondary" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Live PostgreSQL Query #8</h3>
            </div>
            <h4 className="text-xl font-black italic serif text-brand-ink">Roles With Minimum Staff Assigned</h4>
          </div>

          <div className="flex-1 py-2 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!query2Results ? (
                <div className="text-center py-6 bg-brand-ink/[0.02] rounded-2xl border border-dashed border-brand-ink/10">
                  <button 
                    disabled={isQuery2Running}
                    onClick={handleRunQuery2} 
                    className="mx-auto bg-brand-secondary text-white text-[10px] uppercase font-black tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-ink transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isQuery2Running ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                    Run PostgreSQL Query
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="divide-y divide-brand-ink/5 border border-brand-ink/5 rounded-2xl overflow-hidden bg-brand-ink/[0.01]">
                    {query2Results.map((result, index) => (
                      <div key={index} className="p-4 flex items-center justify-between font-bold">
                        <p className="text-sm text-brand-ink">{result.rname}</p>
                        <span className="px-3 py-1.5 rounded-xl bg-brand-secondary/10 text-brand-secondary text-xs font-black uppercase tracking-wider font-mono">
                          {result.employeecount} Employees
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setQuery2Results(null)} className="text-[9px] uppercase font-black tracking-widest text-brand-ink/40 hover:text-brand-secondary transition-colors">Clear Buffer</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* --- PIPELINE 1: HR & SALARY PROCEDURES BALANCE --- */}
      <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">HR Stored Workflows Balance</h3>
              <p className="text-xs text-brand-ink/50 mt-0.5">Executes check_shifts_and_adjust_penalties() directly inside PostgreSQL.</p>
            </div>
          </div>

          <button 
            disabled={isHRRunning}
            onClick={handleRunHRPipeline}
            className="px-6 py-4 bg-brand-primary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {isHRRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            {isHRRunning ? "Executing in DB..." : "Run HR Routines"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {hrResults ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* ריבוע 1: מתחת לממוצע - צבע אדמדם/ורוד */}
              <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-500/10 space-y-4">
                <p className="text-rose-700 font-black uppercase tracking-wider text-[10px]">Below Role Average</p>
                <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {hrResults.belowAvg.map((name, i) => (
                    <p key={i} className="bg-white/80 p-2 rounded-xl border border-rose-500/5 flex items-center gap-2">
                      <span className="text-rose-500">⬇</span> {name}
                    </p>
                  ))}
                  {hrResults.belowAvg.length === 0 && <p className="opacity-40 italic py-2">No records found.</p>}
                </div>
              </div>

              {/* ריבוע 2: שווה לממוצע - צבע צהוב/ענבר המאוזן והחדש */}
              <div className="p-6 bg-amber-50/40 rounded-2xl border border-amber-500/10 space-y-4">
                <p className="text-amber-700 font-black uppercase tracking-wider text-[10px]">Equal to Role Average</p>
                <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {hrResults.equalAvg.map((name, i) => (
                    <p key={i} className="bg-white/80 p-2 rounded-xl border border-amber-500/5 flex items-center gap-2">
                      <span className="text-amber-500">▬</span> {name}
                    </p>
                  ))}
                  {hrResults.equalAvg.length === 0 && <p className="opacity-40 italic py-2">No records found.</p>}
                </div>
              </div>

              {/* ריבוע 3: מעל לממוצע - צבע ירוק */}
              <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-500/10 space-y-4">
                <p className="text-emerald-700 font-black uppercase tracking-wider text-[10px]">Above Role Average</p>
                <div className="text-xs font-bold text-brand-ink space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {hrResults.aboveAvg.map((name, i) => (
                    <p key={i} className="bg-white/80 p-2 rounded-xl border border-emerald-500/5 flex items-center gap-2">
                      <span className="text-emerald-500">⬆</span> {name}
                    </p>
                  ))}
                  {hrResults.aboveAvg.length === 0 && <p className="opacity-40 italic py-2">No records found.</p>}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="text-center py-10 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
              <p className="text-xs font-bold opacity-40">PostgreSQL procedural transaction state is ready to deploy.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PIPELINE 2: SUPPLY CHAIN & STOCK PROCEDURES BALANCE --- */}
      <div className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-ink/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-secondary/10 rounded-2xl text-brand-secondary">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter italic serif text-brand-ink">Supply Chain PL/pgSQL Balance</h3>
              <p className="text-xs text-brand-ink/50 mt-0.5">Executes increase_material_prices_by_orders_amount() directly inside PostgreSQL.</p>
            </div>
          </div>

          <button 
            disabled={isSupplyRunning}
            onClick={handleRunSupplyPipeline}
            className="px-6 py-4 bg-brand-secondary text-white hover:bg-brand-ink rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-secondary/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSupplyRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            {isSupplyRunning ? "Executing in DB..." : "Run Supply Routines"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {supplyResults ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-sky-50/60 rounded-3xl border border-sky-500/10 space-y-4">
                <div className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-wider text-[11px]">
                  <PackageCheck size={16} />
                  <span>Reordered Raw Materials (Stock Restocked +100)</span>
                </div>
                <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {supplyResults.reordered.map((name, i) => (
                    <p key={i} className="bg-white/90 p-3 rounded-xl border border-sky-500/5 flex justify-between items-center shadow-sm">
                      <span>📦 {name}</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md uppercase font-black tracking-wider">Trigger Restock</span>
                    </p>
                  ))}
                  {supplyResults.reordered.length === 0 && <p className="opacity-40 italic py-4 text-center">All materials satisfy baseline stock counts (&gt; 50 units).</p>}
                </div>
              </div>

              <div className="p-8 bg-amber-50/60 rounded-3xl border border-amber-500/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-700 font-black uppercase tracking-wider text-[11px]">
                  <Coins size={16} />
                  <span>Price Increased Materials (High Demand Mix)</span>
                </div>
                <div className="text-xs font-bold text-brand-ink space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {supplyResults.priceIncreased.map((name, i) => (
                    <p key={i} className="bg-white/90 p-3 rounded-xl border border-amber-500/5 flex justify-between items-center shadow-sm">
                      <span>💰 {name}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-black">+10% / +15%</span>
                    </p>
                  ))}
                  {supplyResults.priceIncreased.length === 0 && <p className="opacity-40 italic py-4 text-center">No popular demand changes applied to catalog tuples.</p>}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-brand-ink/[0.02] rounded-3xl border border-dashed border-brand-ink/10">
              <p className="text-xs font-bold opacity-40">Supply Chain inventory routines are loaded and ready to dispatch.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
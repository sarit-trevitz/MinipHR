
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import {
  Briefcase,
  Users,
  Plus,
  X,
  Check,
  ShieldCheck,
  Award,
  Edit2,
  Trash2,
  Database,
  Search,
  AlertTriangle, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useHR } from "../context/HRContext";
import { role as RoleType } from "../types"; 

export default function RolePage() {
  const {
    role: roleList,
    employee: employeeList,
    has,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useHR();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);

  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const initialFormState = {
    rid: "",
    rname: "",
    rdescription: "",
    rrequirements_json:
      '["Operations Degree", "SQL Knowledge", "Team Leadership"]', // מבנה מערך JSON תקני כברירת מחדל
  };

  const [formData, setFormData] = useState(initialFormState);

  
  const filteredRoles = roleList.filter((r) =>
    r.rname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(r.rid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingRole(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Requirement Fulfilled: Auto-fills input structures on update modals using specific unique key properties
  const handleOpenEdit = (item: RoleType) => {
    setEditingRole(item);
    setFormData({
      rid: String(item.rid),
      rname: item.rname || "",
      rdescription: item.rdescription || "",
      rrequirements_json: item.rrequirements_json
        ? JSON.stringify(item.rrequirements_json, null, 2)
        : "[]",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let parsedJsonRequirements = [];
    try {
      parsedJsonRequirements = JSON.parse(formData.rrequirements_json);
    } catch (err) {
      setAlertMessage("Error: Compliance Requirements field does not contain a valid JSON array structure.");
      setIsAlertOpen(true);
      return;
    }

    const payload = {
      rname: formData.rname,
      rdescription: formData.rdescription,
      rrequirements_json: parsedJsonRequirements,
    };

    if (editingRole) {
      const success = await updateRecord("role", "rid", editingRole.rid, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord("role", {
        rid: formData.rid ? Number(formData.rid) : roleList.length + 1,
        ...payload,
      });
      if (success) setIsModalOpen(false);
    }
  };

 
  const handleDeleteClick = (roleItem: RoleType, employeeCount: number) => {
    if (employeeCount > 0) {
      setAlertMessage("This role cannot be deleted because there are active employees assigned to it.");
      setIsAlertOpen(true);
      return;
    }

    deleteRecord("role", "rid", Number(roleItem.rid));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 text-left"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic serif mb-3">
            Enterprise Roles
          </h2>
          <p className="text-sm opacity-50 max-w-xl font-medium">
            Define, structure, and administer employment definitions, core
            responsibilities, and criteria constraints inside the corporate
            ledger.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
        >
          <Plus size={18} />
          Define New Role Tuple
        </button>
      </header>

  
      <div className="bg-white rounded-2xl border border-brand-ink/5 shadow-sm p-6 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
          <input 
            type="text" 
            placeholder="Search roles by title or key ID..."
            className="w-full pl-10 pr-6 py-3 bg-brand-ink/5 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
          <Database size={12} />
          <span>SCHEMA TABLE: ROLE</span>
        </div>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredRoles.map((roleItem) => {
          const roleEmployeeIds = has
            .filter((h) => h.rid === roleItem.rid)
            .map((h) => h.eid);
          const roleemployeeCount = employeeList.filter((e) =>
            roleEmployeeIds.includes(e.eid),
          ).length;

          let requirements: string[] = ["General Operational Scope"];

          if (roleItem.rrequirements_json) {
            try {
              if (Array.isArray(roleItem.rrequirements_json)) {
                requirements = roleItem.rrequirements_json;
              } else if (typeof roleItem.rrequirements_json === "string") {
                const parsed = JSON.parse(roleItem.rrequirements_json);
                if (Array.isArray(parsed)) {
                  requirements = parsed;
                } else if (parsed && typeof parsed === "object") {
                  requirements = Object.values(parsed).map(String);
                }
              } else if (typeof roleItem.rrequirements_json === "object") {
                requirements = Object.values(roleItem.rrequirements_json).map(String);
              }
            } catch (e) {
              console.error("Failed to parse requirements JSON for role:", roleItem.rid, e);
            }
          }

          return (
            <motion.div
              key={roleItem.rid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] border border-brand-ink/5 shadow-sm hover:shadow-xl hover:shadow-brand-ink/5 transition-all group relative flex flex-col justify-between"
            >
              <div className="absolute top-8 left-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button
                  onClick={() => handleOpenEdit(roleItem)}
                  className="p-2.5 bg-brand-ink/5 hover:bg-brand-ink hover:text-white rounded-xl transition-all text-brand-primary cursor-pointer border border-brand-ink/5 shadow-sm"
                  title="Modify Role Context"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteClick(roleItem, roleemployeeCount)}
                  className="p-2.5 bg-brand-ink/5 hover:bg-brand-secondary hover:text-white rounded-xl transition-all text-brand-secondary cursor-pointer border border-brand-ink/5 shadow-sm"
                  title="Purge Definition Tuple"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary flex items-center justify-center rounded-[1.5rem] group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Briefcase size={32} />
                  </div>
                  <div className="bg-brand-ink/5 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Users size={14} className="opacity-40" />
                    <span className="text-xs font-black text-brand-ink">
                      {roleemployeeCount} Active Personnel
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tighter italic serif text-brand-ink">
                    {roleItem.rname}
                  </h3>
                  <p className="text-[10px] font-mono font-black opacity-30 uppercase tracking-widest">
                    ROLE PRIMARY KEY RID: {roleItem.rid}
                  </p>
                </div>
                <p className="text-sm text-brand-ink/70 leading-relaxed mb-8 mt-4">
                  {roleItem.rdescription}
                </p>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest font-black opacity-30">
                    Core Compliance Requirements (Parsed JSON Array)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-brand-secondary/5 text-brand-secondary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        <ShieldCheck size={12} />
                        {req.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-brand-ink/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                  <Award size={14} />
                  <span>Standardized Enterprise Profile</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-black opacity-30">
                  <Database size={12} />
                  <span>PostgreSQL Catalog Target</span>
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
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 bg-brand-primary text-white flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter italic serif">
                    {editingRole ? "Update Role Schema" : "Declare New Role Schema"}
                  </h3>
                  <p className="text-xs opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingRole ? "Modify Catalog Attributes" : "Inventory Architecture Update"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-6">
                  {!editingRole && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">
                        Role Identification ID (Numeric Primary Key)
                      </label>
                      <input
                        required
                        type="number"
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. 5"
                        value={formData.rid}
                        onChange={(e) =>
                          setFormData({ ...formData, rid: e.target.value })
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">
                      Role Title Header Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all"
                      placeholder="e.g. Plant Production Supervisor"
                      value={formData.rname}
                      onChange={(e) =>
                        setFormData({ ...formData, rname: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">
                      Description Narrative
                    </label>
                    <textarea
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all resize-none h-24"
                      placeholder="Detail task alignments, systemic criteria, and operational scopes..."
                      value={formData.rdescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rdescription: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">
                      Compliance Requirements (JSON Framework Array)
                    </label>
                    <textarea
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold h-24 bg-white"
                      value={formData.rrequirements_json}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rrequirements_json: e.target.value,
                        })
                      }
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
                    className="flex-1 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-ink transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                  >
                    <Check size={18} />
                    {editingRole ? "Sync Definition" : "Commit Structure"}
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
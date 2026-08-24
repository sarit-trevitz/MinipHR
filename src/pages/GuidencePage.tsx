/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, FormEvent } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  User, 
  Calendar, 
  Plus, 
  X,
  Check,
  BookOpen,
  Edit2,
  Trash2,
  Search,
  Hash,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHR } from '../context/HRContext';
import { guidence as GuidenceType } from '../types';
 
export default function GuidencePage() {
  const { guidence: guidenceList, employee, assignTo, createRecord, updateRecord, deleteRecord } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GuidenceType | null>(null);
  const [editingguidence, setEditingguidence] = useState<GuidenceType | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
 
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const initialFormState = {
    gid: '',
    glocation: '',
    gdate: new Date().toISOString().split('T')[0],
    ginstructor: '',
    gdescription_json: '["Database Tuning", "Index Optimization", "Docker Deployment"]'
  };
 
  const [formData, setFormData] = useState(initialFormState);
 
  const handleOpenAdd = () => {
    setEditingguidence(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };
 
  const handleOpenEdit = (session: GuidenceType) => {
    setEditingguidence(session);
 
    let formattedDate = '';
    if (session.gdate) {
      const d = new Date(session.gdate);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
    }
 
    setFormData({
      gid: String(session.gid),
      glocation: session.glocation || '',
      gdate: formattedDate,
      ginstructor: session.ginstructor || '',
      gdescription_json: session.gdescription_json ? JSON.stringify(session.gdescription_json, null, 2) : '[]'
    });
    setIsModalOpen(true);
  };
 
  const handleDeleteClick = (session: GuidenceType, currentGid: any) => {
    const hasAttendees = assignTo.some(at => {
      const atGid = at.gid !== undefined ? at.gid : (at as any).Gid;
      return Number(atGid) === Number(currentGid);
    });
 
    if (hasAttendees) {
      setAlertMessage("This seminar cannot be deleted because there are enrolled employees assigned to it.");
      setIsAlertOpen(true);
      return;
    }
 
    deleteRecord('guidence', 'gid', currentGid);
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    let parsedJsonSpecs = [];
    try {
      parsedJsonSpecs = JSON.parse(formData.gdescription_json);
    } catch (err) {
      alert("Error: The Syllabus Topics field does not contain a valid JSON/array structure. Enter a structure such as: [\"Topic1\", \"Topic2\"]");
      return;
    }
 
    const payload = {
      glocation: formData.glocation,
      gdate: formData.gdate ? new Date(formData.gdate) : new Date(),
      ginstructor: formData.ginstructor,
      gdescription_json: parsedJsonSpecs
    };
 
    if (editingguidence) {
      const success = await updateRecord('guidence', 'gid', editingguidence.gid, payload);
      if (success) setIsModalOpen(false);
    } else {
      const success = await createRecord('guidence', {
        gid: formData.gid ? Number(formData.gid) : guidenceList.length + 1,
        ...payload
      });
      if (success) setIsModalOpen(false);
    }
  };
 
  const formatDisplayDate = (dateInput: any): string => {
    if (!dateInput) return 'Unscheduled';
    const d = new Date(dateInput);
    return !isNaN(d.getTime()) ? d.toLocaleDateString('he-IL') : 'Unscheduled';
  };
 
  const filteredSeminars = guidenceList.filter(session => {
    if (searchQuery.trim() === '') return true;
    
    const gid = String(session.gid || (session as any).Gid || '');
    const instructor = String(session.ginstructor || (session as any).Ginstructor || '').toLowerCase();
    const query = searchQuery.trim().toLowerCase();
 
    return gid.includes(query) || instructor.includes(query);
  });
 
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-brand-ink/5">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic serif mb-2">Training Seminars & Guidance</h2>
          <p className="text-xs opacity-50 max-w-xl font-medium">
            Plan, monitor, and record technical curriculum certifications, knowledge transfer modules, and instructional assignments.
          </p>
        </div>
 
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-4 opacity-40 text-brand-ink pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by GID or Instructor..."
              className="pl-10 pr-4 py-3 bg-white border border-brand-ink/10 rounded-2xl text-xs font-mono font-bold w-full sm:w-[230px] focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all shadow-sm placeholder:font-sans placeholder:font-normal placeholder:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 hover:bg-brand-ink/5 rounded-md opacity-40 hover:opacity-100 transition-all cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
 
          <button 
            onClick={handleOpenAdd}
            className="bg-brand-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-brand-ink transition-all shadow-lg shadow-brand-secondary/20 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            Create Seminar Session
          </button>
        </div>
      </header>
 
      {searchQuery && (
        <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary bg-brand-secondary/5 px-5 py-3 rounded-2xl border border-brand-secondary/10">
          <Search size={14} />
          <span>Active matrix constraint. Displaying results for query parameter: <strong>"{searchQuery}"</strong></span>
        </div>
      )}
 
      <div className="grid grid-cols-1 gap-10">
        {filteredSeminars.length > 0 ? (
          filteredSeminars.map((session) => {
            const currentGid = session.gid || (session as any).Gid;
            const currentInstructor = session.ginstructor || (session as any).Ginstructor || 'Unassigned Instructor';
            const currentLocation = session.glocation || (session as any).Glocation || 'N/A';
            const currentDate = session.gdate || (session as any).Gdate;
            const currentDescription = session.gdescription_json || (session as any).Gdescription_json;
 
            const attendees = assignTo.filter(at => {
              const atGid = at.gid !== undefined ? at.gid : (at as any).Gid;
              return Number(atGid) === Number(currentGid);
            });
            
            let topics: string[] = ['General Curriculum'];
            if (currentDescription) {
              try {
                if (Array.isArray(currentDescription)) {
                  topics = currentDescription;
                } else if (typeof currentDescription === 'string') {
                  const parsed = JSON.parse(currentDescription);
                  if (Array.isArray(parsed)) topics = parsed;
                }
              } catch (e) {
                if (typeof currentDescription === 'string') {
                  topics = currentDescription.split(',');
                }
              }
            }
 
            return (
              <motion.div 
                key={currentGid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] border border-brand-ink/5 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:shadow-brand-ink/5 transition-all group relative"
              >
                <div className="absolute top-8 right-8 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleOpenEdit(session)}
                    className="p-2.5 bg-white/20 hover:bg-brand-primary text-white backdrop-blur-md rounded-xl transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
                    title="Modify Curriculum Attributes"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(session, currentGid)}
                    className="p-2.5 bg-white/20 hover:bg-brand-secondary text-white backdrop-blur-md rounded-xl transition-all cursor-pointer border border-brand-ink/5 shadow-sm"
                    title="Purge Seminar Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
 
                <div className="md:w-80 bg-brand-ink p-12 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary opacity-10 rounded-full -mr-16 -mt-16 blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                      <GraduationCap size={32} />
                    </div>
                    <p className="text-[10px] font-mono font-black opacity-40 uppercase tracking-widest mb-2">PRIMARY KEY GID: {currentGid}</p>
                    <h3 className="text-2xl font-black tracking-tighter italic serif leading-tight">Relational Seminar Block</h3>
                  </div>
 
                  <div className="relative z-10 mt-12 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-widest text-brand-secondary">
                      <Calendar size={14} />
                      <span>{formatDisplayDate(currentDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                      <MapPin size={14} />
                      <span>Location: {currentLocation}</span>
                    </div>
                  </div>
                </div>
 
                <div className="flex-1 p-12 flex flex-col gap-10 justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Curriculum Syllabus Topics (Parsed JSON Array)</p>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic, i) => (
                          <span key={i} className="px-4 py-2 bg-brand-secondary/5 text-brand-secondary rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Lead Supervisor Instructor</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-ink/5 flex items-center justify-center text-brand-ink">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-brand-ink">{currentInstructor}</p>
                          <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Certified Expert Consultant</p>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="pt-8 border-t border-brand-ink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-3">
                        {attendees.slice(0, 5).map(relationKey => {
                          const relationEid = relationKey.eid !== undefined ? relationKey.eid : (relationKey as any).Eid;
                          const personnelObj = employee.find(e => Number(e.eid || (e as any).Eid) === Number(relationEid));
                          return (
                            <div 
                              key={relationEid} 
                              className="w-12 h-12 rounded-2xl bg-brand-ink border-4 border-white flex items-center justify-center text-xs text-white font-black italic serif shadow-sm" 
                              title={personnelObj ? `${personnelObj.ename || (personnelObj as any).Ename} (ID: ${relationEid})` : `Staff ID: ${relationEid}`}
                            >
                              {personnelObj ? (personnelObj.ename || (personnelObj as any).Ename || 'E').charAt(0) : 'E'}
                            </div>
                          );
                        })}
                        {attendees.length > 5 && (
                          <div className="w-12 h-12 rounded-2xl bg-brand-ink/5 border-4 border-white flex items-center justify-center text-[10px] font-black font-mono shadow-sm">
                            +{attendees.length - 5}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-black tracking-tighter text-brand-ink">{attendees.length} Registered Attendees</p>
                        <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Relational Log Enrollment (ASSIGN_TO JOIN)</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSession(session);
                        setIsManageOpen(true);
                      }}
                      className="flex items-center gap-3 bg-brand-ink text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-brand-ink/10 cursor-pointer font-sans"
                    >
                      <Check size={14} />
                      Manage Structural Allocation
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 rounded-[2.5rem] p-16 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-secondary">
              <X size={24} />
            </div>
            <p className="text-sm font-black italic serif text-brand-ink">No seminar sessions matched the query</p>
            <p className="text-[11px] opacity-40 font-medium mt-1">Refine your search tokens for GID or Instructor fields.</p>
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
                    {editingguidence ? 'Modify Seminar Properties' : 'Initialize New Seminar'}
                  </h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black mt-1">
                    {editingguidence ? 'Relational Data Commit' : 'Knowledge Inventory Addition'}
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
                  {!editingguidence && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Seminar ID (Numeric Primary Key)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. 8"
                        value={formData.gid}
                        onChange={e => setFormData({...formData, gid: e.target.value})}
                      />
                    </div>
                  )}
 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Target Date</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        value={formData.gdate}
                        onChange={e => setFormData({...formData, gdate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Physical Room Location</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                        placeholder="e.g. Laboratory 3"
                        value={formData.glocation}
                        onChange={e => setFormData({...formData, glocation: e.target.value})}
                      />
                    </div>
                  </div>
 
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Lead Instructor Supervisor Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-secondary transition-all"
                      placeholder="e.g. Dr. Robert Vance"
                      value={formData.ginstructor}
                      onChange={e => setFormData({...formData, ginstructor: e.target.value})}
                    />
                  </div>
 
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Syllabus Topics (JSON String Array Framework)</label>
                    <textarea 
                      required
                      className="w-full px-6 py-4 bg-brand-ink/5 border-none rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-brand-secondary transition-all resize-none h-24"
                      value={formData.gdescription_json}
                      onChange={e => setFormData({...formData, gdescription_json: e.target.value})}
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
                    {editingguidence ? 'Sync Seminar Tuple' : 'Commit Subprogram'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Manage Modal */}
      <AnimatePresence>
        {isManageOpen && selectedSession && (
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
              className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 bg-brand-ink text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter italic serif">
                    Seminar Grid: {selectedSession.ginstructor || (selectedSession as any).Ginstructor || 'Unassigned'}
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
 
              <div className="p-8 space-y-4 overflow-y-auto flex-1 text-left no-scrollbar">
                <div className="flex items-center gap-1.5 px-1">
                  <Hash size={12} className="text-brand-primary opacity-60" />
                  <span className="text-[10px] uppercase font-black tracking-wider opacity-40 font-mono">Catalog Reference Key GID: {selectedSession.gid}</span>
                </div>
 
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-1">Enrolled Employee Tuples via FK Mapping (ID-to-Name Mapping)</h4>
                  <div className="space-y-2 rounded-xl pr-1">
                    {assignTo.filter(at => Number(at.gid !== undefined ? at.gid : (at as any).Gid) === Number(selectedSession.gid)).length === 0 ? (
                      <p className="text-xs opacity-40 font-bold p-6 text-center border border-dashed border-brand-ink/10 rounded-2xl bg-brand-ink/[0.01]">
                        No structural employee profiles are registered into this seminar transaction block.
                      </p>
                    ) : (
                      assignTo.filter(at => Number(at.gid !== undefined ? at.gid : (at as any).Gid) === Number(selectedSession.gid)).map((relation, idx) => {
                        const relationEid = relation.eid !== undefined ? relation.eid : (relation as any).Eid;
                        const connectedStaff = employee.find(e => Number(e.eid || (e as any).Eid) === Number(relationEid));
                        const staffName = connectedStaff ? (connectedStaff.ename || (connectedStaff as any).Ename) : 'Unknown Staff Member';
 
                        return (
                          <div key={idx} className="flex items-center justify-between p-4 bg-brand-ink/5 border border-brand-ink/5 rounded-xl font-mono shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary font-bold text-xs font-sans">
                                {staffName.charAt(0)}
                              </div>
                              <span className="text-xs font-bold font-sans text-brand-ink">
                                {staffName}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 text-brand-secondary">FOREIGN KEY EID: {relationEid}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
 
              <div className="p-8 pt-0 shrink-0 bg-white">
                <button 
                  onClick={() => setIsManageOpen(false)}
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer hover:bg-brand-secondary transition-colors"
                >
                  Dismiss Management Matrix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
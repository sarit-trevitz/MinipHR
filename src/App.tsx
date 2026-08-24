/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HRProvider } from './context/HRContext';
import Welcome from './pages/Welcome';
import EmployeePage from './pages/EmployeePage';
import RolePage from './pages/RolePage';
import BranchPage from './pages/BranchPage';
import ShiftPage from './pages/ShiftPage';
import EventPage from './pages/EventPage';
import GuidencePage from './pages/GuidencePage';
import DepartmentPage from './pages/DepartmentPage';
import ProductLinePage from './pages/ProductLinePage';
import ProductPage from './pages/ProductPage';
import DesignPage from './pages/DesignPage';
import RawMaterialPage from './pages/RawMaterialPage';
import SupplierPage from './pages/SupplierPage';
import SupplyOrderPage from './pages/SupplyOrderPage';

import { 
  LayoutDashboard, Package, Database, Activity, Users, 
  Briefcase, MapPin, Clock, Calendar, GraduationCap, Building2, 
  GitFork, Layers, ShieldCheck, Truck, ShoppingCart
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const sections = [
    {
      title: "Core System",
      items: [
        { path: '/', label: 'Welcome', icon: LayoutDashboard },
      ]
    },
    {
      title: "Human Resources",
      items: [
        { path: '/employee', label: 'Employees', icon: Users },
        { path: '/role', label: 'Roles', icon: Briefcase },
        { path: '/branch', label: 'Branches', icon: MapPin },
        { path: '/shift', label: 'Shifts', icon: Clock },
      ]
    },
    {
      title: "Events & Training",
      items: [
        { path: '/event', label: 'Events', icon: Calendar },
        { path: '/guidence', label: 'Guidance', icon: GraduationCap },
      ]
    },
    {
      title: "Manufacturing",
      items: [
        { path: '/department', label: 'Departments', icon: Building2 },
        { path: '/product-lines', label: 'Product Lines', icon: GitFork },
        { path: '/product', label: 'Products', icon: Package },
        { path: '/design', label: 'Designs', icon: Layers },
      ]
    },
    {
      title: "Supply Chain",
      items: [
        { path: '/raw-materials', label: 'Raw Materials', icon: ShieldCheck },
        { path: '/supplier', label: 'Suppliers', icon: Truck },
        { path: '/supply-orders', label: 'Supply Orders', icon: ShoppingCart },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-brand-ink/5 flex flex-col justify-between p-4 h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2 py-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-primary/20">
            <Activity size={18} />
          </div>
          <div>
            <h1 className="font-black tracking-tighter text-sm uppercase">BEST SHOES</h1>
          </div>
        </Link>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-brand-ink/30 px-3">{section.title}</h3>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10' 
                          : 'text-brand-ink/60 hover:bg-brand-ink/5 hover:text-brand-ink'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'opacity-100' : 'opacity-50'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-ink/5 rounded-xl p-3 mt-4 flex items-center gap-2">
        <Database size={14} className="text-brand-primary opacity-60" />
        <div>
          <p className="text-[8px] font-black uppercase tracking-wider opacity-40">PostgreSQL Status</p>
          <p className="text-[9px] font-bold text-emerald-600">19 Relations Online</p>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <HRProvider>
      <Router>
        <div className="min-h-screen bg-brand-ink/[0.01] text-brand-ink font-sans antialiased flex">
          
          <Sidebar />
          
          <main className="flex-1 p-8 max-w-7xl overflow-y-auto h-screen">
            <Routes>
              {/*Routes for the core system */}
              <Route path="/" element={<Welcome />} />
              
              {/*Routes for management */}
              <Route path="/employee" element={<EmployeePage />} />
              <Route path="/role" element={<RolePage />} />
              <Route path="/branch" element={<BranchPage />} />
              <Route path="/shift" element={<ShiftPage />} />
              
              {/*Routes for events and guidance */}
              <Route path="/event" element={<EventPage />} />
              <Route path="/guidence" element={<GuidencePage />} />
              
              {/*Routes for production lines and departments */}
              <Route path="/department" element={<DepartmentPage />} />
              <Route path="/product-lines" element={<ProductLinePage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/design" element={<DesignPage />} />
              
              {/*Routes for supply chain and materials */}
              <Route path="/raw-materials" element={<RawMaterialPage />} />
              <Route path="/supplier" element={<SupplierPage />} />
              <Route path="/supply-orders" element={<SupplyOrderPage />} />
            </Routes>
          </main>

        </div>
      </Router>
    </HRProvider>
  );
}
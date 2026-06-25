import { useState } from "react";
import { DataProvider } from "./context/DataContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import ProgramDashboard from "./components/dashboard/ProgramDashboard";
import L2BomAnalysis from "./components/dashboard/L2BomAnalysis";
import VarianceWaterfall from "./components/dashboard/VarianceWaterfall";
import ShouldCostCalculator from "./components/shouldCost/ShouldCostCalculator";
import AdminPage from "./components/admin/AdminPage";

export interface AppUser {
  name: string;
  initials: string;
  email?: string;
}

const DEMO_USERS: AppUser[] = [
  { name: "Kevin Fang", initials: "KF", email: "kfang@lenovo.com" },
  { name: "Tim Chen", initials: "TC", email: "tchen@lenovo.com" },
  { name: "Joonil Kim", initials: "JK", email: "jkim@lenovo.com" },
  { name: "Glen Huang", initials: "GH", email: "ghuang@lenovo.com" },
  { name: "Grant Peng", initials: "GP", email: "gpeng@lenovo.com" },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState("program");
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser>(DEMO_USERS[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        users={DEMO_USERS}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className={`pt-14 transition-all duration-200 min-h-screen relative z-0 ${
          collapsed ? "ml-16" : "ml-[240px]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto p-6 relative z-0">
          {activeTab === "program" && <ProgramDashboard />}
          {activeTab === "bom" && <L2BomAnalysis />}
          {activeTab === "waterfall" && <VarianceWaterfall />}
          {activeTab === "shouldcost" && <ShouldCostCalculator />}
          {activeTab === "admin" && <AdminPage currentUser={currentUser} />}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}

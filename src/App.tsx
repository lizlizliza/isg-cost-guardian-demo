import { useMemo, useState } from "react";
import type { Program } from "./types";
import { PROGRAMS, getProgramById } from "./data/sampleData";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import ProgramDashboard from "./components/dashboard/ProgramDashboard";
import L2BomAnalysis from "./components/dashboard/L2BomAnalysis";
import VarianceWaterfall from "./components/dashboard/VarianceWaterfall";
import ShouldCostCalculator from "./components/shouldCost/ShouldCostCalculator";

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

export default function App() {
  const [activeTab, setActiveTab] = useState("program");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState("sr650v4");
  const [currentUser, setCurrentUser] = useState<AppUser>(DEMO_USERS[0]);

  const program: Program | undefined = useMemo(
    () => getProgramById(selectedProgramId),
    [selectedProgramId]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedProgram={program}
        programs={PROGRAMS}
        onProgramChange={setSelectedProgramId}
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
        className={`pt-14 transition-all duration-200 min-h-screen ${
          collapsed ? "ml-16" : "ml-[260px]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto p-6">
          {activeTab === "program" && program && <ProgramDashboard program={program} />}
          {activeTab === "bom" && program && <L2BomAnalysis program={program} />}
          {activeTab === "waterfall" && program && <VarianceWaterfall program={program} />}
          {activeTab === "shouldcost" && <ShouldCostCalculator />}
          <Footer />
        </div>
      </main>
    </div>
  );
}

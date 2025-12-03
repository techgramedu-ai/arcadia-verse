import { GraduationCap, Globe, BookOpen, Briefcase, Building2, Stethoscope, Calculator, Code, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: string;
  color: string;
  region: "india" | "global";
}

const examCategories: ExamCategory[] = [
  // Indian Exams
  { id: "jee", name: "JEE Main/Adv", icon: <Calculator size={18} />, count: "2.5M", color: "from-cosmic-cyan to-cosmic-blue", region: "india" },
  { id: "neet", name: "NEET UG/PG", icon: <Stethoscope size={18} />, count: "2.1M", color: "from-cosmic-magenta to-cosmic-pink", region: "india" },
  { id: "upsc", name: "UPSC CSE", icon: <Building2 size={18} />, count: "1.2M", color: "from-cosmic-violet to-cosmic-magenta", region: "india" },
  { id: "cat", name: "CAT/MBA", icon: <Briefcase size={18} />, count: "800K", color: "from-cosmic-gold to-cosmic-pink", region: "india" },
  { id: "gate", name: "GATE", icon: <Code size={18} />, count: "900K", color: "from-cosmic-green to-cosmic-cyan", region: "india" },
  { id: "ssc", name: "SSC/Bank", icon: <Building2 size={18} />, count: "3M", color: "from-cosmic-blue to-cosmic-violet", region: "india" },
  // Global Exams
  { id: "gre", name: "GRE", icon: <Plane size={18} />, count: "400K", color: "from-cosmic-cyan to-cosmic-green", region: "global" },
  { id: "gmat", name: "GMAT", icon: <Globe size={18} />, count: "250K", color: "from-cosmic-pink to-cosmic-gold", region: "global" },
  { id: "ielts", name: "IELTS/TOEFL", icon: <BookOpen size={18} />, count: "1.5M", color: "from-cosmic-violet to-cosmic-blue", region: "global" },
  { id: "sat", name: "SAT/ACT", icon: <GraduationCap size={18} />, count: "500K", color: "from-cosmic-magenta to-cosmic-violet", region: "global" },
];

export const ExamCategories = () => {
  const indianExams = examCategories.filter(e => e.region === "india");
  const globalExams = examCategories.filter(e => e.region === "global");

  return (
    <div className="space-y-4">
      {/* Indian Exams */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cosmic-gold to-cosmic-pink flex items-center justify-center">
            <span className="text-[10px]">🇮🇳</span>
          </div>
          <h3 className="font-display text-sm font-semibold text-foreground">Indian Exams</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {indianExams.map(exam => (
            <button
              key={exam.id}
              className={cn(
                "p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group text-left",
                "hover:shadow-glow-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  exam.color
                )}>
                  <span className="text-primary-foreground">{exam.icon}</span>
                </div>
              </div>
              <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                {exam.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{exam.count} aspirants</p>
            </button>
          ))}
        </div>
      </div>

      {/* Global Exams */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cosmic-cyan to-cosmic-blue flex items-center justify-center">
            <Globe size={12} className="text-primary-foreground" />
          </div>
          <h3 className="font-display text-sm font-semibold text-foreground">Global Exams</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {globalExams.map(exam => (
            <button
              key={exam.id}
              className={cn(
                "p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group text-left",
                "hover:shadow-glow-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  exam.color
                )}>
                  <span className="text-primary-foreground">{exam.icon}</span>
                </div>
              </div>
              <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                {exam.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{exam.count} aspirants</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

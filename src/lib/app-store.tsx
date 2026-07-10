import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "farmer" | "consumer" | "enterprise";

export interface OnboardingAnswers {
  [questionId: string]: string;
}

interface AppState {
  role: Role | null;
  setRole: (r: Role | null) => void;
  answers: Partial<Record<Role, OnboardingAnswers>>;
  saveAnswers: (role: Role, a: OnboardingAnswers) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (v: boolean) => void;
  hydrated: boolean;
}

const Ctx = createContext<AppState>({
  role: null,
  setRole: () => {},
  answers: {},
  saveAnswers: () => {},
  onboardingOpen: false,
  setOnboardingOpen: () => {},
  hydrated: false,
});

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<Role, OnboardingAnswers>>>({});
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem("qhatu-role") as Role | null;
      const a = localStorage.getItem("qhatu-answers");
      if (r === "farmer" || r === "consumer" || r === "enterprise") setRoleState(r);
      if (a) setAnswers(JSON.parse(a));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setRole = (r: Role | null) => {
    setRoleState(r);
    if (r) {
      localStorage.setItem("qhatu-role", r);
      // open onboarding if this role hasn't answered yet
      const saved = localStorage.getItem("qhatu-answers");
      const parsed = saved ? (JSON.parse(saved) as Partial<Record<Role, OnboardingAnswers>>) : {};
      if (!parsed[r]) setOnboardingOpen(true);
    } else {
      localStorage.removeItem("qhatu-role");
    }
  };

  const saveAnswers = (r: Role, a: OnboardingAnswers) => {
    setAnswers((prev) => {
      const next = { ...prev, [r]: a };
      localStorage.setItem("qhatu-answers", JSON.stringify(next));
      return next;
    });
  };

  return (
    <Ctx.Provider
      value={{ role, setRole, answers, saveAnswers, onboardingOpen, setOnboardingOpen, hydrated }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAppState = () => useContext(Ctx);
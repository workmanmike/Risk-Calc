import { AlertTriangle, BarChart3, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  calculateRisk,
  ContractorInput,
  GatewayStatus,
  InsuranceVarianceFlexibility,
  regions,
  RiskTier,
  scopeCategories,
  weights
} from "./riskModel";

const insuranceVarianceFlexibilityOptions: InsuranceVarianceFlexibility[] = [
  "No Variance Allowed",
  "Client Approval Required",
  "Flexible"
];

const samples: Record<RiskTier, ContractorInput> = {
  Low: {
    contractorName: "Summit Office Consulting",
    scopeCategory: "Prof. Services",
    monthlyRevenue: 18000,
    crewCount: 2,
    region: "GL/GP",
    emr: 0.48,
    trir: 0.4,
    oshaCitations: 0,
    fatalities: 0,
    hasSafetyProgram: true,
    hasSafetyManager: true,
    yearsInBusiness: 12,
    insuranceVarianceRequested: false,
    insuranceVarianceFlexibility: "Flexible"
  },
  Moderate: {
    contractorName: "Brightline Fence & Civil",
    scopeCategory: "Civil",
    monthlyRevenue: 85000,
    crewCount: 5,
    region: "Mountain",
    emr: 0.94,
    trir: 1.6,
    oshaCitations: 1,
    fatalities: 0,
    hasSafetyProgram: true,
    hasSafetyManager: false,
    yearsInBusiness: 5,
    insuranceVarianceRequested: true,
    insuranceVarianceFlexibility: "Client Approval Required"
  },
  High: {
    contractorName: "Pacific Electrical Fieldworks",
    scopeCategory: "Electrical",
    monthlyRevenue: 300000,
    crewCount: 16,
    region: "SoCal",
    emr: 1.32,
    trir: 3.7,
    oshaCitations: 2,
    fatalities: 0,
    hasSafetyProgram: false,
    hasSafetyManager: true,
    yearsInBusiness: 2,
    insuranceVarianceRequested: true,
    insuranceVarianceFlexibility: "Flexible"
  },
  Critical: {
    contractorName: "Atlas Tower Construction",
    scopeCategory: "Tower Construction",
    monthlyRevenue: 620000,
    crewCount: 34,
    region: "National",
    emr: 1.78,
    trir: 6.2,
    oshaCitations: 4,
    fatalities: 1,
    hasSafetyProgram: false,
    hasSafetyManager: false,
    yearsInBusiness: 1,
    insuranceVarianceRequested: true,
    insuranceVarianceFlexibility: "No Variance Allowed"
  }
};

const sampleNotes: Record<RiskTier, string> = {
  Low: "Established professional services partner with clean safety history.",
  Moderate: "Review safety manager coverage before onboarding.",
  High: "Confirm corrective actions and document exception rationale.",
  Critical: "Escalate for executive review before any award or mobilization."
};

const tierStyles: Record<RiskTier, string> = {
  Low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  High: "bg-orange-50 text-orange-800 ring-orange-200",
  Critical: "bg-red-50 text-red-800 ring-red-200"
};

const gatewayStyles: Record<GatewayStatus, string> = {
  Pass: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Review: "bg-amber-50 text-amber-800 ring-amber-200",
  Blocked: "bg-red-50 text-red-800 ring-red-200"
};

const componentLabels: Record<keyof ReturnType<typeof calculateRisk>["componentScores"], string> = {
  scope: "Scope",
  region: "Region",
  revenue: "Monthly Revenue",
  crew: "Crew Count",
  emr: "EMR",
  trir: "TRIR",
  osha: "OSHA Citations",
  fatality: "Fatalities",
  maturity: "Maturity"
};

type FieldKey = keyof ContractorInput;
type NumberFieldKey = {
  [K in keyof ContractorInput]: ContractorInput[K] extends number ? K : never;
}[keyof ContractorInput];

function App() {
  const [form, setForm] = useState<ContractorInput>(samples.Moderate);
  const [notes, setNotes] = useState(sampleNotes.Moderate);
  const result = useMemo(() => calculateRisk(form), [form]);

  const loadSample = (tier: RiskTier) => {
    setForm(samples[tier]);
    setNotes(sampleNotes[tier]);
  };

  const updateField = <K extends FieldKey>(field: K, value: ContractorInput[K]) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updateNumberField = (field: NumberFieldKey, value: string) => {
    updateField(field, Math.max(0, Number(value) || 0));
  };

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              Subcontractor onboarding
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Risk model workbench
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {(Object.keys(samples) as RiskTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => loadSample(tier)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-500 hover:text-slate-950"
              >
                {tier} sample
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(320px,0.88fr)_minmax(440px,1.12fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-executive">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <Building2 className="h-5 w-5 text-slate-700" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Contractor Profile</h2>
          </div>

          <form className="mt-5 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">Contractor Name</span>
              <input
                value={form.contractorName}
                onChange={(event) => updateField("contractorName", event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Scope Category"
                value={form.scopeCategory}
                options={scopeCategories}
                onChange={(value) => updateField("scopeCategory", value)}
              />
              <SelectField
                label="Region"
                value={form.region}
                options={regions}
                onChange={(value) => updateField("region", value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Monthly Revenue"
                value={form.monthlyRevenue}
                prefix="$"
                onChange={(value) => updateNumberField("monthlyRevenue", value)}
              />
              <NumberField
                label="Crew Count"
                value={form.crewCount}
                onChange={(value) => updateNumberField("crewCount", value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="EMR" value={form.emr} step="0.01" onChange={(value) => updateNumberField("emr", value)} />
              <NumberField label="TRIR" value={form.trir} step="0.01" onChange={(value) => updateNumberField("trir", value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="OSHA Citations"
                value={form.oshaCitations}
                onChange={(value) => updateNumberField("oshaCitations", value)}
              />
              <NumberField
                label="Fatalities"
                value={form.fatalities}
                onChange={(value) => updateNumberField("fatalities", value)}
              />
              <NumberField
                label="Years in Business"
                value={form.yearsInBusiness}
                onChange={(value) => updateNumberField("yearsInBusiness", value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleField
                label="Safety Program"
                checked={form.hasSafetyProgram}
                onChange={(value) => updateField("hasSafetyProgram", value)}
              />
              <ToggleField
                label="Safety Manager"
                checked={form.hasSafetyManager}
                onChange={(value) => updateField("hasSafetyManager", value)}
              />
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <div className="mb-3 text-sm font-semibold text-slate-800">Contractual Gateway</div>
              <div className="grid gap-4">
                <ToggleField
                  label="Insurance Variance Requested"
                  checked={form.insuranceVarianceRequested}
                  onChange={(value) => updateField("insuranceVarianceRequested", value)}
                />
                <SelectField
                  label="Client Insurance Flexibility"
                  value={form.insuranceVarianceFlexibility}
                  options={insuranceVarianceFlexibilityOptions}
                  onChange={(value) => updateField("insuranceVarianceFlexibility", value)}
                />
              </div>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                className="resize-y rounded-md border border-slate-300 px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                placeholder="Add onboarding notes, follow-ups, exception rationale, or review context."
              />
            </label>
          </form>
        </section>

        <section className="grid gap-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-executive">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Live Risk Output</p>
                <h2 className="mt-1 text-2xl font-semibold">{form.contractorName || "Unnamed Contractor"}</h2>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ring-1 ${tierStyles[result.tier]}`}>
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {result.tier}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-md bg-slate-950 p-6 text-white sm:min-h-48">
                <p className="text-sm font-medium text-slate-300">Final Risk Score</p>
                <div className="mt-4 flex flex-wrap items-end gap-x-2 gap-y-1">
                  <span className="text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">{result.finalScore}</span>
                  <span className="pb-2 text-lg text-slate-300">/ 100</span>
                </div>
              </div>

              <div className="grid gap-3">
                <RequirementRow label="Insurance Requirement" value={result.requirements.insuranceRequirement} />
                <RequirementRow label="Avetta Exception Treatment" value={result.requirements.avettaExceptionTreatment} />
                <RequirementRow label="Approval Authority" value={result.requirements.approvalAuthority} />
                <RequirementRow label="Audit Frequency" value={result.requirements.auditFrequency} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-executive">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Gateways & Guardrails</p>
                <h2 className="mt-1 text-lg font-semibold">{result.gateway.title}</h2>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ring-1 ${gatewayStyles[result.gateway.status]}`}>
                {result.gateway.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <RequirementRow
                label="Insurance Variance"
                value={result.gateway.insuranceVarianceAllowed ? "Available for review" : "Not allowed"}
              />
              <RequirementRow label="Client Contract Position" value={form.insuranceVarianceFlexibility} />
            </div>
            <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {result.gateway.rationale}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-executive">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <BarChart3 className="h-5 w-5 text-slate-700" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Score Breakdown</h2>
            </div>

            <div className="mt-5 grid gap-3">
              {(Object.keys(result.componentScores) as Array<keyof typeof result.componentScores>).map((key) => {
                const raw = result.componentScores[key];
                const weighted = result.weightedScores[key];
                const percentage = Math.min(raw, 100);

                return (
                  <div key={key} className="grid gap-2 rounded-md border border-slate-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">{componentLabels[key]}</span>
                      <span className="text-sm text-slate-600">
                        Raw {raw} x {Math.round(weights[key] * 100)}% = <strong className="text-slate-950">{weighted.toFixed(1)}</strong>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-700" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  step = "1"
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  prefix?: string;
  step?: string;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex rounded-md border border-slate-300 bg-white focus-within:border-slate-700 focus-within:ring-2 focus-within:ring-slate-200">
        {prefix ? <span className="grid place-items-center border-r border-slate-200 px-3 text-sm text-slate-500">{prefix}</span> : null}
        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-md px-3 py-2.5 text-sm outline-none"
        />
      </div>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((value) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => onChange(value)}
            className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
              checked === value
                ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
            }`}
          >
            {checked === value ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : null}
            {value ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function RequirementRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export default App;

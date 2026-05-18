export const scopeCategories = [
  "Tower A&L",
  "Tower Construction",
  "Civil",
  "Electrical",
  "Fencing",
  "Crane",
  "Prof. Services"
] as const;

export const regions = [
  "NorCal",
  "SoCal",
  "Mountain",
  "GL/GP",
  "UNY",
  "New England",
  "Southeast",
  "National"
] as const;

export type ScopeCategory = (typeof scopeCategories)[number];
export type Region = (typeof regions)[number];
export type RiskTier = "Low" | "Moderate" | "High" | "Critical";
export type InsuranceVarianceFlexibility = "No Variance Allowed" | "Client Approval Required" | "Flexible";
export type GatewayStatus = "Pass" | "Review" | "Blocked";

export interface ContractorInput {
  contractorName: string;
  scopeCategory: ScopeCategory;
  monthlyRevenue: number;
  crewCount: number;
  region: Region;
  emr: number;
  trir: number;
  oshaCitations: number;
  fatalities: number;
  hasSafetyProgram: boolean;
  hasSafetyManager: boolean;
  yearsInBusiness: number;
  insuranceVarianceRequested: boolean;
  insuranceVarianceFlexibility: InsuranceVarianceFlexibility;
}

export interface RequirementOutput {
  insuranceRequirement: string;
  avettaExceptionTreatment: string;
  approvalAuthority: string;
  auditFrequency: string;
}

export interface GatewayResult {
  status: GatewayStatus;
  title: string;
  insuranceVarianceAllowed: boolean;
  insuranceRequirement: string;
  avettaExceptionTreatment: string;
  rationale: string;
}

export interface RiskResult {
  finalScore: number;
  tier: RiskTier;
  requirements: RequirementOutput;
  gateway: GatewayResult;
  componentScores: {
    scope: number;
    region: number;
    revenue: number;
    crew: number;
    emr: number;
    trir: number;
    osha: number;
    fatality: number;
    maturity: number;
  };
  weightedScores: {
    scope: number;
    region: number;
    revenue: number;
    crew: number;
    emr: number;
    trir: number;
    osha: number;
    fatality: number;
    maturity: number;
  };
}

export const scopeScores: Record<ScopeCategory, number> = {
  "Prof. Services": 5,
  Fencing: 15,
  Civil: 35,
  Electrical: 55,
  Crane: 70,
  "Tower A&L": 75,
  "Tower Construction": 90
};

export const regionScores: Record<Region, number> = {
  "GL/GP": 15,
  UNY: 20,
  Mountain: 25,
  "New England": 30,
  Southeast: 30,
  NorCal: 40,
  SoCal: 45,
  National: 50
};

export const weights = {
  scope: 0.3,
  region: 0.1,
  revenue: 0.1,
  crew: 0.1,
  emr: 0.15,
  trir: 0.15,
  osha: 0.05,
  fatality: 0.1,
  maturity: 0.05
} as const;

export const requirementOutputs: Record<RiskTier, RequirementOutput> = {
  Low: {
    insuranceRequirement: "Reduced / Standard Minimum",
    avettaExceptionTreatment: "Minor exceptions allowed with documented review",
    approvalAuthority: "Contract Manager",
    auditFrequency: "Annual"
  },
  Moderate: {
    insuranceRequirement: "Standard Requirements",
    avettaExceptionTreatment: "Safety review required",
    approvalAuthority: "Contract Manager",
    auditFrequency: "Semiannual"
  },
  High: {
    insuranceRequirement: "Full Requirements",
    avettaExceptionTreatment: "Limited exceptions, written justification required",
    approvalAuthority: "SVP of Risk",
    auditFrequency: "Quarterly"
  },
  Critical: {
    insuranceRequirement: "Executive Review Required",
    avettaExceptionTreatment: "No exceptions without executive approval",
    approvalAuthority: "President",
    auditFrequency: "Monthly / Pre-job review"
  }
};

export function evaluateGateway(input: ContractorInput, baseRequirements: RequirementOutput): GatewayResult {
  if (!input.insuranceVarianceRequested) {
    return {
      status: "Pass",
      title: "No insurance variance requested",
      insuranceVarianceAllowed: true,
      insuranceRequirement: baseRequirements.insuranceRequirement,
      avettaExceptionTreatment: baseRequirements.avettaExceptionTreatment,
      rationale: "Score-based requirements apply because no insurance variance is being requested."
    };
  }

  if (input.insuranceVarianceFlexibility === "No Variance Allowed") {
    return {
      status: "Blocked",
      title: "Hard contractual gateway",
      insuranceVarianceAllowed: false,
      insuranceRequirement: "Full contractual insurance compliance required",
      avettaExceptionTreatment: "No insurance variance allowed due to client flow-down requirements",
      rationale: "Client flow-down provisions prohibit variance in insurance requirements, so the model cannot approve or recommend an exception in that field."
    };
  }

  if (input.insuranceVarianceFlexibility === "Client Approval Required") {
    return {
      status: "Review",
      title: "Client approval gateway",
      insuranceVarianceAllowed: true,
      insuranceRequirement: "Variance requires documented client approval",
      avettaExceptionTreatment: "Hold exception pending client approval and contract review",
      rationale: "The contract allows possible flexibility, but the insurance variance must be approved under the client-specific flow-down process."
    };
  }

  return {
    status: "Review",
    title: "Flexible contractual gateway",
    insuranceVarianceAllowed: true,
    insuranceRequirement: baseRequirements.insuranceRequirement,
    avettaExceptionTreatment: `${baseRequirements.avettaExceptionTreatment}; insurance variance may be reviewed under standard authority`,
    rationale: "Client requirements appear flexible enough for a normal risk-based variance review."
  };
}

export function scoreEmr(emr: number): number {
  if (emr <= 0.5) return 5;
  if (emr <= 0.8) return 10;
  if (emr <= 1) return 25;
  if (emr <= 1.25) return 50;
  if (emr <= 1.5) return 75;
  return 100;
}

export function scoreTrir(trir: number): number {
  if (trir <= 0.5) return 5;
  if (trir <= 1) return 10;
  if (trir <= 2) return 25;
  if (trir <= 3) return 50;
  if (trir <= 5) return 75;
  return 100;
}

export function scoreRevenue(monthlyRevenue: number): number {
  if (monthlyRevenue < 25000) return 10;
  if (monthlyRevenue < 100000) return 25;
  if (monthlyRevenue < 250000) return 45;
  if (monthlyRevenue < 500000) return 65;
  return 85;
}

export function scoreCrewCount(crewCount: number): number {
  if (crewCount <= 2) return 10;
  if (crewCount <= 5) return 25;
  if (crewCount <= 10) return 45;
  if (crewCount <= 20) return 65;
  return 85;
}

export function scoreOshaCitations(citations: number): number {
  if (citations <= 0) return 0;
  if (citations === 1) return 15;
  if (citations === 2) return 35;
  return 60;
}

export function scoreFatalities(fatalities: number): number {
  if (fatalities <= 0) return 0;
  if (fatalities === 1) return 75;
  return 100;
}

export function scoreMaturity(input: Pick<ContractorInput, "hasSafetyProgram" | "hasSafetyManager" | "yearsInBusiness">): number {
  let score = 0;
  if (!input.hasSafetyProgram) score += 20;
  if (!input.hasSafetyManager) score += 15;
  if (input.yearsInBusiness < 3) score += 10;
  return score;
}

export function getRiskTier(score: number): RiskTier {
  if (score <= 30) return "Low";
  if (score <= 55) return "Moderate";
  if (score <= 75) return "High";
  return "Critical";
}

export function calculateRisk(input: ContractorInput): RiskResult {
  const componentScores = {
    scope: scopeScores[input.scopeCategory],
    region: regionScores[input.region],
    revenue: scoreRevenue(input.monthlyRevenue),
    crew: scoreCrewCount(input.crewCount),
    emr: scoreEmr(input.emr),
    trir: scoreTrir(input.trir),
    osha: scoreOshaCitations(input.oshaCitations),
    fatality: scoreFatalities(input.fatalities),
    maturity: scoreMaturity(input)
  };

  const weightedScores = {
    scope: componentScores.scope * weights.scope,
    region: componentScores.region * weights.region,
    revenue: componentScores.revenue * weights.revenue,
    crew: componentScores.crew * weights.crew,
    emr: componentScores.emr * weights.emr,
    trir: componentScores.trir * weights.trir,
    osha: componentScores.osha * weights.osha,
    fatality: componentScores.fatality * weights.fatality,
    maturity: componentScores.maturity * weights.maturity
  };

  const rawScore = Object.values(weightedScores).reduce((total, score) => total + score, 0);
  const finalScore = Math.round(rawScore * 10) / 10;
  const tier = getRiskTier(finalScore);
  const requirements = requirementOutputs[tier];
  const gateway = evaluateGateway(input, requirements);

  return {
    finalScore,
    tier,
    requirements: {
      ...requirements,
      insuranceRequirement: gateway.insuranceRequirement,
      avettaExceptionTreatment: gateway.avettaExceptionTreatment
    },
    gateway,
    componentScores,
    weightedScores
  };
}

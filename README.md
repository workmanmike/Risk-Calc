# Subcontractor Onboarding Risk Model

This proof-of-concept React app scores subcontractors for onboarding review. It uses a live form on the left and a transparent scoring output on the right.

## Run the app

```bash
npm install
npm run dev
```

## Scoring logic

All model logic lives in `src/riskModel.ts`.

The app calculates raw component scores for scope, region, monthly revenue, crew count, EMR, TRIR, OSHA citations, fatalities, and maturity. It then applies these weights:

| Component | Weight |
| --- | ---: |
| Scope Score | 30% |
| Region Score | 10% |
| Revenue Score | 10% |
| Crew Score | 10% |
| EMR Score | 15% |
| TRIR Score | 15% |
| OSHA Score | 5% |
| Fatality Score | 10% |
| Maturity Score | 5% |

Maturity adds risk points when controls are missing:

- Safety Program = No adds 20 points.
- Safety Manager = No adds 15 points.
- Years in Business under 3 adds 10 points.

The final risk score is the sum of weighted component scores, rounded to one decimal place.

## Risk tiers

| Score | Tier |
| --- | --- |
| 0-30 | Low |
| 31-55 | Moderate |
| 56-75 | High |
| 76-100 | Critical |

Each tier maps to insurance requirements, Avetta exception treatment, approval authority, and audit frequency. The UI includes sample contractor buttons for Low, Moderate, High, and Critical examples.

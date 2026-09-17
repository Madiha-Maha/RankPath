# RankPath — Admission Counselling Intelligence Platform

RankPath is a high-stakes decision engine designed for the two-week JoSAA/CSAB centralized engineering counselling window in India (IITs, NITs, IIITs, and GFTIs). It predicts admission probability using transparent statistical modeling and generates mathematically optimized, risk-audited choice lists to maximize student outcomes.

---

## 2-Minute Demo Script (What to Click in Order)

1. **Step 1: Select a Pre-Configured Student Profile**
   - In the top header bar, click **"Aarav"** (`JEE Adv #3,420 (OBC)`) or **"Priya"** (`JEE Main #12,540 (Gen-F)`).
   - Observe how the parameters (All India Rank, Category Rank, Gender Pool, Quotas) update dynamically.
2. **Step 2: Explore the Rank Predictor Dashboard**
   - Click the filter chips: **"Safe (>85%)"**, **"Likely (60-85%)"**, **"Target (30-60%)"**, and **"Reach (10-30%)"**.
   - Click **"View History"** on any card (e.g. *IIT Bombay CSE* or *IIT Delhi MnC*) to view the 4-year Round 6 closing ranks (2021–2024), 95% Confidence Intervals, and plain-language explanation.
3. **Step 3: Choice List Optimiser (Flagship Feature)**
   - Switch to the **Choice Optimiser** tab.
   - Click **"Auto-Generate Optimal List"**.
   - Note how dream choices are sequenced at the top (Positions 1–10) and safe backups are placed strictly at the bottom (Positions 25–35), ensuring reach opportunities are never blocked by premature backups.
   - Use the **Move Up** and **Move Down** arrows or view the **Live Risk Warning Audit** if an inverted ordering hazard is created.
   - Click **"JoSAA CSV"** or **"Print / PDF"** to test official format export.
4. **Step 4: Run the Round-by-Round Simulator**
   - Switch to the **Round Simulator** tab.
   - Click through **Round 1 to Round 6**.
   - Review the tactical **FLOAT vs. SLIDE vs. FREEZE** guidance for each stage, explaining why freezing too early is hazardous.
5. **Step 5: Trend Intelligence & YoY Movement**
   - Switch to **Trend Intelligence** to view interactive Recharts visualizations of historical cutoffs, surging vs softening branches, and seat matrix anomalies.
6. **Step 6: Sensitivity Analysis & Model Audit**
   - Open **Scenario Comparison** to slide the rank by ±2,000 ranks and compare Branch-First vs Institute-First strategies.
   - Open **Transparency & Model** to audit the mathematical formulas and public 2024 backtesting report (94.2% in 95% CI).

---

## Architecture & Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + Recharts
- **Design System:** Deep slate/navy dark mode, Linear/Tremor data-forward aesthetic, WCAG AA contrast.
- **Statistical Engine:**
  - Ordinary Least Squares Linear Trend projection
  - Weighted Moving Average (45% Y-1, 30% Y-2, 15% Y-3, 10% Y-4)
  - Residual Standard Error for 95% Confidence Intervals
  - Abramowitz & Stegun Standard Normal Cumulative Distribution Function (CDF)
- **Database Schema:** PostgreSQL via Prisma (`prisma/schema.prisma`) with normalized tables for institutes, branches, cutoffs, user profiles, and choices.
- **Python Service:** FastAPI microservice (`service/main.py`, `service/prediction_engine.py`).

---

## Core Principles

- **Zero Data Brokering:** We never broker student leads to coaching centers or private universities.
- **Interpretable Statistics:** No black-box neural networks; every prediction displays its underlying data points, confidence interval, and verbal reasoning.
- **No Sponsored Placement:** Rankings and recommendations are strictly mathematical.

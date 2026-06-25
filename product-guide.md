# Cost Guardian v2 — User Guide

## Overview

Cost Guardian is a cost governance platform for ISG hardware programs. It provides parametric should-cost modeling, BOM-level quote analysis, and cost bridge waterfall visualization — all running entirely in your browser with no backend server.

## Quick Start

1. Open the web app in a modern browser (Chrome, Edge, Firefox)
2. Select a platform from the dropdown (SR650 V4 or SR630 V3)
3. Navigate between pages using the header tabs or left sidebar

Demo data for SR650 V4 and SR630 V3 is pre-loaded on first launch.

## Pages

### Program Dashboard

The landing page shows a high-level view of the selected platform:

- **KPI Cards** — ACI Index, DCE, CCE, PDCI, Quote Coverage, NRE Total
- **PLP Stage Pipeline** — Visual timeline of the program lifecycle
- **Cost Waterfall** — Bar chart showing ACI → DCE → CCE bridge
- **BOM Components Table** — Searchable, sortable table with all components
- **Variance Drivers** — Toggle between ACI→DCE and DCE→CCE bridge drivers

### L2 BOM Analysis

Detailed component-level analysis:

- Summary KPI cards (total components, quoted count, coverage, ACI gap)
- Full BOM table with search, category/status filters, and column sorting
- Each component shows DCE, supplier quote, variance percentage, and AI insights

### Variance Waterfall

Cost bridge analysis across the full value chain:

- Cost Waterfall chart (ACI → DCE → CCE)
- Side-by-side variance driver tables for both bridge segments

### Should Cost Calculator

Parametric clean-sheet cost modeling tool:

- **Commodity Selection** — Choose Air Baffle, Top Cover, or Riser Cage
- **Parameter Panels** — Physical specs, raw material, manufacturing, logistics, tooling, and adders
- **Real-time Calculation** — Should-cost updates instantly as parameters change
- **Compare A/B** — Snap current parameters to a B snapshot for side-by-side comparison
- **Sensitivity Analysis** — Tornado chart showing which parameters drive cost the most
- **Cost Breakdown** — Visual bar chart of cost components

#### Editable Parameters

All sliders and dropdowns are editable in real time:

- Labor rate is now directly adjustable (auto-updates when location changes)
- Lead time is editable
- E&O reserve rate and warranty adder are adjustable in the new Adders panel

### Admin Panel

Data management and system configuration:

- **Download Blank Template** — Get an empty Excel template with correct column headers
- **Download Current Data** — Export all data as JSON backup
- **Upload Excel** — Drag-and-drop .xlsx file to load custom data (4 sheets required)
- **Activity Log** — Audit trail of all uploads, edits, exports, and resets
- **Upload History** — Record of all file uploads with row counts
- **Web Editing Toggle** — Enable/disable inline cell editing on BOM and Should Cost pages
- **Reset to Demo Data** — Restore pre-loaded SR650 V4 + SR630 V3 data

## Excel Template Format

The upload template requires 4 sheets:

### Dashboard
| Column | Description | Example |
|--------|-------------|---------|
| Platform | Platform name | SR650 V4 |
| KPI_Type | KPI identifier | ACI_Index, DCE, CCE, PDCI, Gate, Volume, Code, FiscalYear, Quote_Coverage, NRE_Total |
| Value | Numeric or text value | 1.08, 820, "Commit" |
| Unit | Unit of measure | $, %, ratio, units, text |
| Note | Optional note | "vs target 1.00" |

### Pipeline
| Column | Description | Example |
|--------|-------------|---------|
| Platform | Platform name | SR650 V4 |
| Stage | Stage number (1-5) | 3 |
| StageName | Stage display name | Development |
| Date | Stage date | Mar 13 |
| Status | done / active / pending | active |

### BOM
| Column | Description | Example |
|--------|-------------|---------|
| Platform | Platform name | SR650 V4 |
| Component | Component name | Motherboard |
| Category | ECAD/Mechanical/Management/Thermal/Power | ECAD |
| DCE | Should-cost estimate ($) | 498 |
| Quote | Supplier quote ($, nullable) | 508 |
| Ch1 | Challenger 1 quote ($) | 481 |
| Ch2 | Challenger 2 quote ($) | 470 |
| Material | Material description | FR4 |
| Status | OK / At Risk / Blocked | At Risk |
| AI_Insight | AI-generated insight text | Layer count reduction may save $15-20/unit |

### ShouldCost_Params
| Column | Description | Example |
|--------|-------------|---------|
| Platform | Platform name | SR650 V4 |
| Commodity | Commodity ID | air-baffle |
| ParamCategory | Category group | Physical, Material, Mfg, Logistics, Tooling, Adders, Commercial |
| ParamName | Parameter name | Length |
| Value | Parameter value | 220 |
| Unit | Unit of measure | mm, %, $/kg, $/hr, steps, min |
| Options | Semicolon-separated choices (optional) | SECC Steel;SPCC Steel |

## Web Editing

When Web Editing is enabled in Admin:

- **BOM Table** — Double-click any numeric cell (DCE, Quote, Ch1, Ch2) to edit
- **Should Cost Calculator** — All sliders and selects are already editable by default

All edits are logged in the Activity Log with old/new values.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Excel**: SheetJS (xlsx)
- **Storage**: IndexedDB (via Dexie.js) — all data stays in your browser
- **Deployment**: Docker + nginx static serving

## Docker Deployment

```bash
docker compose up -d
```

The app will be available at http://localhost:8080.

## Data Privacy

All data is stored locally in your browser's IndexedDB. No data is sent to any server. Clearing browser data will delete all stored records — use the Export function in Admin to back up data regularly.

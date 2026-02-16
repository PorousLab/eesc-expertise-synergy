# Expertise & Synergy — EESC

Interactive tool for mapping researcher expertise, discovering collaboration potential, and configuring research themes for the **Environmental Earth Sciences Centre** at Utrecht University.

**Live:** [https://porouslab.github.io/eesc-expertise-synergy/](https://porouslab.github.io/eesc-expertise-synergy/)

## Features

- **Network Graph** — D3 force-directed visualisation of researcher connections based on shared skills and topics
- **Skills Matrix** — Heatmap of 18 researchers × 13 methods with coverage indicators
- **Synergies** — All researcher pairs with shared skills and cross-pillar overlaps
- **Theme Builder** — Drag-and-drop interface for composing research themes with live skill coverage feedback

## Setup

```bash
git clone https://github.com/PorousLab/eesc-expertise-synergy.git
cd eesc-expertise-synergy
npm install
npm run dev
```

## Deployment

Deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

**One-time setup:** Go to repo Settings → Pages → Source → select **GitHub Actions**.

## Data

Researcher data lives in `src/ExpertiseSynergyMapper.jsx` in the `RESEARCHERS` array. To add or update a researcher, edit that array directly.

## Stack

Vite · React 18 · D3.js 7

---

Department of Earth Sciences, Utrecht University

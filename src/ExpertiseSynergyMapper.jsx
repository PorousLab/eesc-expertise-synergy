import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";

// ─── DATA ────────────────────────────────────────────────────────────────
const RESEARCHERS = [
  { id: "middelburg", name: "Jack Middelburg", position: "Professor", group: "Geochemistry", email: "j.b.m.middelburg@uu.nl",
    expertise: "Biogeochemistry, marine carbon cycling, alkalinity",
    skills: ["Experimental Lab Work","Numerical Modelling","Field Work","Stable Isotope Analysis","Geochemical Modelling","Reactive Transport Modelling","Science Communication"],
    topics: ["Ocean alkalinity","Nutrient cycling","Inland water biogeochemistry","Carbon cycling","Reactive transport"],
    pillars: ["Water Quality","Ocean Health"], projects: "NESSC, Mind The Gap (ERC)", external: "NIOZ, Deltares",
    pubs: "Nature Water, Science Advances, Nature Geoscience (2024)", hindex: 65 },
  { id: "zech", name: "Alraune Zech", position: "Assistant Professor", group: "Env. Hydrogeology", email: "a.zech@uu.nl",
    expertise: "Computational environmental hydrogeology, stochastic modelling",
    skills: ["Numerical Modelling","Field Work","Statistical / Data Science"],
    topics: ["PFAS remediation","Contaminant transport","Groundwater flow","Virus transport"],
    pillars: ["Water Quality"], projects: "Living Lab PFAS (€2.45M), MIBIREM (EU), SilPit (NWO)", external: "TNO, UFZ Helmholtz",
    pubs: "PFAS Living Lab field investigations (2024)", hindex: null },
  { id: "cnudde", name: "Veerle Cnudde", position: "Professor", group: "Env. Hydrogeology", email: "v.cnudde@uu.nl",
    expertise: "Porous media imaging techniques, X-ray micro-CT",
    skills: ["Experimental Lab Work","X-ray / Imaging"],
    topics: ["Fluid flow in porous rocks","Stone weathering","Microbial-induced processes"],
    pillars: ["Water Quality"], projects: "BugControl (NWO VICI), InFUSE", external: "Ghent Univ., PSI Switzerland",
    pubs: "BugControl VICI project outputs (2023–2025)", hindex: null },
  { id: "behrends", name: "Thilo Behrends", position: "Associate Professor", group: "Geochemistry", email: "t.behrends@uu.nl",
    expertise: "Environmental geochemistry, redox transformations",
    skills: ["Experimental Lab Work","Field Work","Stable Isotope Analysis","Geochemical Modelling"],
    topics: ["Metal redox cycling","Phosphorus cycling","Radioactive waste disposal","Virus attachment"],
    pillars: ["Water Quality"], projects: "P-TRAP (H2020 Marie Curie ITN)", external: "EAWAG, KWR, Deltares, COVRA",
    pubs: "Water Research, Env. Sci. Technol. (2024)", hindex: null },
  { id: "wolthers", name: "Mariette Wolthers", position: "Associate Professor", group: "Geochemistry", email: "m.wolthers@uu.nl",
    expertise: "Water-mineral interactions, mineral nucleation",
    skills: ["Experimental Lab Work","Numerical Modelling","Geochemical Modelling"],
    topics: ["Mineral nucleation","Water quality","Drinking water","Geochemical surface processes"],
    pillars: ["Water Quality"], projects: "UCSSU member", external: "KWR, TNO",
    pubs: "Mineral nucleation studies (2023–2024)", hindex: null },
  { id: "polerecky", name: "Lubos Polerecky", position: "Assistant Professor", group: "Geochemistry", email: "l.polerecky@uu.nl",
    expertise: "NanoSIMS, aquatic biogeochemistry, microbial ecophysiology",
    skills: ["Experimental Lab Work","Numerical Modelling","Stable Isotope Analysis","NanoSIMS","Geochemical Modelling"],
    topics: ["Sediment biogeochemistry","Benthic photosynthesis","Microbial element cycling","Bioturbation"],
    pillars: ["Water Quality","Ocean Health"], projects: "NanoSIMS facility (NWO)", external: "Max-Planck Bremen, NIOZ",
    pubs: "Env. Microbiology, Frontiers Microbiol. (2024–25)", hindex: null },
  { id: "wang", name: "Junjie Wang", position: "Assistant Professor", group: "Geochemistry", email: "j.wang3@uu.nl",
    expertise: "Environmental biogeochemistry, nutrient cycling",
    skills: ["Numerical Modelling","Field Work","Geochemical Modelling","Statistical / Data Science","Science Communication"],
    topics: ["N/P/Si cycling","Water quality","Greenhouse gas emissions","Land-to-sea transport"],
    pillars: ["Water Quality","Ocean Health"], projects: "Mind The Gap (ERC + eScience)", external: "Deltares, PBL, eScience Center",
    pubs: "Nature Water, Nature Sustainability (2024)", hindex: null },
  { id: "geilert", name: "Sonja Geilert", position: "Assistant Professor", group: "Geochemistry", email: "s.geilert@uu.nl",
    expertise: "Marine geochemistry, silica-carbon cycle, stable isotopes",
    skills: ["Experimental Lab Work","Field Work","Stable Isotope Analysis","Geochemical Modelling"],
    topics: ["Marine silicate weathering","Ocean alkalinity enhancement","Carbon dioxide removal","Hadean ocean"],
    pillars: ["Ocean Health"], projects: "SILICYCLE (NWO Vidi), RETAKE/CDRmare", external: "GEOMAR Kiel, CDRmare consortium",
    pubs: "Nature Comms, Frontiers Climate (2023–24)", hindex: null },
  { id: "miller", name: "Cale Miller", position: "Assistant Professor", group: "Geochemistry", email: "c.a.miller@uu.nl",
    expertise: "Marine biogeochemistry, coastal ecosystems, blue carbon",
    skills: ["Experimental Lab Work","Field Work","Geochemical Modelling"],
    topics: ["Blue carbon ecosystems","Ocean alkalinity enhancement","Carbon cycling in estuaries"],
    pillars: ["Ocean Health"], projects: "C-BLUES (EU Horizon Europe)", external: "Sustainable Ocean Community UU, NIOZ",
    pubs: "C-BLUES project, OAE bio-impacts (2024)", hindex: null },
  { id: "sangiorgi", name: "Francesca Sangiorgi", position: "Associate Professor", group: "Marine Palynology", email: "f.sangiorgi@uu.nl",
    expertise: "Marine palynology, paleoceanography, polar climate",
    skills: ["Field Work","Microscopy / Palynology","Ocean Drilling (IODP)","Science Communication"],
    topics: ["Antarctic climate change","Human impact on coastal areas","Harmful algal blooms","Marine biodiversity"],
    pillars: ["Ocean Health"], projects: "IODP expeditions, SWAIS 2C", external: "NIOZ, IODP/ICDP, Univ. Bologna",
    pubs: "IODP Antarctic expeditions (2023–25)", hindex: null },
  { id: "peterse", name: "Francien Peterse", position: "Associate Professor", group: "Organic Geochemistry", email: "f.peterse@uu.nl",
    expertise: "Organic geochemistry, lipid biomarkers, paleoclimate",
    skills: ["Experimental Lab Work","Field Work","Biomarker Analysis"],
    topics: ["Land-ocean carbon transport","Paleoclimate reconstruction","Proxy development","Carbon cycle dynamics"],
    pillars: ["Ocean Health"], projects: "NESSC Theme 2 leader", external: "NIOZ, international",
    pubs: "GDGT biomarker studies (2024)", hindex: null },
  { id: "sluijs", name: "Appy Sluijs", position: "Professor", group: "Marine Palynology", email: "a.sluijs@uu.nl",
    expertise: "Paleoceanography, paleoclimate, dinoflagellate biogeology",
    skills: ["Field Work","Stable Isotope Analysis","Microscopy / Palynology","Geochemical Modelling","Ocean Drilling (IODP)","Science Communication"],
    topics: ["Climate change geological past","CO2-climate relationship","Ocean acidification","Marine carbon cycling"],
    pillars: ["Ocean Health"], projects: "ERC Starting + Consolidator, NESSC", external: "NIOZ, IODP, international",
    pubs: "Paleocean. & Paleoclimatol. ×3 (2025)", hindex: null },
  { id: "cramwinckel", name: "Marlow Cramwinckel", position: "Assistant Professor", group: "Geochemistry", email: "m.j.cramwinckel@uu.nl",
    expertise: "Earth system & climate sciences, marine carbon cycle",
    skills: ["Numerical Modelling","Stable Isotope Analysis","Biomarker Analysis","Geochemical Modelling"],
    topics: ["Earth system feedbacks","Ocean alkalinization","Past carbon cycling","Eocene climate"],
    pillars: ["Ocean Health"], projects: "Paleoclimate projects", external: "International paleoclimate community",
    pubs: "Earth system modelling outputs (2024)", hindex: null },
  { id: "bijl", name: "Peter Bijl", position: "Associate Professor", group: "Marine Palynology", email: "p.k.bijl@uu.nl",
    expertise: "Paleoceanography, palynology, Antarctica/Southern Ocean",
    skills: ["Field Work","Biomarker Analysis","Microscopy / Palynology","Ocean Drilling (IODP)","Science Communication"],
    topics: ["Antarctic climate evolution","Southern Ocean paleoceanography","Sea level dynamics","Dinocyst ecology"],
    pillars: ["Ocean Health"], projects: "EGU Award, IODP, Utrecht Young Academy", external: "NIOZ, IODP, TNO",
    pubs: "Southern Ocean palynology (2024–25)", hindex: null },
  { id: "eggenhuisen", name: "Joris Eggenhuisen", position: "Associate Professor", group: "Sedimentology", email: "j.t.eggenhuisen@uu.nl",
    expertise: "Sedimentology, turbidity currents, sediment transport",
    skills: ["Experimental Lab Work","Numerical Modelling","Field Work"],
    topics: ["Submarine channel dynamics","Marine sediment transport","Deep-water depositional systems"],
    pillars: ["Ocean Health"], projects: "EuroSEDS (NWO/industry)", external: "International sedimentology",
    pubs: "Sediment transport modelling (2024)", hindex: null },
  { id: "trabucho", name: "João Trabucho Alexandre", position: "Assistant Professor", group: "Sedimentology", email: "j.trabucho@uu.nl",
    expertise: "Sedimentary geology, marine sediment dynamics",
    skills: ["Field Work"],
    topics: ["Marine sediment dynamics","Sedimentary basin evolution","Organic matter dispersal"],
    pillars: ["Ocean Health"], projects: "Stratigraphy projects", external: "International network",
    pubs: "Basin stratigraphy (2023–24)", hindex: null },
  { id: "raoof", name: "Amir Raoof", position: "Associate Professor", group: "Env. Hydrogeology / UCSSU", email: "a.raoof@uu.nl",
    expertise: "Reactive transport, pore-scale modelling",
    skills: ["Experimental Lab Work","Numerical Modelling","Field Work","X-ray / Imaging","Reactive Transport Modelling","Science Communication"],
    topics: ["Reactive transport in subsurface","Pore-scale processes"],
    pillars: ["Water Quality"], projects: "UCSSU coordinator, InFocus", external: "TNO-GDN",
    pubs: "Poreflow platform development (2024)", hindex: null },
  { id: "sweijen", name: "Thomas Sweijen", position: "Assistant Professor", group: "Env. Hydrogeology / UCSSU", email: "t.sweijen@uu.nl",
    expertise: "Hydrogeology, subsurface sustainability",
    skills: ["Experimental Lab Work","Numerical Modelling","Field Work"],
    topics: ["Subsurface sustainability","Groundwater"],
    pillars: ["Water Quality"], projects: "UCSSU projects", external: "TNO",
    pubs: "Groundwater modelling studies (2024)", hindex: null },
];

const ALL_SKILLS = [
  "Experimental Lab Work","Numerical Modelling","Field Work",
  "Stable Isotope Analysis","X-ray / Imaging","NanoSIMS","Biomarker Analysis",
  "Microscopy / Palynology","Geochemical Modelling","Reactive Transport Modelling",
  "Statistical / Data Science","Ocean Drilling (IODP)","Science Communication"
];

const PILLAR_COLORS = {
  "Water Quality": "#1B6B93",
  "Ocean Health": "#2D8F6F",
  "Cross-cutting": "#7C5CBF",
  "Bridge": "#D4830E"
};

function getPillarColor(r) {
  if (r.pillars.length > 1 && !r.pillars.includes("Cross-cutting")) return PILLAR_COLORS.Bridge;
  return PILLAR_COLORS[r.pillars[0]] || "#888";
}

function sharedSkills(a, b) { return a.skills.filter(s => b.skills.includes(s)); }
function sharedTopicWords(a, b) {
  const wa = new Set(a.topics.flatMap(t => t.toLowerCase().split(/[\s,/&()+]+/).filter(w => w.length > 3)));
  const wb = new Set(b.topics.flatMap(t => t.toLowerCase().split(/[\s,/&()+]+/).filter(w => w.length > 3)));
  return [...wa].filter(w => wb.has(w));
}
function synergyScore(a, b) { return sharedSkills(a, b).length * 2 + sharedTopicWords(a, b).length; }

// ─── NETWORK GRAPH (enhanced) ───────────────────────────────────────────
function NetworkGraph({ researchers, onSelect, selected, filter }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 560 });
  const [hovered, setHovered] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "All") return researchers;
    return researchers.filter(r => r.pillars.includes(filter));
  }, [researchers, filter]);

  const { nodes, links } = useMemo(() => {
    const nodes = filtered.map(r => ({
      id: r.id, name: r.name, pillars: r.pillars,
      radius: 18,
      group: r.group
    }));
    const links = [];
    for (let i = 0; i < filtered.length; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        const score = synergyScore(filtered[i], filtered[j]);
        if (score >= 2) links.push({ source: filtered[i].id, target: filtered[j].id, score });
      }
    }
    return { nodes, links };
  }, [filtered]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const { w, h } = dims;

    // Defs for glow and gradients
    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    glow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", d => d);

    // Grid pattern
    const grid = defs.append("pattern").attr("id", "grid").attr("width", 40).attr("height", 40).attr("patternUnits", "userSpaceOnUse");
    grid.append("circle").attr("cx", 20).attr("cy", 20).attr("r", 0.5).attr("fill", "#94A3B8").attr("opacity", 0.3);

    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#grid)");

    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on("zoom", e => g.attr("transform", e.transform)));

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120).strength(0.15))
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(d => d.radius + 12))
      .force("x", d3.forceX(w / 2).strength(0.04))
      .force("y", d3.forceY(h / 2).strength(0.04));

    const link = g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", "#64748B").attr("stroke-width", 1)
      .attr("stroke-opacity", 0.18);

    const nodeG = g.append("g").selectAll("g").data(nodes).join("g").style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Outer ring
    nodeG.append("circle").attr("r", d => d.radius + 3)
      .attr("fill", "none").attr("stroke", d => getPillarColor(d)).attr("stroke-width", 1.5).attr("stroke-opacity", 0.25)
      .attr("stroke-dasharray", "2,2");

    // Main circle
    nodeG.append("circle").attr("r", d => d.radius)
      .attr("fill", d => {
        const c = getPillarColor(d);
        return c;
      })
      .attr("stroke", "#fff").attr("stroke-width", 2).attr("opacity", 0.88)
      .attr("filter", d => selected === d.id ? "url(#glow)" : "none");

    // Skill count
    nodeG.append("text").text(d => d.skills)
      .attr("text-anchor", "middle").attr("dy", "0.35em")
      .style("font-size", "10px").style("font-weight", "700")
      .style("fill", "#fff").style("pointer-events", "none")
      .style("font-family", "'JetBrains Mono', monospace");

    // Name label
    nodeG.append("text").text(d => d.name.split(" ").slice(-1)[0])
      .attr("dy", d => d.radius + 16).attr("text-anchor", "middle")
      .style("font-size", "11px").style("font-weight", "600").style("fill", "#1E293B")
      .style("pointer-events", "none").style("font-family", "'Outfit', sans-serif");

    nodeG.on("click", (e, d) => { e.stopPropagation(); onSelect(d.id); });
    svg.on("click", () => onSelect(null));

    nodeG.on("mouseenter", (e, d) => {
      setHovered(d.id);
      const conn = new Set(links.filter(l => l.source.id === d.id || l.target.id === d.id).flatMap(l => [l.source.id, l.target.id]));
      nodeG.select("circle:nth-child(2)").attr("opacity", n => conn.has(n.id) ? 1 : 0.12);
      nodeG.selectAll("text").attr("opacity", n => conn.has(n.id) ? 1 : 0.12);
      nodeG.select("circle:first-child").attr("stroke-opacity", n => conn.has(n.id) ? 0.5 : 0.05);
      link.attr("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 0.7 : 0.02)
        .attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? "#D4830E" : "#64748B")
        .attr("stroke-width", l => (l.source.id === d.id || l.target.id === d.id) ? 2 : 0.5);
    }).on("mouseleave", () => {
      setHovered(null);
      nodeG.select("circle:nth-child(2)").attr("opacity", 0.88);
      nodeG.selectAll("text").attr("opacity", 1);
      nodeG.select("circle:first-child").attr("stroke-opacity", 0.25);
      link.attr("stroke-opacity", 0.18).attr("stroke", "#64748B").attr("stroke-width", 1);
    });

    sim.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      nodeG.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, links, dims, selected]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(500, height) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const hoveredR = hovered ? RESEARCHERS.find(r => r.id === hovered) : null;

  return (
    <div ref={containerRef} style={{ width: "100%", height: 560, position: "relative", borderRadius: 16, overflow: "hidden", background: "#F8FAFB", border: "1px solid #D1D9E0" }}>
      <svg ref={svgRef} width={dims.w} height={dims.h} style={{ display: "block" }} />
      {/* Legend */}
      <div style={{ position: "absolute", bottom: 16, left: 20, display: "flex", gap: 16, fontSize: 11, color: "#64748B" }}>
        {[["Water Quality","#1B6B93"],["Ocean Health","#2D8F6F"],["Both Pillars","#D4830E"],["Cross-cutting","#7C5CBF"]].map(([l,c]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", top: 16, right: 20, fontSize: 10, color: "#94A3B8", lineHeight: 1.6, textAlign: "right" }}>
        Hover to highlight · Click to select<br/>Drag nodes · Scroll to zoom
      </div>
      {/* Hover tooltip */}
      {hoveredR && (
        <div style={{
          position: "absolute", top: 16, left: 20, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          borderRadius: 12, padding: "12px 16px", border: "1px solid #E2E8F0", maxWidth: 280,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 2 }}>{hoveredR.name}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>{hoveredR.position} · {hoveredR.group}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {hoveredR.skills.slice(0, 5).map(s => (
              <span key={s} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#F1F5F9", color: "#475569" }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SKILLS MATRIX (enhanced) ───────────────────────────────────────────
function SkillsMatrix({ researchers, onSelect, selected, filter }) {
  const filtered = useMemo(() => {
    if (filter === "All") return researchers;
    return researchers.filter(r => r.pillars.includes(filter));
  }, [researchers, filter]);

  const skillCounts = useMemo(() => {
    const counts = {};
    ALL_SKILLS.forEach(s => { counts[s] = filtered.filter(r => r.skills.includes(s)).length; });
    return counts;
  }, [filtered]);

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #D1D9E0", background: "#fff" }}>
      <div style={{ overflowX: "auto", padding: "0" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ padding: "14px 16px", textAlign: "left", position: "sticky", left: 0, background: "#F1F4F8", zIndex: 3, minWidth: 160, borderBottom: "2px solid #CBD5E1", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Researcher
              </th>
              {ALL_SKILLS.map(s => (
                <th key={s} style={{ padding: "8px 4px", textAlign: "center", borderBottom: "2px solid #CBD5E1", background: "#F1F4F8", position: "relative" }}>
                  <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap", height: 120, fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.02em" }}>
                    {s}
                  </div>
                  <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, marginTop: 4 }}>{skillCounts[s]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const isSelected = selected === r.id;
              const color = getPillarColor(r);
              return (
                <tr key={r.id} onClick={() => onSelect(r.id)} style={{
                  cursor: "pointer", background: isSelected ? "#FFFBEB" : i % 2 === 0 ? "#fff" : "#FAFBFC",
                  transition: "background 0.15s"
                }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#F0F7FF"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFBFC"; }}
                >
                  <td style={{
                    padding: "10px 16px", position: "sticky", left: 0, zIndex: 1,
                    background: "inherit", borderBottom: "1px solid #F1F5F9",
                    fontWeight: 600, fontSize: 12, color: "#1E293B", whiteSpace: "nowrap"
                  }}>
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: "50%", background: color,
                        flexShrink: 0
                      }} />
                      {r.name}
                    </span>
                  </td>
                  {ALL_SKILLS.map(s => (
                    <td key={s} style={{ padding: 4, textAlign: "center", borderBottom: "1px solid #F1F5F9" }}>
                      {r.skills.includes(s) ? (
                        <div style={{
                          width: 24, height: 24, borderRadius: 6, margin: "0 auto",
                          background: color, opacity: 0.8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "transform 0.1s, opacity 0.1s"
                        }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.2)"; e.currentTarget.style.opacity = "1"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "0.8"; }}
                        >
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>
                        </div>
                      ) : (
                        <div style={{ width: 24, height: 24, borderRadius: 6, margin: "0 auto", background: "#F4F6F8" }} />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {/* Footer with coverage */}
          <tfoot>
            <tr>
              <td style={{ padding: "10px 16px", position: "sticky", left: 0, background: "#F1F4F8", zIndex: 1, fontWeight: 700, fontSize: 11, color: "#475569", borderTop: "2px solid #CBD5E1", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Coverage
              </td>
              {ALL_SKILLS.map(s => {
                const count = skillCounts[s];
                const max = filtered.length;
                const pct = max > 0 ? count / max : 0;
                return (
                  <td key={s} style={{ padding: 4, textAlign: "center", borderTop: "2px solid #CBD5E1", background: "#F1F4F8" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", margin: "0 auto",
                      background: pct > 0.5 ? "#2D8F6F" : pct > 0.25 ? "#D4830E" : pct > 0 ? "#DC6B3F" : "#E2E8F0",
                      opacity: Math.max(0.4, pct), color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700
                    }}>
                      {count}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── SYNERGY PAIRS (enhanced) ───────────────────────────────────────────
function SynergyPairs({ researchers, onSelect, filter }) {
  const pairs = useMemo(() => {
    const f = filter === "All" ? researchers : researchers.filter(r => r.pillars.includes(filter));
    const result = [];
    for (let i = 0; i < f.length; i++) {
      for (let j = i + 1; j < f.length; j++) {
        const ss = sharedSkills(f[i], f[j]);
        const st = sharedTopicWords(f[i], f[j]);
        const overlap = ss.length + st.length;
        if (overlap >= 2) result.push({ a: f[i], b: f[j], skills: ss, topicWords: st });
      }
    }
    return result.sort((x, y) => x.a.name.localeCompare(y.a.name));
  }, [researchers, filter]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 12 }}>
      {pairs.map((p, i) => {
        const crossPillar = !p.a.pillars.some(x => p.b.pillars.includes(x));
        return (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #E2E8F0",
            position: "relative", overflow: "hidden", cursor: "pointer",
            transition: "box-shadow 0.2s, transform 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 13, color: getPillarColor(p.a), cursor: "pointer" }} onClick={() => onSelect(p.a.id)}>{p.a.name}</span>
                <span style={{ color: "#CBD5E1", margin: "0 8px", fontSize: 16 }}>↔</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: getPillarColor(p.b), cursor: "pointer" }} onClick={() => onSelect(p.b.id)}>{p.b.name}</span>
                {crossPillar && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: "#FEF3C7", color: "#92400E", fontWeight: 700, marginLeft: 8, verticalAlign: "middle" }}>CROSS-PILLAR</span>}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {p.skills.map(s => <span key={s} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 8, background: "#EBF4FF", color: "#1B6B93", fontWeight: 500 }}>{s}</span>)}
              {p.topicWords.slice(0, 5).map(w => <span key={w} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 8, background: "#E6FFF0", color: "#276749", fontWeight: 500 }}>{w}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── THEME BUILDER (new feature) ────────────────────────────────────────
const CANDIDATE_THEMES = [
  { id: "biogeochem", name: "Biogeochemical Cycling & Water Quality", color: "#1B6B93", icon: "💧" },
  { id: "ocean_carbon", name: "Ocean Carbon & CDR", color: "#2D8F6F", icon: "🌊" },
  { id: "paleo_climate", name: "Paleoclimate & Ocean Change", color: "#6B4FA0", icon: "🌍" },
  { id: "monitoring", name: "Environmental Monitoring & Remediation", color: "#D4830E", icon: "🔬" },
];

function ThemeBuilder({ researchers, onSelect, filter }) {
  const [assignments, setAssignments] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverTheme, setDragOverTheme] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "All") return researchers;
    return researchers.filter(r => r.pillars.includes(filter));
  }, [researchers, filter]);

  const unassigned = filtered.filter(r => !assignments[r.id]);
  const themeMembers = (themeId) => filtered.filter(r => assignments[r.id] === themeId);

  const themeCoverage = useCallback((themeId) => {
    const members = themeMembers(themeId);
    const covered = new Set(members.flatMap(m => m.skills));
    return { covered: covered.size, total: ALL_SKILLS.length, skills: covered, members: members.length };
  }, [assignments, filtered]);

  const handleDrop = (themeId) => {
    if (draggedId) {
      setAssignments(prev => ({ ...prev, [draggedId]: themeId }));
      setDraggedId(null);
      setDragOverTheme(null);
    }
  };

  const handleRemove = (researcherId) => {
    setAssignments(prev => { const n = { ...prev }; delete n[researcherId]; return n; });
  };

  const autoAssign = () => {
    const a = {};
    filtered.forEach(r => {
      if (r.topics.some(t => /water|pfas|contamin|groundwater|drink|phospho|redox|remediat|mineral nucle/i.test(t))) a[r.id] = "biogeochem";
      else if (r.topics.some(t => /alkalin|carbon.*remov|blue carbon|OAE|silicate.*weather|CDR|coastal.*carbon/i.test(t))) a[r.id] = "ocean_carbon";
      else if (r.topics.some(t => /paleo|climate.*past|eocene|antarc|dinocyst|PETM|ocean.*acidif|dinoflag/i.test(t))) a[r.id] = "paleo_climate";
      else if (r.topics.some(t => /monitor|imaging|nano|sediment|pore.*scale|turbid|algal|bioturb/i.test(t))) a[r.id] = "monitoring";
    });
    setAssignments(a);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <button onClick={autoAssign} style={{
          padding: "8px 16px", borderRadius: 10, border: "1px solid #D1D9E0", background: "#fff",
          fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569",
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F0F7FF"; e.currentTarget.style.borderColor = "#1B6B93"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#D1D9E0"; }}
        >⚡ Auto-assign by topic</button>
        <button onClick={() => setAssignments({})} style={{
          padding: "8px 16px", borderRadius: 10, border: "1px solid #D1D9E0", background: "#fff",
          fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#94A3B8",
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FFF5F5"; e.currentTarget.style.borderColor = "#E53E3E"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#D1D9E0"; }}
        >↺ Reset all</button>
        <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>Drag researchers into themes to explore configurations</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {CANDIDATE_THEMES.map(theme => {
          const members = themeMembers(theme.id);
          const coverage = themeCoverage(theme.id);
          const isOver = dragOverTheme === theme.id;
          return (
            <div key={theme.id}
              onDragOver={e => { e.preventDefault(); setDragOverTheme(theme.id); }}
              onDragLeave={() => setDragOverTheme(null)}
              onDrop={() => handleDrop(theme.id)}
              style={{
                background: isOver ? `${theme.color}08` : "#fff",
                borderRadius: 16, border: `2px ${isOver ? "solid" : "dashed"} ${isOver ? theme.color : "#D1D9E0"}`,
                padding: "16px 18px", minHeight: 180, transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{theme.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: theme.color, letterSpacing: "-0.01em" }}>{theme.name}</div>
                </div>
                {members.length > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Skill Coverage</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: coverage.covered / coverage.total > 0.6 ? "#2D8F6F" : coverage.covered / coverage.total > 0.3 ? "#D4830E" : "#DC6B3F", fontFamily: "'JetBrains Mono', monospace" }}>
                      {Math.round(coverage.covered / coverage.total * 100)}%
                    </div>
                  </div>
                )}
              </div>
              {/* Coverage bar */}
              {members.length > 0 && (
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {ALL_SKILLS.map(s => (
                    <div key={s} title={s} style={{
                      flex: 1, height: 6, borderRadius: 3,
                      background: coverage.skills.has(s) ? theme.color : "#E8ECF0",
                      opacity: coverage.skills.has(s) ? 0.8 : 0.4,
                      transition: "background 0.2s"
                    }} />
                  ))}
                </div>
              )}
              {/* Members */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {members.map(r => (
                  <div key={r.id} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 10, background: `${theme.color}10`,
                    fontSize: 11, fontWeight: 600, color: theme.color, cursor: "pointer",
                    border: `1px solid ${theme.color}25`, transition: "all 0.15s"
                  }}
                    onClick={() => onSelect(r.id)}
                  >
                    {r.name.split(" ").slice(-1)[0]}
                    <span onClick={(e) => { e.stopPropagation(); handleRemove(r.id); }}
                      style={{ cursor: "pointer", opacity: 0.5, fontWeight: 400, fontSize: 13, lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
                    >×</span>
                  </div>
                ))}
                {members.length === 0 && (
                  <div style={{ fontSize: 11, color: "#B0BEC5", fontStyle: "italic", padding: "20px 0" }}>
                    Drop researchers here…
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned pool */}
      {unassigned.length > 0 && (
        <div style={{
          marginTop: 16, background: "#F8FAFB", borderRadius: 14, border: "1px solid #E2E8F0",
          padding: "14px 18px"
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Unassigned Researchers ({unassigned.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {unassigned.map(r => (
              <div key={r.id} draggable onDragStart={() => setDraggedId(r.id)} onDragEnd={() => { setDraggedId(null); setDragOverTheme(null); }}
                onClick={() => onSelect(r.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10, background: "#fff",
                  border: `1px solid ${draggedId === r.id ? "#D4830E" : "#D1D9E0"}`,
                  fontSize: 12, fontWeight: 600, color: "#1E293B", cursor: "grab",
                  transition: "all 0.15s", boxShadow: draggedId === r.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = getPillarColor(r); e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { if (draggedId !== r.id) { e.currentTarget.style.borderColor = "#D1D9E0"; e.currentTarget.style.boxShadow = "none"; }}}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: getPillarColor(r), flexShrink: 0 }} />
                {r.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PANEL (enhanced) ───────────────────────────────────────────
function ProfilePanel({ researcher, allResearchers, onClose, onSelect }) {
  if (!researcher) return null;
  const r = researcher;
  const color = getPillarColor(r);
  const connections = allResearchers
    .filter(o => o.id !== r.id)
    .map(o => ({ ...o, shared: sharedSkills(r, o) }))
    .filter(o => o.shared.length >= 1)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #D1D9E0", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)", maxHeight: "calc(100vh - 220px)", overflowY: "auto"
    }}>
      {/* Header band */}
      <div style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, padding: "20px 22px 16px", color: "#fff" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {r.pillars.map(p => (
            <span key={p} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.2)", fontWeight: 600, backdropFilter: "blur(4px)" }}>{p}</span>
          ))}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>{r.name}</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, opacity: 0.85 }}>{r.position} · {r.group}</p>
      </div>

      <div style={{ padding: "18px 22px 22px" }}>
        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>{r.expertise}</div>

        <Section title="Skills & Methods">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {r.skills.map(s => <Tag key={s} text={s} bg="#F0F4F8" color="#334155" />)}
          </div>
        </Section>

        <Section title="Research Topics">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {r.topics.map(t => <Tag key={t} text={t} bg="#FFFBEB" color="#92400E" />)}
          </div>
        </Section>

        {r.pubs && (
          <Section title="Key Publications">
            <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{r.pubs}</p>
          </Section>
        )}

        <Section title="Projects & Partners">
          <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{r.projects}</p>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: "#94A3B8" }}>{r.external}</p>
        </Section>

        {connections.length > 0 && (
          <Section title="Shared Skills With">
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {connections.map(c => (
                <div key={c.id} onClick={() => onSelect(c.id)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 10px", borderRadius: 10, background: "#F8FAFB", cursor: "pointer",
                  transition: "background 0.15s", border: "1px solid transparent"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EBF4FF"; e.currentTarget.style.borderColor = "#D1D9E0"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFB"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: getPillarColor(c), flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#1E293B" }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{c.shared.length} shared</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Tag({ text, bg, color }) {
  return <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: bg, color, fontWeight: 500 }}>{text}</span>;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────
export default function ExpertiseSynergyMapper() {
  const [view, setView] = useState("network");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const selectedResearcher = useMemo(() => RESEARCHERS.find(r => r.id === selected), [selected]);

  const stats = useMemo(() => {
    const wq = RESEARCHERS.filter(r => r.pillars.includes("Water Quality")).length;
    const oh = RESEARCHERS.filter(r => r.pillars.includes("Ocean Health")).length;
    const cc = RESEARCHERS.filter(r => r.pillars.includes("Cross-cutting")).length;
    const bridge = RESEARCHERS.filter(r => r.pillars.includes("Water Quality") && r.pillars.includes("Ocean Health")).length;
    return { total: RESEARCHERS.length, wq, oh, cc, bridge, skills: ALL_SKILLS.length };
  }, []);

  const views = [
    { id: "network", label: "Network", icon: "◉" },
    { id: "heatmap", label: "Skills Matrix", icon: "▦" },
    { id: "synergy", label: "Synergies", icon: "⇌" },
    { id: "themes", label: "Theme Builder", icon: "◫" }
  ];
  const filters = ["All", "Water Quality", "Ocean Health", "Cross-cutting"];

  return (
    <div style={{ minHeight: "100vh", background: "#EEF1F5", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #0B1D33 0%, #163B5C 45%, #1B5B45 100%)",
        padding: "0", position: "relative", overflow: "hidden"
      }}>
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "28px 36px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em",
                color: "#6DB8A0", fontWeight: 600, marginBottom: 6
              }}>
                Environmental Earth Sciences Centre · Formation Tool
              </div>
              <h1 style={{
                margin: 0, fontSize: 30, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.03em", lineHeight: 1.1
              }}>
                Expertise & Synergy
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)", maxWidth: 480, lineHeight: 1.5, fontWeight: 400 }}>
                Synergy of {stats.total} researchers working on Water Quality and Ocean Health within the Environmental Earth Sciences Centre.
              </p>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              {[
                { n: stats.wq, l: "Water Quality", c: "#5BA8D4" },
                { n: stats.oh, l: "Ocean Health", c: "#6DB8A0" },
                { n: stats.bridge, l: "Bridge Both", c: "#E6A030" },
                { n: stats.cc, l: "Cross-cutting", c: "#B494E0" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.c, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 4, letterSpacing: "0.04em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #D1D9E0",
        position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(8px)"
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "10px 36px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10
        }}>
          {/* View tabs */}
          <div style={{ display: "flex", gap: 2, background: "#F1F4F8", borderRadius: 12, padding: 3 }}>
            {views.map(v => (
              <button key={v.id} onClick={() => setView(v.id)} style={{
                padding: "7px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                background: view === v.id ? "#0B1D33" : "transparent",
                color: view === v.id ? "#fff" : "#64748B",
                transition: "all 0.15s"
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>
          {/* Pillar filter */}
          <div style={{ display: "flex", gap: 2, background: "#F1F4F8", borderRadius: 12, padding: 3 }}>
            {filters.map(f => {
              const c = PILLAR_COLORS[f] || "#0B1D33";
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600,
                  background: filter === f ? c : "transparent",
                  color: filter === f ? "#fff" : "#64748B",
                  transition: "all 0.15s"
                }}>{f}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 36px 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 380px" : "1fr",
          gap: 20, alignItems: "start"
        }}>
          <div style={{ minWidth: 0 }}>
            {view === "network" && <NetworkGraph researchers={RESEARCHERS} onSelect={setSelected} selected={selected} filter={filter} />}
            {view === "heatmap" && <SkillsMatrix researchers={RESEARCHERS} onSelect={setSelected} selected={selected} filter={filter} />}
            {view === "synergy" && <SynergyPairs researchers={RESEARCHERS} onSelect={setSelected} filter={filter} />}
            {view === "themes" && <ThemeBuilder researchers={RESEARCHERS} onSelect={setSelected} filter={filter} />}
          </div>
          {selected && (
            <div style={{ position: "sticky", top: 80 }}>
              <ProfilePanel researcher={selectedResearcher} allResearchers={RESEARCHERS} onClose={() => setSelected(null)} onSelect={setSelected} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #D1D9E0", background: "#F8FAFB", padding: "16px 36px",
        fontSize: 11, color: "#94A3B8", textAlign: "center"
      }}>
        Environmental Earth Sciences Centre · Department of Earth Sciences · Utrecht University · Data from Theme 4 Skills Database (Feb 2026)
      </div>
    </div>
  );
}

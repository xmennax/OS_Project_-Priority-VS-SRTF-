const COLORS = [
    "#2563eb", "#7c3aed", "#059669", "#dc2626",
    "#d97706", "#0891b2", "#be185d", "#65a30d",
    "#ea580c", "#6366f1", "#14b8a6", "#f43f5e"
];
 
 
function generateTable() {
    const n = parseInt(document.getElementById("num-processes").value);
 
    if (isNaN(n) || n <= 0 || n > 20) {
        alert("Please enter a number between 1 and 20.");
        return;
    }
 
    const tbody = document.getElementById("input-body");
    tbody.innerHTML = "";
 
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="number" id="pid-${i}"      value="${i + 1}" min="1"></td>
            <td><input type="number" id="at-${i}"       value="0"        min="0"></td>
            <td><input type="number" id="bt-${i}"       value=""         min="1" placeholder="required"></td>
            <td><input type="number" id="pr-${i}"       value="1"        min="1"></td>
        `;
        tbody.appendChild(row);
    }
 
    document.getElementById("process-table-wrapper").style.display = "block";
    document.getElementById("results-section").style.display       = "none";
    document.getElementById("error-msg").textContent               = "";
    document.getElementById("reset-btn").style.display             = "inline-block";
}
 
 
function resetInput() {
    document.getElementById("num-processes").value                 = "";
    document.getElementById("input-body").innerHTML                = "";
    document.getElementById("process-table-wrapper").style.display = "none";
    document.getElementById("results-section").style.display       = "none";
    document.getElementById("error-msg").textContent               = "";
    document.getElementById("reset-btn").style.display             = "none";
}


const SCENARIOS = {
    A: {
        label: "Scenario A — Basic Mixed Workload",
        processes: [
            { pid: 1, at: 0, bt: 6, pr: 2 },
            { pid: 2, at: 1, bt: 4, pr: 1 },
            { pid: 3, at: 3, bt: 2, pr: 3 },
            { pid: 4, at: 5, bt: 8, pr: 2 },
        ]
    },
    B: {
        label: "Scenario B — Priority vs Burst Conflict",
        processes: [
            { pid: 1, at: 0, bt: 10, pr: 1 },
            { pid: 2, at: 0, bt: 2,  pr: 3 },
            { pid: 3, at: 0, bt: 3,  pr: 2 },
        ]
    },
    C: {
        label: "Scenario C — Starvation Sensitive",
        processes: [
            { pid: 1, at: 0, bt: 5, pr: 3 },
            { pid: 2, at: 2, bt: 1, pr: 1 },
            { pid: 3, at: 4, bt: 1, pr: 1 },
            { pid: 4, at: 6, bt: 1, pr: 1 },
            { pid: 5, at: 8, bt: 1, pr: 1 },
        ]
    },
    D: {
        label: "Scenario D — Invalid Input (BT = 0)",
        processes: [
            { pid: 1, at: 0, bt: 0, pr: 1 },
        ]
    }
};

function loadScenario(key) {
    const scenario = SCENARIOS[key];
    if (!scenario) return;

    const n = scenario.processes.length;

    document.getElementById("num-processes").value = n;
    document.getElementById("error-msg").textContent = "";
    document.getElementById("results-section").style.display = "none";

    const tbody = document.getElementById("input-body");
    tbody.innerHTML = "";

    scenario.processes.forEach((p, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="number" id="pid-${i}" value="${p.pid}" min="1"></td>
            <td><input type="number" id="at-${i}"  value="${p.at}"  min="0"></td>
            <td><input type="number" id="bt-${i}"  value="${p.bt}"  min="1"></td>
            <td><input type="number" id="pr-${i}"  value="${p.pr}"  min="1"></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("process-table-wrapper").style.display = "block";
    document.getElementById("reset-btn").style.display             = "inline-block";

    document.querySelectorAll(".scenario-btn").forEach(btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
}
 
 
function validateInput(processes) {
    const pids = [];
 
    for (let i = 0; i < processes.length; i++) {
        const p = processes[i];
 
        if (isNaN(p.pid) || p.pid <= 0)
            return `Process ${i + 1}: Invalid PID.`;
 
        if (isNaN(p.at) || p.at < 0)
            return `Process ${i + 1}: Arrival Time must be >= 0.`;
 
        if (isNaN(p.bt) || p.bt <= 0)
            return `Process ${i + 1}: Burst Time must be > 0.`;
 
        if (isNaN(p.pr) || p.pr < 1)
            return `Process ${i + 1}: Priority must be >= 1.`;
 
        if (pids.includes(p.pid))
            return `Duplicate PID found: ${p.pid}`;
 
        pids.push(p.pid);
    }
    return null;
}
 
 
async function runSimulation() {
    const n = parseInt(document.getElementById("num-processes").value);
    const errorDiv = document.getElementById("error-msg");
    errorDiv.textContent = "";
 
    // FIX 1: Guard against running before table is generated
    if (!document.getElementById("pid-0")) {
        errorDiv.textContent = "❌ Please generate the process table first.";
        return;
    }
 
    const processes = [];
    for (let i = 0; i < n; i++) {
        processes.push({
            pid: parseInt(document.getElementById(`pid-${i}`).value),
            at:  parseInt(document.getElementById(`at-${i}`).value),
            bt:  parseInt(document.getElementById(`bt-${i}`).value),
            pr:  parseInt(document.getElementById(`pr-${i}`).value),
        });
    }
 
    const err = validateInput(processes);
    if (err) {
        errorDiv.textContent = "❌ " + err;
        return;
    }
 
    let input = `${n}\n`;
    processes.forEach(p => {
        input += `${p.pid} ${p.at} ${p.bt} ${p.pr}\n`;
    });
 
    try {
        const response = await fetch("/run", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: input
        });
 
        if (!response.ok) throw new Error("Server error");
 
        const data = await response.json();
 
        if (data.error) {
            errorDiv.textContent = "❌ " + data.error;
            return;
        }
 
        displayResults(data, processes);
 
    } catch (e) {
        errorDiv.textContent = "❌ Could not connect to server. Make sure the backend is running.";
    }
}
 
 
function displayResults(data, processes) {
    document.getElementById("results-section").style.display = "block";
 
    renderGantt("gantt-priority", data.priority.gantt);
    renderGantt("gantt-srtf",     data.srtf.gantt);
 
    renderResultsTable("table-priority", data.priority);
    renderResultsTable("table-srtf",     data.srtf);
 
    renderComparison(data.priority, data.srtf);
    renderConclusion(data.priority, data.srtf);
 
    document.getElementById("results-section")
            .scrollIntoView({ behavior: "smooth" });
}
 
 
function renderGantt(containerId, gantt) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
 
    const wrapper     = document.createElement("div");
    wrapper.className = "gantt-wrapper";
 
    const blocksDiv     = document.createElement("div");
    blocksDiv.className = "gantt-blocks";
 
    const timesDiv     = document.createElement("div");
    timesDiv.className = "gantt-times";
 
    const firstStart = gantt[0].start;
    const lastEnd    = gantt[gantt.length - 1].end;
    const totalTime  = lastEnd - firstStart;
    const minWidth  = 54;
 
    gantt.forEach((block, i) => {
        const duration = block.end - block.start;
        const width    = Math.max(minWidth, (duration / totalTime) * 700);
        const isIdle   = block.pid === -1;
 
        const div       = document.createElement("div");
        div.className   = "gantt-block";
        div.style.width = width + "px";
        div.style.background = isIdle
            ? "#374151"
            : COLORS[(block.pid - 1) % COLORS.length];
        div.textContent = isIdle ? "IDLE" : `P${block.pid}`;
 
        // FIX 2: Correct tooltip for IDLE blocks
        div.title = isIdle
            ? `IDLE | Start: ${block.start} | End: ${block.end} | Duration: ${duration}`
            : `P${block.pid} | Start: ${block.start} | End: ${block.end} | Duration: ${duration}`;
 
        blocksDiv.appendChild(div);
 
        const timeLabel       = document.createElement("div");
        timeLabel.className   = "gantt-time-label";
        timeLabel.style.width = width + "px";
        timeLabel.textContent = block.start;
        timesDiv.appendChild(timeLabel);
 
        if (i === gantt.length - 1) {
            const lastLabel       = document.createElement("div");
            lastLabel.className   = "gantt-time-label";
            lastLabel.textContent = block.end;
            timesDiv.appendChild(lastLabel);
        }
    });
 
    wrapper.appendChild(blocksDiv);
    wrapper.appendChild(timesDiv);
    container.appendChild(wrapper);
}
 
 
function renderResultsTable(containerId, data) {
    const container = document.getElementById(containerId);
 
    let html = `
        <table>
            <thead>
                <tr>
                    <th>PID</th>
                    <th>Arrival Time</th>
                    <th>Burst Time</th>
                    <th>Priority</th>
                    <th>Waiting Time</th>
                    <th>Turnaround Time</th>
                    <th>Response Time</th>
                </tr>
            </thead>
            <tbody>
    `;
 
    data.processes.forEach(p => {
        html += `
            <tr>
                <td>P${p.pid}</td>
                <td>${p.at}</td>
                <td>${p.bt}</td>
                <td>${p.pr}</td>
                <td>${p.wt}</td>
                <td>${p.tat}</td>
                <td>${p.rt}</td>
            </tr>
        `;
    });
 
    html += `
            <tr class="avg-row">
                <td colspan="4">Averages</td>
                <td>${data.avg_wt}</td>
                <td>${data.avg_tat}</td>
                <td>${data.avg_rt}</td>
            </tr>
            </tbody>
        </table>
    `;
 
    container.innerHTML = html;
}
 
 
// FIX 3: Handle tie case in winner logic
function getWinner(pVal, sVal, label) {
    const p = parseFloat(pVal);
    const s = parseFloat(sVal);
    if (p < s)  return { winner: "Priority Scheduling", isTie: false };
    if (s < p)  return { winner: "SRTF",                isTie: false };
    return       { winner: label,                        isTie: true  };
}
 
 
function renderComparison(priority, srtf) {
    const container = document.getElementById("comparison");
 
    const metrics = [
        { label: "Avg Waiting Time",    p: priority.avg_wt,  s: srtf.avg_wt  },
        { label: "Avg Turnaround Time", p: priority.avg_tat, s: srtf.avg_tat },
        { label: "Avg Response Time",   p: priority.avg_rt,  s: srtf.avg_rt  },
    ];
 
    let html = `<div class="comparison-grid">
        <div class="comp-header">Metric</div>
        <div class="comp-header">Priority Scheduling</div>
        <div class="comp-header">SRTF</div>
    `;
 
    metrics.forEach(m => {
        const { winner, isTie } = getWinner(m.p, m.s, m.label);
 
        const pClass = isTie ? "tie" : (winner === "Priority Scheduling" ? "winner" : "loser");
        const sClass = isTie ? "tie" : (winner === "SRTF"                ? "winner" : "loser");
        const pBadge = isTie ? "🤝" : (winner === "Priority Scheduling" ? "🏆" : "");
        const sBadge = isTie ? "🤝" : (winner === "SRTF"                ? "🏆" : "");
 
        html += `
            <div class="comp-cell"><strong>${m.label}</strong></div>
            <div class="${pClass}">${m.p} ${pBadge}</div>
            <div class="${sClass}">${m.s} ${sBadge}</div>
        `;
    });
 
    html += `</div>`;
    container.innerHTML = html;
}
 
 
function renderConclusion(priority, srtf) {
    const container = document.getElementById("conclusion");
 
    const wtResult  = getWinner(priority.avg_wt,  srtf.avg_wt,  "Avg Waiting Time");
    const tatResult = getWinner(priority.avg_tat, srtf.avg_tat, "Avg Turnaround Time");
    const rtResult  = getWinner(priority.avg_rt,  srtf.avg_rt,  "Avg Response Time");
 
    const wtWinner  = wtResult.winner;
    const tatWinner = tatResult.winner;
    const rtWinner  = rtResult.winner;
 
    // FIX 4: Use scoring system across all 3 metrics
    let srtfScore     = 0;
    let priorityScore = 0;
 
    [wtWinner, tatWinner, rtWinner].forEach(w => {
        if (w === "SRTF")                srtfScore++;
        else if (w === "Priority Scheduling") priorityScore++;
    });
 
    let overall;
    if (srtfScore > priorityScore)      overall = "SRTF";
    else if (priorityScore > srtfScore) overall = "Priority Scheduling";
    else                                overall = "Both algorithms performed equally";
 
    const formatResult = (result, pVal, sVal) => {
        if (result.isTie) return `Tie (both: ${pVal})`;
        return `${result.winner} performed better (Priority: ${pVal} | SRTF: ${sVal})`;
    };
 
    container.innerHTML = `
        <div class="conclusion-box">
            <p>📌 <strong>Waiting Time:</strong>
               ${formatResult(wtResult, priority.avg_wt, srtf.avg_wt)}</p>
 
            <p>📌 <strong>Turnaround Time:</strong>
               ${formatResult(tatResult, priority.avg_tat, srtf.avg_tat)}</p>
 
            <p>📌 <strong>Response Time:</strong>
               ${formatResult(rtResult, priority.avg_rt, srtf.avg_rt)}</p>
 
            <p>⚖️ <strong>Main Trade-off:</strong>
               Priority Scheduling serves urgent processes first but may cause
               starvation for low-priority jobs. SRTF minimizes waiting time
               but may starve longer processes.</p>
 
            <p>🏆 <strong>Overall Recommendation:</strong>
               Based on the tested workload, <strong>${overall}</strong>
               showed better overall performance.</p>
 
            <p>🤝 <strong>Fairness:</strong>
               SRTF is generally fairer in terms of waiting time distribution,
               while Priority Scheduling is fairer when process urgency matters.</p>
        </div>
    `;
}
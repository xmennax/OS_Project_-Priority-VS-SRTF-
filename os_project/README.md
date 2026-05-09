# ⚙️ CPU Scheduling Simulator
## Priority Scheduling vs SRTF

**Operating Systems — Algorithm Comparison Project**

---

## 👥 Team Members

| # | Name | Student ID |
|---|------|------------|
| 1 | Jalal Ramadan Jalal | 20240234 |
| 2 | Zyad Ramadan Abd El-Karem | 20240378 |
| 3 | Mostafa Ashraf Zaher | 20240957 |
| 4 | Menna Mohamed Serag Elden | 20241021 |
| 5 | Mayar Mohamed Abd El-Hamed | 20241037 |
| 6 | Manar Abd El-Aal Selmy | 20241003 |

---

## 🚀 How to Run

### Requirements
- GCC compiler
- Python 3
- Any modern browser

### Steps

**1. Compile the C simulator:**
```bash
cd os_project
make
```

**2. Start the server:**
```bash
python3 server.py
```

**3. Open your browser and go to:**
```
http://localhost:8080
```

---

## 📋 Project Description

This project compares two preemptive CPU scheduling algorithms:

- **Priority Scheduling (Preemptive)** — always runs the highest-priority process first (lower number = higher priority); if a higher-priority process arrives at any point, it immediately preempts the currently running one
- **SRTF (Shortest Remaining Time First)** — always runs the process with the least remaining burst time; preempts the current process if a newly arrived process has a shorter remaining time

The goal is to compare urgency-based scheduling (Priority) against wait-time minimization (SRTF), and analyze the trade-offs between them.

---

## 🛠️ Implementation Technology

- **Scheduling Logic:** C
- **Backend Server:** Python 3
- **GUI & Visualization:** HTML + CSS + JavaScript (Browser-based)

---

## 📁 Project Structure

```
os_project/
├── src/
│   ├── process.h         → Process struct definition
│   ├── main.c            → Entry point & input parsing
│   ├── validation.h/c    → Input validation logic
│   ├── priority.h/c      → Preemptive Priority algorithm
│   ├── srtf.h/c          → SRTF algorithm
│   └── metrics.h/c       → WT, TAT, RT calculations
├── screenshots/          → UI and Gantt chart screenshots
├── test-cases/           → Documented test scenarios
├── simulator             → Compiled C binary (after make)
├── server.py             → Python HTTP backend
├── index.html            → Main UI page
├── style.css             → Styling
├── app.js                → Frontend logic
├── Makefile              → Build instructions
└── README.md             → This file
```

---

## 🖥️ Interface Sections

- **Load Scenario** — Quick-load buttons for all 4 test scenarios
- **Input Panel** — Enter number of processes and their data
- **Gantt Chart (Priority)** — Execution timeline for Priority Scheduling
- **Gantt Chart (SRTF)** — Execution timeline for SRTF
- **Results Table (Priority)** — WT, TAT, RT per process + averages
- **Results Table (SRTF)** — WT, TAT, RT per process + averages
- **Comparison Summary** — Side-by-side comparison with winner highlight
- **Final Conclusion** — Automatic analysis and recommendation

---

## ✅ Input Validation

The simulator rejects any invalid input:
- Negative Arrival Time
- Zero or negative Burst Time
- Priority less than 1
- Duplicate Process IDs
- Running simulation before generating the table

---

## 🧪 Test Scenarios

| Scenario | Description |
|----------|-------------|
| A — Basic Mixed Workload | Multiple processes with different arrival times and burst times |
| B — Priority vs Burst Conflict | A high-priority long process vs a low-priority short process to highlight algorithm differences |
| C — Starvation Sensitive | A low-priority process gets repeatedly preempted by higher-priority arrivals |
| D — Invalid Input Validation | Burst time = 0 to demonstrate safe handling of invalid input |

---

## 📊 Metrics Calculated

| Metric | Formula |
|--------|---------|
| Turnaround Time (TAT) | Completion Time − Arrival Time |
| Waiting Time (WT) | TAT − Burst Time |
| Response Time (RT) | First CPU Time − Arrival Time |

---

## ⚠️ Project-Specific Notes

- Both algorithms are **preemptive** — a higher-priority or shorter process always preempts the running one immediately
- Both algorithms run on the **same workload** for a fair comparison
- Tie-breaking in Priority: equal priority → earlier arrival time wins
- Tie-breaking in SRTF: equal remaining time → earlier arrival time wins
- **IDLE slots** appear in the Gantt chart when no process is available at a given time

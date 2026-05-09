# ⚙️ Priority Scheduling vs SRTF — CPU Scheduling Simulator

> Operating Systems Course | Algorithm Comparison Project

---

## 📌 Project Description

This project implements and compares two CPU scheduling algorithms:

- **Priority Scheduling** — selects the process with the highest priority (lowest number). Non-preemptive: the selected process runs to full completion before re-evaluation. Tie-breaking: earlier arrival time wins.
- **SRTF (Shortest Remaining Time First)** — always runs the process with the least remaining burst time. Fully preemptive: a newly arrived shorter job immediately takes the CPU.

The simulator runs both algorithms on the same input and displays:
- Gantt Charts for each algorithm
- Per-process metrics: WT, TAT, RT
- Average WT, TAT, RT
- Comparison summary and final conclusion

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

## 🛠️ Technology Stack

| Component        | Technology                          |
|-----------------|-------------------------------------|
| Scheduling Logic | C language (compiled to binary)     |
| Web Server       | Python 3 (server.py)                |
| GUI              | HTML5 + CSS3 + Vanilla JavaScript   |
| Build System     | GNU Make                            |

---

## 📁 Project Structure

```
project-root/
├── src/
│   ├── process.h        # Process data structure
│   ├── priority.c/.h    # Priority Scheduling algorithm
│   ├── srtf.c/.h        # SRTF algorithm
│   ├── metrics.c/.h     # WT / TAT / RT calculations
│   ├── validation.c/.h  # Input validation
│   └── main.c           # Entry point
├── index.html           # GUI layout
├── app.js               # Frontend logic & rendering
├── style.css            # Styling
├── server.py            # Python HTTP server (bridge)
├── simulator            # Compiled binary
├── Makefile             # Build rules
└── README.md
```

---

## 🚀 How to Run

### Step 1 — Build the C simulator

```bash
make
```

This compiles all `.c` files and produces the `simulator` binary.

### Step 2 — Start the Python server

```bash
python3 server.py
```

The server listens on `http://localhost:8000` and bridges the GUI with the simulator.

### Step 3 — Open the GUI

Open your browser and go to:

```
http://localhost:8000
```

Or simply open `index.html` directly in your browser if the server is already running.

### Step 4 — Run a Simulation

1. Enter the number of processes
2. Click **Generate Table**
3. Fill in PID, Arrival Time, Burst Time, and Priority for each process
4. Click **▶ Run Simulation**

---

## ✅ Input Rules

| Field        | Rule                        |
|--------------|-----------------------------|
| PID          | Positive integer, unique     |
| Arrival Time | Integer >= 0                 |
| Burst Time   | Integer > 0 (required)       |
| Priority     | Integer >= 1 (lower = higher priority) |
| Processes    | Between 1 and 20             |

---

## 🧪 Test Scenarios

### Scenario A — Basic Mixed Workload
Normal workload with different arrival and burst times.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| 1   | 0  | 6  | 2        |
| 2   | 1  | 4  | 1        |
| 3   | 3  | 8  | 3        |
| 4   | 5  | 2  | 2        |

---

### Scenario B — Priority vs Burst Time Conflict
A high-priority long process competes with short low-priority processes.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| 1   | 0  | 12 | 1        |
| 2   | 0  | 3  | 3        |
| 3   | 0  | 2  | 2        |
| 4   | 1  | 1  | 3        |

---

### Scenario C — Starvation-Sensitive Case
A low-priority process may wait a long time due to continuously arriving higher-priority processes.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| 1   | 0  | 5  | 3        |
| 2   | 0  | 3  | 1        |
| 3   | 2  | 1  | 1        |
| 4   | 4  | 7  | 2        |
| 5   | 6  | 2  | 3        |

---

### Scenario D — Invalid Input (Validation)
Used to verify that the system correctly rejects bad input.

| Test        | Invalid Value       | Expected Error                        |
|-------------|---------------------|---------------------------------------|
| Negative AT | Arrival Time = -3   | "Arrival Time must be >= 0"           |
| Zero BT     | Burst Time = 0      | "Burst Time must be > 0"              |
| Duplicate   | Two processes PID=1 | "Duplicate PID found: 1"              |
| Empty field | Burst Time blank    | "Burst Time must be > 0"              |

---

## 📊 Metrics Calculated

| Metric               | Formula     |
|----------------------|-------------|
| Turnaround Time (TAT)| CT − AT     |
| Waiting Time (WT)    | TAT − BT    |
| Response Time (RT)   | First CPU − AT |
| Average WT/TAT/RT    | Σ / n       |

---

## ⚖️ Algorithm Comparison Summary

| Property            | Priority Scheduling         | SRTF                        |
|---------------------|-----------------------------|-----------------------------|
| Scheduling basis    | Priority number             | Remaining burst time        |
| Preemption          | Non-preemptive              | Fully preemptive (per tick) |
| Avg Waiting Time    | Higher                      | Lower                       |
| Avg Response Time   | Higher                      | Lower                       |
| Starvation risk     | Low-priority processes      | Long processes              |
| Best use case       | Real-time / policy-driven   | Batch / throughput          |

---

## 📝 Notes

- Priority rule: **lower number = higher priority**
- Tie-breaking in Priority: earlier arrival time wins
- Tie-breaking in SRTF: earlier arrival time wins
- SRTF preempts immediately when a shorter job arrives
- The simulator outputs results as JSON; the GUI parses and renders them

---

*Operating Systems Course — Scheduling Comparison Project*


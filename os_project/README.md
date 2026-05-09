# CPU Scheduling Simulator

## Priority Scheduling vs SRTF

Operating Systems Course | Algorithm Comparison Project

---

## Project Description

This project implements and compares two CPU scheduling algorithms:

- **Priority Scheduling** — selects the process with the highest priority (lowest number). Non-preemptive: runs to full completion. Tie-breaking: earlier arrival time wins.
- **SRTF (Shortest Remaining Time First)** — always runs the process with the least remaining burst time. Fully preemptive: a newly arrived shorter job immediately takes the CPU.

The simulator runs both algorithms on the same input and displays:

- Gantt Charts for each algorithm
- Per-process metrics: WT, TAT, RT
- Average WT, TAT, and RT
- Comparison summary and final conclusion

---

## Team Members

| No. | Student Name | Student ID | Contribution |
|-----|-------------|------------|--------------|
| 1   | Jalal Ramadan Jalal        | 20240234   |              |
| 2   | Zyad Ramadan Abd El-Karim  | 20240378   |              |
| 3   | Mostafa Ashraf Zaher       | 20240957   |              |
| 4   | Menna Mohamed Seraj El Din  | 20241021   |              |
| 5   | Mayar Mohamed Abd El-Hamed | 20241037   |              |
| 6   | Manar Abd El-Aal Selmy     | 20241003   |              |

---

## Technology Stack

| Component        | Technology                                              |
|-----------------|---------------------------------------------------------|
| Scheduling Logic | C language — compiled to native binary (simulator)     |
| Web Server       | Python 3 (server.py) — bridges GUI and simulator        |
| GUI              | HTML5 + CSS3 + Vanilla JavaScript (index.html, app.js) |
| Build System     | GNU Make (Makefile)                                     |

---

## Project Structure

```
project-root/
├── src/
│   ├── process.h        — Process data structure
│   ├── priority.c/.h    — Priority Scheduling algorithm
│   ├── srtf.c/.h        — SRTF algorithm
│   ├── metrics.c/.h     — WT / TAT / RT calculations
│   ├── validation.c/.h  — Input validation
│   └── main.c           — Entry point
├── index.html           — GUI layout
├── app.js               — Frontend logic & Gantt rendering
├── style.css            — Styling
├── server.py            — Python HTTP server
├── simulator            — Compiled binary
├── Makefile             — Build rules
└── README.md
```

---

## How to Run

**Step 1 — Build the C Simulator**

```bash
make clean && make
```

Compiles all `.c` source files and produces the `simulator` binary.

**Step 2 — Start the Python Server**

```bash
python3 server.py
```

Starts an HTTP server on `localhost:8000` that bridges the GUI and the simulator.

**Step 3 — Open the Browser**

```
http://localhost:8000
```

Or open `index.html` directly in your browser.

**Step 4 — Run a Simulation**

Enter number of processes → Generate Table → Fill PID, AT, BT, Priority → Click Run Simulation.

---

## Input Rules

| Field          | Rule                                              |
|----------------|---------------------------------------------------|
| PID            | Positive integer, must be unique                  |
| Arrival Time   | Integer >= 0                                      |
| Burst Time     | Integer > 0 (required — cannot be empty or zero) |
| Priority       | Integer >= 1 (lower value = higher priority)      |
| No. of Procs   | Between 1 and 20                                  |

---

## Test Scenarios

### Scenario A — Basic Mixed Workload

Normal workload with multiple processes and varied arrival and burst times.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| P1  | 0  | 6  | 2        |
| P2  | 1  | 4  | 1        |
| P3  | 3  | 8  | 3        |
| P4  | 5  | 2  | 2        |

- Validates standard scheduling with no pathological cases.
- Tests tie-breaking when two processes share the same priority.

---

### Scenario B — Priority vs Burst Time Conflict

A high-priority long process competes with short low-priority processes.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| P1  | 0  | 12 | 1        |
| P2  | 0  | 3  | 3        |
| P3  | 0  | 2  | 2        |
| P4  | 1  | 1  | 3        |

- Priority: P1 monopolizes CPU for 12 units before any short job runs.
- SRTF: P1 runs last because it is the longest job — priority is irrelevant.
- Demonstrates the largest metric difference between the two algorithms.

---

### Scenario C — Starvation-Sensitive Case

A low-priority process may wait a very long time when higher-priority processes keep arriving.

| PID | AT | BT | Priority |
|-----|----|----|----------|
| P1  | 0  | 5  | 3        |
| P2  | 0  | 3  | 1        |
| P3  | 2  | 1  | 1        |
| P4  | 4  | 7  | 2        |
| P5  | 6  | 2  | 3        |

- P1 (priority 3) waits 11 units in Priority Scheduling — starvation risk.
- SRTF limits P1 to 6 units of waiting by only deferring it for shorter jobs.

---

### Scenario D — Validation / Invalid Input

Verifies that the system correctly rejects malformed input without crashing.

| Test Case     | Invalid Value         | Expected Error Message    |
|---------------|-----------------------|---------------------------|
| Negative AT   | Arrival Time = -3     | Arrival Time must be >= 0 |
| Zero BT       | Burst Time = 0        | Burst Time must be > 0    |
| Duplicate PID | Two processes PID = 1 | Duplicate PID found: 1    |
| Empty field   | Burst Time blank      | Burst Time must be > 0    |

---

## Metrics Calculated

| Metric                | Formula        | Description                           |
|-----------------------|----------------|---------------------------------------|
| Turnaround Time (TAT) | CT - AT        | Total time from arrival to completion |
| Waiting Time (WT)     | TAT - BT       | Time spent waiting in the ready queue |
| Response Time (RT)    | First CPU - AT | Delay before the first CPU access     |
| Average WT / TAT / RT | Sum / n        | Overall scheduling efficiency         |

> CT = Completion Time | AT = Arrival Time | BT = Burst Time | n = number of processes

---

## Algorithm Comparison Summary

| Property           | Priority Scheduling       | SRTF                        |
|--------------------|---------------------------|-----------------------------|
| Scheduling basis   | Priority number           | Remaining burst time        |
| Preemption         | Non-preemptive            | Fully preemptive (per tick) |
| Avg Waiting Time   | Higher                    | Lower                       |
| Avg Response Time  | Higher                    | Lower                       |
| Starvation risk    | Low-priority processes    | Long processes              |
| Best use case      | Real-time / policy-driven | Batch / throughput          |

---

## Important Notes

- Priority rule: lower number = higher priority
- Tie-breaking in Priority Scheduling: earlier arrival time wins
- Tie-breaking in SRTF: earlier arrival time wins when remaining times are equal
- SRTF preempts immediately when a shorter job arrives — even mid-execution
- The simulator outputs results as JSON; the GUI parses and renders them
- Both algorithms are tested on identical input for a fair comparison

---

*Operating Systems Course — Scheduling Comparison Project*

#include <stdio.h>
#include <string.h>
#include <limits.h>
#include "srtf.h"
#include "metrics.h"
void srtf_scheduling(Process *processes, int n) {
    Process proc[n];
    memcpy(proc, processes, n * sizeof(Process));
    for (int i = 0; i < n; i++) {
        proc[i].remaining_time = proc[i].burst_time;
        proc[i].first_run      = 0;
    }
    int gantt[10000];
    int gantt_time[10001];
    int gantt_size = 0;
    int current_time = 0;
    int completed    = 0;
    int prev         = -1;
    int idle_start   = -1;   /* track start of idle period */
    while (completed < n) {
        int selected   = -1;
        int min_remain = INT_MAX;

        for (int i = 0; i < n; i++) {
            if (proc[i].remaining_time <= 0) continue;
            if (proc[i].arrival_time > current_time) continue;

            if (proc[i].remaining_time < min_remain) {
                min_remain = proc[i].remaining_time;
                selected   = i;
            }
            else if (proc[i].remaining_time == min_remain &&
                     proc[i].arrival_time < proc[selected].arrival_time) {
                selected = i;
            }
        }

        /* CPU idle: record start of idle period once */
        if (selected == -1) {
            if (idle_start == -1) idle_start = current_time;
            current_time++;
            prev = -1;
            continue;
        }

        /* Coming out of idle: flush the idle slot */
        if (idle_start != -1) {
            gantt[gantt_size]          = -1;
            gantt_time[gantt_size]     = idle_start;
            gantt_time[gantt_size + 1] = current_time;
            gantt_size++;
            idle_start = -1;
            prev = -1;
        }

        if (proc[selected].first_run == 0) {
            proc[selected].response_time = current_time;
            proc[selected].first_run     = 1;
        }

        /* New process (or returning after idle): open a new gantt slot */
        if (selected != prev) {
            /* close previous slot */
            if (gantt_size > 0)
                gantt_time[gantt_size] = current_time;
            gantt[gantt_size]          = proc[selected].pid;
            gantt_time[gantt_size]     = current_time;
            gantt_size++;
            prev = selected;
        }

        proc[selected].remaining_time--;
        current_time++;

  
        if (proc[selected].remaining_time == 0) {
            proc[selected].completion_time = current_time;
            completed++;
        }
    }

    
    gantt_time[gantt_size] = current_time;

    
    calculate_metrics(proc, n);
     printf(",\"srtf\": {");
    printf("\"gantt\": [");
    for (int i = 0; i < gantt_size; i++) {
        printf("{\"pid\": %d, \"start\": %d, \"end\": %d}",
               gantt[i], gantt_time[i], gantt_time[i+1]);
        if (i < gantt_size - 1) printf(",");
    }
    printf("],");

    printf("\"processes\": [");
    for (int i = 0; i < n; i++) {
        printf("{\"pid\": %d, \"at\": %d, \"bt\": %d, \"pr\": %d,"
               "\"wt\": %d, \"tat\": %d, \"rt\": %d}",
               proc[i].pid, proc[i].arrival_time, proc[i].burst_time,
               proc[i].priority, proc[i].waiting_time,
               proc[i].turnaround_time, proc[i].response_time);
        if (i < n - 1) printf(",");
    }

    float twt = 0, ttat = 0, trt = 0;
    for (int i = 0; i < n; i++) {
        twt  += proc[i].waiting_time;
        ttat += proc[i].turnaround_time;
        trt  += proc[i].response_time;
    }
    printf("],\"avg_wt\": %.2f, \"avg_tat\": %.2f, \"avg_rt\": %.2f}}",
           twt/n, ttat/n, trt/n);
}
void print_gantt_srtf(int *gantt, int *gantt_time, int size) {
    printf("\nGantt Chart:\n");
    printf("+");
    for (int i = 0; i < size; i++) printf("------+");
    printf("\n|");

    for (int i = 0; i < size; i++) {
        if (gantt[i] == -1)
            printf(" IDLE |");
        else
            printf(" P%-3d |", gantt[i]);
    }
    printf("\n+");
    for (int i = 0; i < size; i++) printf("------+");
    printf("\n");
    for (int i = 0; i <= size; i++) printf("%-7d", gantt_time[i]);
    printf("\n");
}
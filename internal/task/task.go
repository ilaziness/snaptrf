package task

import (
	"context"
	"log/slog"
	"time"

	"snaptrf/pkg/goroutine"
)

type Job interface {
	Execute() error
}

type JobWork struct {
	ExecTime time.Time
	Job      Job
}

type Task struct {
	JobList []*JobWork
}

var Tasker *Task

func init() {
	Tasker = &Task{
		JobList: make([]*JobWork, 0),
	}
}

func (t *Task) Start(ctx context.Context) {
	goroutine.RunWithRecovery(ctx, func() {
		tk := time.NewTicker(time.Second)
		for {
			select {
			case <-tk.C:
				t.runJob()
			case <-ctx.Done():
				tk.Stop()
				return
			}
		}
	})
}

func (t *Task) AddJob(j Job, lifetime int) {
	t.JobList = append(t.JobList, &JobWork{
		ExecTime: time.Now().Add(time.Second * time.Duration(lifetime)),
		Job:      j,
	})
}

func (t *Task) runJob() {
	now := time.Now()
	jobList := make([]*JobWork, 0)
	for _, work := range t.JobList {
		if work.ExecTime.Compare(now) > 0 {
			jobList = append(jobList, work)
			continue
		}
		goroutine.RunWithRecovery(context.Background(), func() {
			err := work.Job.Execute()
			if err != nil {
				slog.Error(err.Error())
			}
		})
	}
	if len(jobList) != len(t.JobList) {
		t.JobList = jobList
	}
}

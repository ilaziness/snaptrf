package goroutine

import (
	"context"
	"fmt"
	"log/slog"
)

func RunWithRecovery(ctx context.Context, f func()) {
	go func(ctx context.Context, f func()) {
		defer func() {
			if err := recover(); err != nil {
				slog.ErrorContext(ctx, fmt.Sprintf("goroutine panic: %s", err))
			}
		}()
		f()
	}(ctx, f)
}

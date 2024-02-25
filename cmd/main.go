package main

import (
	"github.com/spf13/cobra"
	"snaptrf/cmd/snaptrf"
)

var rootCmd = &cobra.Command{Use: "snaptrf"}

func init() {
	rootCmd.AddCommand(snaptrf.SnapTRF)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		panic(err)
	}
}

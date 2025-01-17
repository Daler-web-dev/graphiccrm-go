package utils

import (
	"fmt"
	"os"
)

func Getenv(key, fallback string) string {
	value := os.Getenv(key)

	if len(value) == 0 {
		return fallback
	}

	return value
}

func GenerateTSVector(name, category string) string {
	return fmt.Sprintf("to_tsvector('english', '%s %s')", name, category)
}

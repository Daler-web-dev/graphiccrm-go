package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Product struct {
	ID         guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name       string     `json:"name"`
	Type       string     `json:"type"`            // "standard" or "non_standard"
	Unit       string     `json:"unit"`            // "unit" or "meter"
	Price      float64    `json:"price,omitempty"` // Price set by Super Admin if standard
	StockLevel int        `json:"stockLevel"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

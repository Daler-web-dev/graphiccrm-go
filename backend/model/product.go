package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Product struct {
	ID         guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name       string     `json:"name"`
	Type       string     `json:"type"`
	Unit       string     `json:"unit"`
	Price      float64    `json:"price,omitempty"`
	StockLevel int        `json:"stockLevel"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

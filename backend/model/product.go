package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Product struct {
	ID         guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name       string     `json:"name" validate:"required,min=3,max=100"`
	CategoryID string     `gorm:"type:uuid;not null" json:"categoryId" validate:"required,uuid"`
	Category   *Category  `gorm:"foreignKey:CategoryID" json:"category"`
	Price      float64    `json:"price,omitempty" validate:"gte=0"`
	Amount     float64    `json:"amount" validate:"required,gte=0"`
	Images     []string   `gorm:"type:text[]" json:"images" validate:"required,dive,url,min=1,max=10"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

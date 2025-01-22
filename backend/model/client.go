package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Client struct {
	ID              guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name            string     `json:"name" validate:"required" `
	Surname         string     `json:"surname" validate:"required" `
	Image           string     `json:"image" validate:"omitempty,min=5"`
	ContactInfo     string     `json:"contactInfo" validate:"omitempty"`
	Address         string     `json:"address"`
	Balance         int64      `json:"balance"`
	Note            string     `json:"note" validate:"omitempty"`
	SalespersonID   guuid.UUID `json:"salespersonId"`
	PurchaseHistory []Order    `gorm:"foreignKey:ClientID" json:"purchaseHistory"`
	SearchVector    string     `gorm:"type:tsvector" json:"-"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

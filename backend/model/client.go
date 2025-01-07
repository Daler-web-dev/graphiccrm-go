package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Client struct {
	ID              guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name            string     `json:"name" validate:"required" `
	Surname         string     `json:"surname" validate:"required" `
	ContactInfo     string     `json:"contactInfo" validate:"omitempty"`
	Address         string     `json:"address"`
	Balance         int64      `json:"balance"`
	Note            string     `json:"Note" validate:"omitempty"`
	SalespersonID   guuid.UUID `json:"salespersonId"`
	PurchaseHistory []Order    `gorm:"foreignKey:ClientID" json:"purchaseHistory"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

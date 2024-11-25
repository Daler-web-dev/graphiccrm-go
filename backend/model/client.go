package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Client struct {
	ID              guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name            string     `json:"name" validate:"required" `
	ContactInfo     string     `json:"contactInfo" validate:"required"`
	SalespersonID   guuid.UUID `json:"salespersonId"`
	PurchaseHistory []Order    `gorm:"foreignKey:ClientID" json:"purchaseHistory"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

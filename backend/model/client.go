package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Client struct {
	ID              guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name            string     `json:"name"`
	ContactInfo     string     `json:"contactInfo"`
	SalespersonID   guuid.UUID `json:"salespersonId"`
	Salesperson     User       `gorm:"foreignKey:SalespersonID;references:ID" json:"salesperson"`
	PurchaseHistory []Order    `gorm:"foreignKey:ClientID" json:"purchaseHistory"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

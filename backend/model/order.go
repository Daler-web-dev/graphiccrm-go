package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Order struct {
	ID            guuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	SalespersonID guuid.UUID  `json:"salespersonId"`
	Salesperson   User        `gorm:"foreignKey:SalespersonID"`
	ClientID      guuid.UUID  `json:"clientId"`
	Client        Client      `gorm:"foreignKey:ClientID"`
	Products      []OrderItem `gorm:"foreignKey:OrderID"`
	Status        string      `json:"status"`        // e.g., "pending", "in_production", "completed", "paid"
	PaymentMethod string      `json:"paymentMethod"` // "cash", "transfer", "credit"
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
}

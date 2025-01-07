package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Order struct {
	ID            guuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	SalespersonID guuid.UUID  `gorm:"type:uuid;not null;index" json:"salespersonId"`
	Salesperson   *User       `gorm:"foreignKey:SalespersonID" json:"salesperson"`
	ClientID      guuid.UUID  `gorm:"type:uuid;not null;index" validate:"required,uuid" json:"clientId"`
	Client        *Client     `gorm:"foreignKey:ClientID" validate:"-" json:"client"`
	Products      []OrderItem `gorm:"foreignKey:OrderID;" json:"products"`
	Status        string      `json:"status" gorm:"not null" validate:"required,oneof=pending in_production completed paid"`
	PaymentMethod string      `json:"paymentMethod" gorm:"not null" validate:"required,oneof=cash transfer credit"`
	TotalPrice    float64     `json:"totalPrice"`
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
}

package model

import guuid "github.com/google/uuid"

type OrderItem struct {
	ID        guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	OrderID   guuid.UUID `json:"orderId"`
	ProductID guuid.UUID `gorm:"type:uuid;not null" validate:"required,uuid" json:"productId"`
	Product   *Product   `gorm:"foreignKey:ProductID" json:"product"`
	Quantity  float64    `json:"quantity"`
	// Unit      string     `json:"unit" validate:"required, oneof=piece meter"`
	// PricePerUnit float64    `json:"pricePerUnit"`
	TotalPrice float64 `json:"totalPrice"`
}

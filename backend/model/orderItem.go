package model

import guuid "github.com/google/uuid"

type OrderItem struct {
	ID        guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	OrderID   guuid.UUID `json:"orderId"`
	Order     Order      `gorm:"foreignKey:OrderID"`
	ProductID guuid.UUID `json:"productId"`
	Product   Product    `gorm:"foreignKey:ProductID"`
	Quantity  int        `json:"quantity"`
}

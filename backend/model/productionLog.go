package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type ProductionLog struct {
	ID        guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ProductID guuid.UUID `gorm:"type:uuid;not null" json:"productId"`
	Product   *Product   `gorm:"foreignKey:ProductID" json:"product"`
	Quantity  float64    `json:"quantity"`
	CreatedAt time.Time  `json:"createdAt"`
}

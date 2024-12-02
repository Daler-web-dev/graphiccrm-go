package model

import (
	"time"

	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

type Category struct {
	ID        guuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string         `json:"name" validate:"required" `
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
}

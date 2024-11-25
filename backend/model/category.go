package model

import guuid "github.com/google/uuid"

type Category struct {
	ID   guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name string     `json:"name" validate:"required" `
}

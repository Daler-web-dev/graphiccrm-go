package model

import (
	"time"

	guuid "github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	ID           guuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	Name         string         `json:"name" validate:"required,min=3,max=100"`
	CategoryID   string         `gorm:"type:uuid;not null" json:"categoryId" validate:"required,uuid"`
	Category     *Category      `gorm:"foreignKey:CategoryID" json:"category"`
	Width        string         `json:"width" validate:"omitempty"`
	Height       string         `json:"height" validate:"omitempty"`
	Price        float64        `json:"price,omitempty" validate:"gte=0"`
	Unit         string         `json:"unit" validate:"required,oneof=piece meter"`
	Amount       float64        `json:"amount" validate:"required,gte=0"`
	Image        string         `json:"image" validate:"omitempty,min=5"`
	SearchVector string         `gorm:"type:tsvector" json:"-"`
	DeletedAt    gorm.DeletedAt `gorm:"index" swaggerignore:"true" json:"deleted_at"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
}

type CreateProductRequest struct {
	Name       string  `json:"name" validate:"required,min=3,max=100" example:"Example Product"`
	CategoryID string  `json:"categoryId" validate:"required,uuid" example:"123e4567-e89b-12d3-a456-426614174000"`
	Width      string  `json:"width" validate:"omitempty" example:"50"`
	Height     string  `json:"height" validate:"omitempty" example:"100"`
	Price      float64 `json:"price,omitempty" validate:"gte=0" example:"19.99"`
	Unit       string  `json:"unit" validate:"required,oneof=piece meter" example:"piece"`
	Amount     float64 `json:"amount" validate:"required,gte=0" example:"10"`
	Image      string  `json:"image" validate:"omitempty,min=5" example:"uploads/image.jpg"`
}

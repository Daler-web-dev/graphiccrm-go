package model

import (
	"time"

	guuid "github.com/google/uuid"
)

type Role string

const (
	AdminRole Role = "admin"
	Manager   Role = "manager"
	Seller    Role = "seller"
)

type User struct {
	ID        guuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Username  string     `json:"username"`
	Password  string     `json:"-"`
	Role      Role       `json:"role"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	Clients   []Client   `gorm:"foreignKey:SalespersonID" json:"clients"`
	Orders    []Order    `gorm:"foreignKey:SalespersonID" json:"orders"`
}

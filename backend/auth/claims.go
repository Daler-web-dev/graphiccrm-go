package auth

import (
	"backend/model"

	"github.com/dgrijalva/jwt-go"
	guuid "github.com/google/uuid"
)

type Claims struct {
	ID       guuid.UUID `json:"id"`
	Username string     `json:"username"`
	Role     model.Role `json:"role"`
	jwt.StandardClaims
}

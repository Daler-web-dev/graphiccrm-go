package utils

import (
	"backend/model"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecretKey = []byte(os.Getenv("jwt_secret"))

type Claims struct {
	Username string     `json:"username"`
	Role     model.Role `json:"role"`
	jwt.StandardClaims
}

func GenerateJWT(user model.User) (string, error) {
	// Создаем claims с полем ExpiresAt (exp), которое будет проверяться автоматически
	claims := &Claims{
		Username: user.Username,
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // Поле exp (стандартное для срока действия)
			IssuedAt:  time.Now().Unix(),                     // Поле iat
		},
	}

	// Создаем токен с claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}

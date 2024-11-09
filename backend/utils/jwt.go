package utils

import (
	"backend/model"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecretKey = []byte(os.Getenv("jwt_secret"))

type Claims struct {
	Username string `json:"username"`
	Role     model.Role
	jwt.StandardClaims
}

func GenerateJWT(user model.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   user.ID,
		"role": user.Role,
		"iat":  time.Now().Unix(),
		"eat":  time.Now().Add(time.Hour * 24).Unix(),
	})
	return token.SignedString(jwtSecretKey)
}

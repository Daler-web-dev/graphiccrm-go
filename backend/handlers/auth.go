package handlers

import (
	"backend/database"
	"backend/model"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var jwtSecretKey = []byte("your-secret-key")

type User model.User
type Claims struct {
	Username string `json:"username"`
	Role     model.Role
	jwt.StandardClaims
}

func Login(c *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	db := database.DB
	json := new(LoginRequest)

	if err := c.BodyParser(json); err != nil {
		return c.JSON(fiber.Map{
			"code":    400,
			"message": "Invalid JSON",
		})
	}

	found := User{}
	query := User{Username: json.Username}
	err := db.First(&found, &query).Error
	if err == gorm.ErrRecordNotFound {
		return c.JSON(fiber.Map{
			"code":    404,
			"message": "Username not found",
		})
	}
	if !comparePasswords(found.Password, []byte(json.Password)) {
		return c.JSON(fiber.Map{
			"code":    401,
			"message": "Invalid Password",
		})
	}

	// Create the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		Username: found.Username,
		Role:     found.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
		},
	})

	tokenString, err := token.SignedString(jwtSecretKey)

	if err != nil {
		return c.JSON(fiber.Map{
			"code":    500,
			"message": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"code":    200,
		"message": "success",
		"token":   tokenString,
	})
}

func comparePasswords(hashedPwd string, plainPwd []byte) bool {
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	return err == nil
}

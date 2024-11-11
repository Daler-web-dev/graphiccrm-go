package middleware

import (
	"backend/model"
	"crypto/subtle"
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// JWT Secret key
var jwtSecretKey = []byte(os.Getenv("jwt_secret"))

// Claims structure
type Claims struct {
	Username string `json:"username"`
	Role     model.Role
	jwt.StandardClaims
}

func ProtectRoute(requiredRole model.Role) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Unauthorized",
			})
		}

		// Split and validate header format
		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Invalid Authorization header format",
			})
		}

		// Token string with size check
		tokenString := headerParts[1]
		if len(tokenString) > 1024 {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Token too large",
			})
		}

		// Parse token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecretKey, nil
		})

		// Token validity and expiration check
		if err != nil || !token.Valid || claims.ExpiresAt < time.Now().Unix() {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Unauthorized",
			})
		}

		// Role check with constant-time comparison
		if requiredRole != "" && subtle.ConstantTimeCompare([]byte(claims.Role), []byte(requiredRole)) != 1 {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"code":    403,
				"message": "Insufficient role",
			})
		}

		// Store user claims in context
		c.Locals("user", claims)
		return c.Next()
	}
}

// // Example of a protected route
// func ProtectedRoute(c *fiber.Ctx) error {
// 	// Retrieve user info from context
// 	user := c.Locals("user").(*Claims)
// 	return c.JSON(fiber.Map{
// 		"code":    200,
// 		"message": "Success",
// 		"data":    user.Username,
// 	})
// }

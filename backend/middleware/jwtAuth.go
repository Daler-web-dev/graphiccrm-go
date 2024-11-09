package middleware

import (
	"backend/model"
	"errors"
	"net/http"
	"os"
	"strings"

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

// Middleware to check JWT and role
func ProtectRoute(requiredRole model.Role) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract token from Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Missing Authorization header",
			})
		}

		// Bearer token validation
		tokenString := strings.Split(authHeader, " ")[1]
		if tokenString == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Invalid token",
			})
		}

		// Parse and validate the token
		claims := &Claims{}
		_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Ensure token is signed with correct signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecretKey, nil
		})

		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"code":    401,
				"message": "Invalid or expired token",
			})
		}

		// Role check (if the user's role matches the required role)
		if requiredRole != "" && claims.Role != requiredRole {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"code":    403,
				"message": "Insufficient role",
			})
		}

		// Add claims to context
		c.Locals("user", claims)

		// Proceed to next handler
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

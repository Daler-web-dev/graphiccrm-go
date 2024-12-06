package handlers

import (
	"fmt"
	"log"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func UploadImage(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		log.Println("Error in uploading Image:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Server error",
		})
	}

	// Генерируем уникальное имя
	uniqueId := uuid.New()

	// Получаем расширение файла корректно
	fileExt := filepath.Ext(file.Filename)

	// Генерируем финальное имя файла
	image := fmt.Sprintf("%s%s", strings.Replace(uniqueId.String(), "-", "", -1), fileExt)

	// Сохраняем файл
	err = c.SaveFile(file, fmt.Sprintf("./uploads/%s", image))
	if err != nil {
		log.Println("Error in saving Image:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Server error",
		})
	}

	// Формируем URL
	imageUrl := fmt.Sprintf("uploads/%s", image)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"code":    201,
		"message": "Image uploaded successfully",
		"data": map[string]interface{}{
			"imageName": image,
			"imageUrl":  imageUrl,
		},
	})
}

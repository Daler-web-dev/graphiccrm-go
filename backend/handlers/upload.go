package handlers

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// UploadImage Загрузка одной картинки
// @Summary		Загрузка одной картинки
// @Description	Эта функция позволяет загружать одно изображение на сервер с проверкой размера и типа файла
// @Tags			Images
// @Accept			multipart/form-data
// @Produce		json
// @Param			image	formData	file					true	"Файл изображения"
// @Success		201		{object}	map[string]interface{}	"Информация о загруженном файле: имя и URL"
// @Failure		400		{object}	map[string]interface{}	"Неверный запрос или ошибка валидации"
// @Failure		500		{object}	map[string]interface{}	"Ошибка сервера при сохранении файла"
//
// @Router			/images/upload [post]
func UploadImage(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		log.Println("Error in uploading Image:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "Invalid file upload request",
		})
	}

	const maxFileSize = 5 * 1024 * 1024 // 5 MB
	if file.Size > maxFileSize {
		log.Println("File size exceeds limit:", file.Size)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "File size exceeds 5MB limit",
		})
	}

	// Проверяем расширение файла
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
	}
	fileExt := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedExtensions[fileExt] {
		log.Println("Invalid file extension:", fileExt)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "Invalid file type. Only .jpg, .jpeg, .png, .gif are allowed",
		})
	}

	// Генерируем уникальное имя файла
	uniqueId := uuid.New()
	image := fmt.Sprintf("%s%s", strings.Replace(uniqueId.String(), "-", "", -1), fileExt)

	// Проверяем наличие директории uploads и создаем при необходимости
	uploadPath := "./uploads"
	if _, err := os.Stat(uploadPath); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			log.Println("Error creating uploads directory:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"message": "Server error while creating upload directory",
			})
		}
	}

	// Сохраняем файл
	savePath := filepath.Join(uploadPath, image)
	err = c.SaveFile(file, savePath)
	if err != nil {
		log.Println("Error in saving Image:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  500,
			"message": "Server error while saving file",
		})
	}

	// Формируем URL
	imageUrl := fmt.Sprintf("uploads/%s", image)

	// Возвращаем ответ
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"message": "Image uploaded successfully",
		"data": map[string]interface{}{
			"imageName": image,
			"imageUrl":  imageUrl,
		},
	})
}

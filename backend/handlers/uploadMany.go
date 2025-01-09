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

//	@Summary		Загрузить несколько изображений
//	@Description	Эта функция позволяет загружать несколько изображений на сервер
//	@Tags			Images
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			images	formData	file					true	"Файлы изображений"	collectionFormat:	"multi"
//	@Success		201		{object}	map[string]interface{}	"Список загруженных файлов с их URL"
//	@Failure		400		{object}	map[string]interface{}	"Неверный запрос или ошибка валидации"
//	@Failure		500		{object}	map[string]interface{}	"Ошибка сервера при сохранении файла"
//
//	@Router			/uploadMany [post]
func UploadMany(c *fiber.Ctx) error {
	form, err := c.MultipartForm()
	if err != nil {
		log.Println("Error parsing form:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "Invalid file upload request",
		})
	}

	files := form.File["images"]
	if len(files) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  400,
			"message": "No files provided",
		})
	}

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

	var uploadedFiles []map[string]string

	for _, file := range files {
		allowedExtensions := map[string]bool{
			".jpg":  true,
			".jpeg": true,
			".png":  true,
			".gif":  true,
			".webp": true,
		}
		fileExt := strings.ToLower(filepath.Ext(file.Filename))
		if !allowedExtensions[fileExt] {
			log.Printf("Invalid file extension: %s\n", file.Filename)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  400,
				"message": fmt.Sprintf("Invalid file type for file: %s", file.Filename),
			})
		}

		uniqueId := uuid.New()
		imageName := fmt.Sprintf("%s%s", strings.Replace(uniqueId.String(), "-", "", -1), fileExt)

		savePath := filepath.Join(uploadPath, imageName)
		if err := c.SaveFile(file, savePath); err != nil {
			log.Println("Error saving file:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  500,
				"message": "Server error while saving file",
			})
		}

		uploadedFiles = append(uploadedFiles, map[string]string{
			"imageName": imageName,
			"imageUrl":  fmt.Sprintf("uploads/%s", imageName),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  201,
		"message": "Images uploaded successfully",
		"data":    uploadedFiles,
	})
}

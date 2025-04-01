package handlers

import (
	"backend/database"
	"backend/model"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm/clause"
)

// ExportProductsHandler Экспорт продуктов в Excel
//
//	@Summary		Экспорт продуктов в Excel
//	@Description	Эта функция позволяет экспортировать список продуктов в формате Excel
//	@Tags			Exports
//	@Produce		application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//	@Success		200	{file}		file					"Excel-файл с продуктами"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка при поиске продуктов"
//	@Router			/exports/products [get]
func ExportProductsHandler(ctx *fiber.Ctx) error {
	var products []model.Product
	if err := database.DB.Preload(clause.Associations).Find(&products).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	headers := []string{"Name", "Price", "Category", "Width", "Height", "Unit", "Amount"}
	fields := []string{"Name", "Price", "Category.Name", "Width", "Height", "Unit", "Amount"}
	return utils.ExportDataToExcel(ctx, products, headers, fields, "products.xlsx")
}

// ExportClientsHandler Экспорт клиентов в Excel
//
//	@Summary		Экспорт клиентов в Excel
//	@Description	Эта функция позволяет экспортировать список клиентов в формате Excel
//	@Tags			Exports
//	@Produce		application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//	@Success		200	{file}		file					"Excel-файл с клиентами"
//	@Failure		500	{object}	map[string]interface{}	"Ошибка при поиске клиентов"
//	@Router			/exports/clients [get]
func ExportClientsHandler(ctx *fiber.Ctx) error {
	var clients []model.Client
	if err := database.DB.Preload(clause.Associations).Find(&clients).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch clients",
		})
	}

	headers := []string{"Name", "Surname", "Contact-info", "Address", "Balance", "Registered"}
	fields := []string{"Name", "Surname", "ContactInfo", "Address", "Balance", "CreatedAt"}
	return utils.ExportDataToExcel(ctx, clients, headers, fields, "clients.xlsx")
}

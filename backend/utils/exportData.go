package utils

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
)

// ExportDataToExcel записывает данные из data в Excel.
// data — это срез структур (или срез любого типа), headers — список заголовков, fields — поля структур, filename — имя файла.
func ExportDataToExcel(ctx *fiber.Ctx, data interface{}, headers []string, fields []string, filename string) error {
	// Проверяем, что data является срезом
	val := reflect.ValueOf(data)
	if val.Kind() != reflect.Slice {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Data must be a slice",
		})
	}

	// Проверка на пустой срез
	if val.Len() == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Data is empty",
		})
	}

	// Создаем новый Excel-файл
	f := excelize.NewFile()
	sheetName := "Sheet1"
	f.SetSheetName("Sheet1", sheetName)

	// Записываем заголовки
	for i, header := range headers {
		col := getColumnName(i+1) + "1" // Генерация имени столбца
		if err := f.SetCellValue(sheetName, col, header); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).SendString("Failed to write headers")
		}
	}

	// Записываем данные
	for rowIndex := 0; rowIndex < val.Len(); rowIndex++ {
		rowVal := reflect.Indirect(val.Index(rowIndex))

		if rowVal.Kind() != reflect.Struct {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Data must be a slice of structs",
			})
		}

		for colIndex, fieldPath := range fields {
			fieldVal, err := getNestedFieldValue(rowVal, fieldPath)
			if err != nil {
				return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": fmt.Sprintf("Failed to get value for field '%s': %v", fieldPath, err),
				})
			}

			// Генерация имени ячейки
			cell := getColumnName(colIndex+1) + fmt.Sprintf("%d", rowIndex+2)

			// Запись значения в ячейку
			if err := f.SetCellValue(sheetName, cell, fieldVal.Interface()); err != nil {
				return ctx.Status(fiber.StatusInternalServerError).SendString("Failed to write cell value")
			}
		}
	}

	// Сохраняем файл в буфер
	buf, err := f.WriteToBuffer()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString("Failed to create Excel file")
	}

	// Устанавливаем заголовки для загрузки файла
	ctx.Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	ctx.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))

	// Отправляем файл
	return ctx.Send(buf.Bytes())
}

// getColumnName вычисляет название столбца Excel (например, A, B, ..., Z, AA, AB).
func getColumnName(n int) string {
	var colName []rune
	for n > 0 {
		n-- // Приведение индекса к 0
		colName = append([]rune{rune('A' + (n % 26))}, colName...)
		n /= 26
	}
	return string(colName)
}

func getNestedFieldValue(structValue reflect.Value, fieldPath string) (reflect.Value, error) {
	fields := strings.Split(fieldPath, ".")
	for _, field := range fields {
		structValue = reflect.Indirect(structValue)
		if structValue.Kind() == reflect.Struct {
			structValue = structValue.FieldByName(field)
			if !structValue.IsValid() {
				return reflect.Value{}, fmt.Errorf("field '%s' does not exist", fieldPath)
			}
		} else {
			return reflect.Value{}, fmt.Errorf("field '%s' is not a struct", fieldPath)
		}
	}
	return structValue, nil
}

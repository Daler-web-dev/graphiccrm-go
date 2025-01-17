package database

import (
	"backend/model"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() {
	var err error

	env := os.Getenv("DATABASE_URL")
	DB, err = gorm.Open(postgres.Open(env), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

	err = DB.AutoMigrate(&model.User{}, &model.Client{}, &model.Category{}, &model.Product{}, &model.Order{}, &model.OrderItem{})
	if err != nil {
		log.Fatal(err)
	}

	if err := SetupFullTextSearch(DB); err != nil {
		log.Fatal(err)
	}
}

func SetupFullTextSearch(db *gorm.DB) error {
	if err := db.Exec(`
    	DROP TRIGGER IF EXISTS products_search_vector_update ON products;
	`).Error; err != nil {
		return err
	}

	// 1) Создадим GIN-индекс на столбце search_vector
	if err := db.Exec(`
        CREATE INDEX IF NOT EXISTS idx_products_search
        ON products
        USING GIN (search_vector);
    `).Error; err != nil {
		return err
	}

	// 2) Создадим триггер, чтобы search_vector сам обновлялся на основе name и category
	if err := db.Exec(`
        CREATE TRIGGER products_search_vector_update
		BEFORE INSERT OR UPDATE ON products
		FOR EACH ROW
		EXECUTE PROCEDURE tsvector_update_trigger(
			search_vector,
			'pg_catalog.russian', 
			'name'
		);
    `).Error; err != nil {
		return err
	}

	return nil
}

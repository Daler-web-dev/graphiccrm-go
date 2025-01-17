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
	//--------------------------------
	// Настраиваем полнотекстовый поиск для products
	//--------------------------------

	// 1. Добавляем колонку search_vector в products, если её нет
	if err := db.Exec(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS search_vector tsvector
    `).Error; err != nil {
		return err
	}

	// 2. Создаём GIN-индекс, если его ещё нет
	if err := db.Exec(`
        CREATE INDEX IF NOT EXISTS idx_products_search
        ON products
        USING GIN (search_vector);
    `).Error; err != nil {
		return err
	}

	// 3. Удаляем триггер (если есть), чтобы избежать ошибки "already exists"
	if err := db.Exec(`
        DROP TRIGGER IF EXISTS products_search_vector_update ON products;
    `).Error; err != nil {
		return err
	}

	// 4. Создаём триггер заново
	if err := db.Exec(`
        CREATE TRIGGER products_search_vector_update
        BEFORE INSERT OR UPDATE ON products
        FOR EACH ROW
        EXECUTE PROCEDURE tsvector_update_trigger(
            search_vector,
            'pg_catalog.russian',  -- или 'simple', если не нужен стемминг
            'name'
        );
    `).Error; err != nil {
		return err
	}

	// 5. (Опционально) Обновляем search_vector для уже существующих products
	if err := db.Exec(`
        UPDATE products
        SET search_vector = to_tsvector('pg_catalog.russian', name);
    `).Error; err != nil {
		return err
	}

	//--------------------------------
	// Настраиваем полнотекстовый поиск для clients
	//--------------------------------

	// 1. Добавляем колонку search_vector в clients, если её нет
	if err := db.Exec(`
        ALTER TABLE clients 
        ADD COLUMN IF NOT EXISTS search_vector tsvector
    `).Error; err != nil {
		return err
	}

	// 2. Создаём GIN-индекс, если его ещё нет
	if err := db.Exec(`
        CREATE INDEX IF NOT EXISTS idx_clients_search
        ON clients
        USING GIN (search_vector);
    `).Error; err != nil {
		return err
	}

	// 3. Удаляем триггер (если есть), чтобы избежать ошибки "already exists"
	if err := db.Exec(`
        DROP TRIGGER IF EXISTS clients_search_vector_update ON clients;
    `).Error; err != nil {
		return err
	}

	// 4. Создаём триггер заново
	//    Допустим, вы хотите индексировать поля first_name, last_name, и, например, email
	if err := db.Exec(`
		CREATE TRIGGER clients_search_vector_update
		BEFORE INSERT OR UPDATE ON clients
		FOR EACH ROW
		EXECUTE PROCEDURE tsvector_update_trigger(
			search_vector,
			'pg_catalog.russian',
			'name',
			'surname',
			'address',
			'note',
			'contact_info'
		);
	`).Error; err != nil {
		return err
	}

	// 5. (Опционально) Обновляем search_vector для уже существующих клиентов
	if err := db.Exec(`
		UPDATE clients
		SET search_vector = to_tsvector('pg_catalog.russian', name || ' ' || surname || ' ' || address || ' ' || note || ' ' || contact_info);
	`).Error; err != nil {
		return err
	}

	return nil
}

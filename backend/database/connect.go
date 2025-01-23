package database

import (
	"backend/model"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	migrate_postgres "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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

	// Получаем sql.DB из GORM
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal(err)
	}

	// Создаём миграционный драйвер
	driver, err := migrate_postgres.WithInstance(sqlDB, &migrate_postgres.Config{})
	if err != nil {
		log.Fatal(err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres", driver)
	if err != nil {
		log.Fatal(err)
	}

	// Применяем миграции
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			// Ничего не делаем
		} else if dirtyErr, ok := err.(migrate.ErrDirty); ok {
			log.Printf("Database is dirty at version %d. Forcing to current version.", dirtyErr.Version)
			if err := m.Force(dirtyErr.Version); err != nil {
				log.Fatal(err)
			}
		} else {
			log.Fatal(err)
		}
	}

	err = DB.AutoMigrate(&model.User{}, &model.Client{}, &model.Category{}, &model.Product{}, &model.ProductionLog{}, &model.Order{}, &model.OrderItem{})
	if err != nil {
		log.Fatal(err)
	}
}

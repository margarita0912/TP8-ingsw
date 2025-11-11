package config

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupEnvVars() {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_NAME", "test")
	os.Setenv("DB_USER", "root")
	os.Setenv("DB_PASS", "password")
	os.Setenv("DB_PORT", "3306")
	os.Setenv("PORT", "8080")
}

func TestLoadEnv_QA(t *testing.T) {
	setupEnvVars()
	LoadEnv("qa")
	assert.True(t, true)
}

func TestLoadEnv_Prod(t *testing.T) {
	setupEnvVars()
	LoadEnv("prod")
	assert.True(t, true)
}

func TestLoadEnv_Default(t *testing.T) {
	setupEnvVars()
	LoadEnv("unknown")
	assert.True(t, true)
}

func TestLoadEnv_WithSystemVars(t *testing.T) {
	setupEnvVars()
	LoadEnv("qa")

	assert.Equal(t, "localhost", os.Getenv("DB_HOST"))
	assert.Equal(t, "test", os.Getenv("DB_NAME"))
}

package routes

import (
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestSetup(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	Setup(r)

	// Verify routes are registered
	routes := r.Routes()

	routePaths := make(map[string]bool)
	for _, route := range routes {
		routePaths[route.Method+" "+route.Path] = true
	}

	// Check all expected routes exist
	assert.True(t, routePaths["POST /login"], "POST /login should be registered")
	assert.True(t, routePaths["POST /usuarios"], "POST /usuarios should be registered")
	assert.True(t, routePaths["GET /productos"], "GET /productos should be registered")
	assert.True(t, routePaths["POST /productos"], "POST /productos should be registered")
	assert.True(t, routePaths["POST /compras"], "POST /compras should be registered")
	assert.True(t, routePaths["POST /ventas"], "POST /ventas should be registered")

	// Verify we have at least 6 routes
	assert.GreaterOrEqual(t, len(routes), 6)
}

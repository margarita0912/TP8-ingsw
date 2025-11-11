package middleware

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"ventas-app/utils"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestAuthRequired_NoToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin"), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "success"})
	})

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Token faltante")
}

func TestAuthRequired_InvalidTokenFormat(t *testing.T) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin"), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "success"})
	})

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	c.Request.Header.Set("Authorization", "InvalidFormat token")
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuthRequired_InvalidToken(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret")
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin"), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "success"})
	})

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	c.Request.Header.Set("Authorization", "Bearer invalid.token.here")
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Token inválido")
}

func TestAuthRequired_ValidToken_CorrectRole(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret")
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin"), func(c *gin.Context) {
		userID := c.GetUint("user_id")
		c.JSON(200, gin.H{"message": "success", "user_id": userID})
	})

	// Generate valid token
	token, _ := utils.GenerateToken(1, "admin")

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	c.Request.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "success")
}

func TestAuthRequired_ValidToken_WrongRole(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret")
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin"), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "success"})
	})

	// Generate valid token with wrong role
	token, _ := utils.GenerateToken(1, "vendedor")

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	c.Request.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "Acceso denegado")
}

func TestAuthRequired_MultipleRoles(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret")
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, r := gin.CreateTestContext(w)

	r.GET("/protected", AuthRequired("admin", "vendedor"), func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "success"})
	})

	// Generate valid token with one of the allowed roles
	token, _ := utils.GenerateToken(1, "vendedor")

	c.Request = httptest.NewRequest("GET", "/protected", nil)
	c.Request.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(w, c.Request)

	assert.Equal(t, http.StatusOK, w.Code)
}

package utils

import (
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestGenerateToken_Success(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	secret = []byte(os.Getenv("JWT_SECRET"))

	token, err := GenerateToken(1, "admin")

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestParseToken_Success(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	secret = []byte(os.Getenv("JWT_SECRET"))

	// Generate a valid token
	tokenString, _ := GenerateToken(123, "vendedor")

	// Parse it
	token, err := ParseToken(tokenString)

	assert.NoError(t, err)
	assert.NotNil(t, token)
	assert.True(t, token.Valid)

	// Verify claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		assert.Equal(t, float64(123), claims["user_id"])
		assert.Equal(t, "vendedor", claims["rol"])
	}
}

func TestParseToken_InvalidToken(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	secret = []byte(os.Getenv("JWT_SECRET"))

	token, err := ParseToken("invalid.token.here")

	assert.Error(t, err)
	// Token may be non-nil but invalid
	if token != nil {
		assert.False(t, token.Valid)
	}
}

func TestParseToken_ExpiredToken(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	secret = []byte(os.Getenv("JWT_SECRET"))

	// Create an expired token
	claims := jwt.MapClaims{
		"user_id": uint(1),
		"rol":     "admin",
		"exp":     time.Now().Add(-time.Hour).Unix(), // Expired 1 hour ago
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(secret)

	// Try to parse it
	parsedToken, err := ParseToken(tokenString)

	assert.Error(t, err)
	assert.NotNil(t, parsedToken) // Token object exists but is invalid
	assert.False(t, parsedToken.Valid)
}

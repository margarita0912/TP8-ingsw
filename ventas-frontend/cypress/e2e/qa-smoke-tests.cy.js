describe('QA Environment - Smoke Tests', () => {
  
  it('Debería cargar la página de login', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión', { timeout: 10000 }).should('be.visible')
    cy.get('input[placeholder*="Email"]').should('be.visible')
    cy.get('input[placeholder*="Password"]').should('be.visible')
    cy.get('button').contains('Ingresar').should('be.visible')
  })

  it('Debería poder hacer login con credenciales válidas', () => {
    cy.visit('/login')
    
    // Esperar que cargue
    cy.get('input[placeholder*="Email"]', { timeout: 10000 }).should('be.visible')
    
    // Ingresar credenciales de test
    cy.get('input[placeholder*="Email"]').type('admin@test.com')
    cy.get('input[placeholder*="Password"]').type('admin123')
    
    // Click en login
    cy.get('button').contains('Ingresar').click()
    
    // Verificar que redirija (puede ser a /productos o /ventas)
    cy.url({ timeout: 15000 }).should('not.include', '/login')
  })

  it('Debería cargar la página de productos', () => {
    // Primero login
    cy.visit('/login')
    cy.get('input[placeholder*="Email"]').type('admin@test.com')
    cy.get('input[placeholder*="Password"]').type('admin123')
    cy.get('button').contains('Ingresar').click()
    
    // Ir a productos
    cy.visit('/productos', { timeout: 15000 })
    
    // Verificar elementos básicos
    cy.contains('Productos', { timeout: 10000 }).should('be.visible')
  })

  it('Debería poder navegar a crear usuario', () => {
    // Login
    cy.visit('/login')
    cy.get('input[placeholder*="Email"]').type('admin@test.com')
    cy.get('input[placeholder*="Password"]').type('admin123')
    cy.get('button').contains('Ingresar').click()
    
    // Ir a crear usuario
    cy.visit('/crear-usuario', { timeout: 15000 })
    
    // Verificar formulario
    cy.contains('Crear Usuario', { timeout: 10000 }).should('be.visible')
  })

  it('Backend QA debería responder', () => {
    // Test del health check del backend
    const apiUrl = Cypress.env('apiUrl')
    cy.log(`Testing API at: ${apiUrl}`)
    
    cy.request({
      url: `${apiUrl}/productos`,
      failOnStatusCode: false,
      timeout: 15000
    }).then((response) => {
      // Backend puede responder 200 o 401 (sin auth), ambos son OK
      expect([200, 401]).to.include(response.status)
      cy.log(`✅ Backend responded with status ${response.status}`)
    })
  })
})

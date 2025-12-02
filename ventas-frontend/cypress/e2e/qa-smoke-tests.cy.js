describe('QA Environment - Smoke Tests', () => {
  
  it('Debería cargar la página de login', () => {
    cy.visit('/login')
    // Esperar a que el body cargue completamente
    cy.get('body', { timeout: 20000 }).should('be.visible')
    // Buscar el texto de forma más flexible (puede estar en h1, h2, etc)
    cy.contains(/iniciar sesión|login|ingresar/i, { timeout: 15000 }).should('be.visible')
    cy.get('input[type="email"], input[name*="email" i], input[placeholder*="email" i]', { timeout: 10000 }).should('be.visible')
    cy.get('input[type="password"], input[name*="password" i], input[placeholder*="password" i]').should('be.visible')
    cy.get('button[type="submit"], button').contains(/ingresar|login|entrar/i).should('be.visible')
  })

  it('Debería poder hacer login con credenciales válidas', () => {
    cy.visit('/login')
    
    // Esperar que cargue el formulario
    cy.get('input[type="email"], input[name*="email" i], input[placeholder*="email" i]', { timeout: 15000 }).should('be.visible')
    
    // Ingresar credenciales de test
    cy.get('input[type="email"], input[name*="email" i], input[placeholder*="email" i]').clear().type('admin@test.com')
    cy.get('input[type="password"], input[name*="password" i], input[placeholder*="password" i]').clear().type('admin123')
    
    // Click en login
    cy.get('button[type="submit"], button').contains(/ingresar|login|entrar/i).click()
    
    // Verificar que redirija (puede ser a /productos o /ventas) o que desaparezca el formulario de login
    cy.url({ timeout: 20000 }).should('not.include', '/login')
      .or(cy.contains(/iniciar sesión|login/i).should('not.exist'))
  })

  it('Debería cargar la página de productos', () => {
    // Primero login
    cy.visit('/login')
    cy.get('input[type="email"], input[name*="email" i], input[placeholder*="email" i]', { timeout: 15000 }).type('admin@test.com')
    cy.get('input[type="password"], input[name*="password" i], input[placeholder*="password" i]').type('admin123')
    cy.get('button[type="submit"], button').contains(/ingresar|login|entrar/i).click()
    
    // Esperar redirección
    cy.url({ timeout: 20000 }).should('not.include', '/login')
    
    // Ir a productos
    cy.visit('/productos', { timeout: 15000 })
    
    // Verificar elementos básicos (buscar de forma flexible)
    cy.get('body').should('contain.text', /productos/i)
  })

  it('Debería poder navegar a crear usuario', () => {
    // Login
    cy.visit('/login')
    cy.get('input[type="email"], input[name*="email" i], input[placeholder*="email" i]', { timeout: 15000 }).type('admin@test.com')
    cy.get('input[type="password"], input[name*="password" i], input[placeholder*="password" i]').type('admin123')
    cy.get('button[type="submit"], button').contains(/ingresar|login|entrar/i).click()
    
    // Esperar redirección
    cy.url({ timeout: 20000 }).should('not.include', '/login')
    
    // Ir a crear usuario
    cy.visit('/crear-usuario', { timeout: 15000 })
    
    // Verificar formulario (buscar de forma flexible)
    cy.get('body').should('contain.text', /crear usuario|nuevo usuario|registrar/i)
  })

  it('Backend QA debería responder', () => {
    // Test del health check del backend
    const apiUrl = Cypress.env('apiUrl')
    cy.log(`Testing API at: ${apiUrl}`)
    
    cy.request({
      url: `${apiUrl}/productos`,
      failOnStatusCode: false,
      timeout: 30000,
      retryOnStatusCodeFailure: true
    }).then((response) => {
      // Backend puede responder 200 o 401 (sin auth), ambos son OK
      expect([200, 401]).to.include(response.status)
      cy.log(`✅ Backend responded with status ${response.status}`)
    })
  })
})

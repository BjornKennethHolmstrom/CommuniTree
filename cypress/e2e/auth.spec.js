// cypress/integration/auth.spec.js

describe('Authentication', () => {
  it('should allow a user to register and login', () => {
    // Visit the registration page
    cy.visit('/register');

    // Fill out the registration form
    cy.get('input[name=username]').type('testuser');
    cy.get('input[name=email]').type('testuser@example.com');
    cy.get('input[name=password]').type('password123');
    cy.get('form').submit();

    // Check that we're redirected to the login page
    cy.url().should('include', '/login');

    // Fill out the login form
    cy.get('input[name=username]').type('testuser');
    cy.get('input[name=password]').type('password123');
    cy.get('form').submit();

    // Check that we're redirected to the dashboard
    cy.url().should('include', '/dashboard');

    // Check that the dashboard contains the user's name
    cy.contains('Welcome, testuser');
  });
});

// cypress/e2e/project.spec.js

describe('Project Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/login');
    cy.get('input[name=username]').type('testuser');
    cy.get('input[name=password]').type('password123');
    cy.get('form').submit();
  });

  it('should allow a user to create a project', () => {
    cy.visit('/projects/new');
    cy.get('input[name=title]').type('Test Project');
    cy.get('textarea[name=description]').type('This is a test project');
    cy.get('form').submit();

    cy.url().should('include', '/projects');
    cy.contains('Test Project');
  });

  it('should allow a user to edit a project', () => {
    cy.visit('/projects');
    cy.contains('Test Project').click();
    cy.get('a').contains('Edit').click();
    cy.get('input[name=title]').clear().type('Updated Test Project');
    cy.get('form').submit();

    cy.url().should('include', '/projects');
    cy.contains('Updated Test Project');
  });
});

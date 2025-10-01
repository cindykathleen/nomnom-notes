before(() => {
  // Check if we are using the test databases
  expect(Cypress.env('MONGODB_DBNAME_SUFFIX')).to.equal('_test');

  // Clear the databases before running tests
  cy.task('clearTestDbs');
})

describe('Sign-up page', () => {
  it('Successfully signs up a new user', () => {
    // Start at the home page and navigate to the sign-up page
    cy.visit('/')
    cy.contains('Get started').click()
    cy.url().should('include', '/sign-up')

    // Fill out the sign-up form
    cy.get('input[name="display-name"]').type('Test User')
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[id="password-confirmation"]').type('password123')

    // Verify the sign-up form
    cy.get('input[name="display-name"]').should('have.value', 'Test User')
    cy.get('input[name="email"]').should('have.value', 'test@test.com')
    cy.get('input[name="password"]').should('have.value', 'password123')
    cy.get('input[id="password-confirmation"]').should('have.value', 'password123')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/lists')
  })

  it('Displays error message for existing email', () => {
    // Start at the sign-up page
    cy.visit('/sign-up')

    // Fill out the sign-up form with an existing email
    cy.get('input[name="display-name"]').type('Test User')
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[id="password-confirmation"]').type('password123')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'User already exists')
  })
})
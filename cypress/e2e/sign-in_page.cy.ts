before(() => {
  // Check if we are using the test databases
  expect(Cypress.env('MONGODB_DBNAME_SUFFIX')).to.equal('_test');

  // Clear previous sessions
  cy.task('clearSessions');
})

describe('Sign-in page', () => {
  it('Unsuccessfully sign in with a non-existing account', () => {
    // Start at the sign-in page
    cy.visit('/sign-in')

    // Fill out the sign-up form
    cy.get('input[name="email"]').type('test1@test.com')
    cy.get('input[name="password"]').type('password123')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'Invalid email or password')
  })

  it('Unsuccessfully sign in the wrong password', () => {
    // Start at the sign-in page
    cy.visit('/sign-in')

    // Fill out the sign-up form
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password1234')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'Invalid email or password')
  })

  it('Successfully sign in with an existing account', () => {
    // Start at the sign-in page
    cy.visit('/sign-in')

    // Fill out the sign-up form
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password123')

    // Verify the sign-up form
    cy.get('input[name="email"]').should('have.value', 'test@test.com')
    cy.get('input[name="password"]').should('have.value', 'password123')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/lists')
  })
})
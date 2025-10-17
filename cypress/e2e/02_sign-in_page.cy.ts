import { fillSignInForm } from "../support/utils"

before(() => {
  // Check if we are using the test databases
  expect(Cypress.env('MONGODB_DBNAME_SUFFIX')).to.equal('_test');

  // Clear previous sessions
  cy.task('clearSessions')
})

beforeEach(() => {
  // Start at the sign-in page
  cy.visit('/sign-in');
})

describe('Sign-in page', () => {
  it('Unsuccessfully sign-in with a non-existing account', () => {
    // Fill out the sign-in form
    fillSignInForm({
      email: 'test1@test.com',
      password: 'password123'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'Invalid email or password')
  })

  it('Unsuccessfully sign-in the wrong password', () => {
    // Fill out the sign-in form
    fillSignInForm({
      email: 'test@test.com',
      password: 'password1234'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'Invalid email or password')
  })

  it('Successfully sign-in with an existing account', () => {
    // Fill out the sign-in form
    fillSignInForm({
      email: 'test@test.com',
      password: 'password123'
    })

    // Submit the form
    cy.intercept('POST', '/sign-in').as('signIn')
    cy.get('button[type="submit"]').click()
    cy.wait('@signIn')
    cy.url({ timeout: 10000 }).should('include', '/lists')

    // Reload and confirm the user is still logged in
    cy.reload()
    cy.url().should('include', '/lists')
  })
})
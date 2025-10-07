import { fillSignUpForm } from "../support/utils"

before(() => {
  // Check if we are using the test databases
  expect(Cypress.env('MONGODB_DBNAME_SUFFIX')).to.equal('_test')

  // Clear the databases before running tests
  cy.task('clearTestDbs')
})

beforeEach(() => {
  // Start at the sign-up page
  cy.visit('/sign-up')
})

describe('Sign-up page', () => {
  it('Unsuccessfully sign-up with an invalid email', () => {
    // Fill out the sign-up form
    fillSignUpForm({
      name: 'Test User',
      email: 'test',
      password: 'password123',
      passwordConfirmation: 'password123'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', "Invalid email address")
  })

  it('Unsuccessfully sign-up with a short password', () => {
    // Fill out the sign-up form
    fillSignUpForm({
      name: 'Test User',
      email: 'test@test.com',
      password: 'pass',
      passwordConfirmation: 'pass'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', "Password too short")
  })

  it('Successfully sign-up a new user', () => {
    // Fill out the sign-up form
    fillSignUpForm({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/lists')
  })

  it('Unsuccessfully sign-up with an existing email', () => {
    // Fill out the sign-up form
    fillSignUpForm({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    })

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('contain', 'User already exists')
  })
})
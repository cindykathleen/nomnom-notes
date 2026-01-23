import { fillSignUpForm } from "../support/utils"

before(() => {
  // Check if we are using the test databases
  expect(Cypress.env('MONGODB_DBNAME_SUFFIX')).to.equal('_test');

  // Clear the databases before running tests
  cy.task('clearTestDbs')
})

beforeEach(() => {
  // Start at the sign-up page
  cy.visit('/sign-up');
})

describe('Sign-up page', () => {
  it('Denied access to the sign-up form with an invalid access code', () => {
    // Enter an invalid access code
    cy.get('input[name="access-code"]').type('invalid')
    cy.get('button[type="submit"]').click()
    cy.get('h2').should('contain', 'Access denied')
  })

  it('Unsuccessfully sign-up with an invalid email', () => {
    // Enter the access code
    cy.get('input[name="access-code"]').type(Cypress.env('SIGNUP_ACCESS_SECRET'))
    cy.get('button[type="submit"]').click()

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
    // Enter the access code
    cy.get('input[name="access-code"]').type(Cypress.env('SIGNUP_ACCESS_SECRET'))
    cy.get('button[type="submit"]').click()

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
    // Enter the access code
    cy.get('input[name="access-code"]').type(Cypress.env('SIGNUP_ACCESS_SECRET'))
    cy.get('button[type="submit"]').click()

    // Fill out the sign-up form
    fillSignUpForm({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    })

    // Submit the form
    cy.intercept('POST', '/sign-up').as('signUp')
    cy.get('button[type="submit"]').click()
    cy.wait('@signUp')
    cy.url({ timeout: 10000 }).should('include', '/')
  })

  it('Unsuccessfully sign-up with an existing email', () => {
    // Enter the access code
    cy.get('input[name="access-code"]').type(Cypress.env('SIGNUP_ACCESS_SECRET'))
    cy.get('button[type="submit"]').click()

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
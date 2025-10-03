/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    signIn(email: string, password: string): Chainable<any>;
  }
}

Cypress.Commands.add('signIn', (email, password) => {
  cy.session(
    email,
    () => {
      cy.task('clearSessions');
      cy.visit('/sign-in')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(password)
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/lists')
    },
    {
      validate: () => {
        cy.getCookie('better-auth.session_token').should('exist')
      },
    }
  )
})
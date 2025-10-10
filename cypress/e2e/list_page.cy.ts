import { clickStar } from "../support/utils"

before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the lists page and click into a list
  cy.visit('/lists')
  cy.get('[data-cy=list]').click()
})

describe('List page', () => {
  it('Confirm list page', () => {
    cy.get('[data-cy=number-of-restaurants]').should('contain', '1 Place')
    cy.get('[data-cy=restaurant]').should('be.visible')
    cy.get('[data-cy=map-display]').should('be.visible')
  })

  it('Add review', () => {
    // Open the review modal
    cy.get('[data-cy=restaurant-menu-modal-trigger]').click()
    cy.get('[data-cy=restaurant-menu-modal]').should('be.visible')
    cy.get('[data-cy=review-restaurant-modal-trigger]').click()
    cy.get('[data-cy=review-restaurant-modal]').should('be.visible')

    // Fill out the review form
    clickStar(4, 'right');
    cy.get('textarea[name="restaurant-note"]').type('Great rice bowls.')

    // Submit the form
    cy.get('button[data-cy="add-review-submit"]').click()
    cy.get('[data-cy=restaurant]').find('p').should('contain.text', 'Great rice bowls.')
  })

  it('Delete restaurant', () => {
    // Open the delete modal
    cy.get('[data-cy=restaurant-menu-modal-trigger]').click()
    cy.get('[data-cy=restaurant-menu-modal]').should('be.visible')
    cy.get('[data-cy=delete-restaurant-modal-trigger]').click()
    cy.get('[data-cy=delete-restaurant-modal]').should('be.visible')

    // Delete the restaurant
    cy.get('[data-cy=delete-restaurant-button]').click()
    cy.get('[data-cy=restaurant]').should('not.exist')
  })
})
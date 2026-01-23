import { clickStar } from "../support/utils"

before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the lists page, click into a list, click into a restaurant
  cy.visit('/');
  cy.get('[data-cy=list]').click()
  cy.get('[data-cy=restaurant]').click()
})

describe('Restaurant page', () => {
  it('Confirm restaurant page', () => {
    cy.get('h2').should('contain.text', 'Dishes')
  })

  it('Create a dish', () => {
    // Open the add modal
    cy.get('[data-cy=add-dish-modal-trigger]').click()
    cy.get('[data-cy=add-dish-modal]').should('be.visible')

    // Fill out the add form
    cy.get('input[name="dish-name"]').type('Burrito bowl')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.get('[data-cy=dish]').should('be.visible')
    cy.get('[data-cy=dish]').find('h3').should('contain.text', 'Burrito bowl')
  })

  it('Update dish', () => {
    // Open the edit modal
    cy.get('[data-cy=dish-menu-modal-trigger]').click()
    cy.get('[data-cy=dish-menu-modal]').should('be.visible')
    cy.get('[data-cy=edit-dish-modal-trigger]').click()
    cy.get('[data-cy=edit-dish-modal]').should('be.visible')

    // Fill out the update form
    cy.get('input[name="img-url"]').clear().type('https://www.chipotle.com/content/dam/chipotle/menu/meal-types/burrito-bowl/web-mobile/order.png')

    // Submit the form
    cy.get('button[data-cy="edit-dish-submit"]').click()
  })

  it('Add review', () => {
    // Open the review modal
    cy.get('[data-cy=dish-menu-modal-trigger]').click()
    cy.get('[data-cy=dish-menu-modal]').should('be.visible')
    cy.get('[data-cy=review-dish-modal-trigger]').click()
    cy.get('[data-cy=review-dish-modal]').should('be.visible')

    // Fill out the review form
    cy.get('#dish-rating').trigger('mouseover')
    cy.get('[data-cy=rating-system]', { timeout: 10000 }).should('be.visible')
    clickStar(5, 'left')
    cy.get('textarea[name="dish-note"]')
      .type('Customization: chicken, white rice, pinto beans, fresh tomato salsa, roasted chili-corn salsa, tomatillo-green chili salsa, fajitas, lettuce')

    // Submit the form
    cy.get('button[data-cy="add-review-submit"]').click()
    cy.get('[data-cy=dish]').find('p')
      .should('contain.text', 'Customization: chicken, white rice, pinto beans, fresh tomato salsa, roasted chili-corn salsa, tomatillo-green chili salsa, fajitas, lettuce')
  })

  it('Delete dish', () => {
    // Open the delete modal
    cy.get('[data-cy=dish-menu-modal-trigger]').click()
    cy.get('[data-cy=dish-menu-modal]').should('be.visible')
    cy.get('[data-cy=delete-dish-modal-trigger]').click()
    cy.get('[data-cy=delete-dish-modal]').should('be.visible')

    // Delete the dish
    cy.get('[data-cy=delete-dish-button]').click()
    cy.get('[data-cy=dish]').should('not.exist')
  })
})
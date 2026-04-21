before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the lists page and click into a list
  cy.visit('/')
  cy.get('[data-cy=list]').click()
})

describe('Search feature', () => {
  it('Add a restaurant', () => {
    // Open the search bar
    cy.get('[data-cy=restaurant-add-trigger]').click()
    cy.get('[data-cy=restaurant-search]').should('be.visible')

    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald')
    cy.focused().type('{enter}')
    cy.url({ timeout: 10000 }).should('include', '?query=McDonald')
    cy.get('[data-cy=search-results]').should('be.visible')

    // Add the restaurant to a list
    cy.get('[data-cy=search-result-place]').eq(0).click()
    cy.get('[data-cy=search-result-confirmation]').should('be.visible')

    // Confirm the restaurant has been added to a list
    cy.visit('/');
    cy.get('[data-cy=list]').click()
    cy.get('[data-cy=restaurant]').should('contain', 'McDonald')
  })

  it('Search with a nonsense query', () => {
    // Open the search bar
    cy.get('[data-cy=restaurant-add-trigger]').click()
    cy.get('[data-cy=restaurant-search]').should('be.visible')

    // Fill out the search form
    cy.get('input[name="search-query"]').type('asdfasdfasdfasdf')
    cy.focused().type('{enter}')
    cy.url({ timeout: 10000 }).should('include', '?query=asdfasdfasdfasdf')

    // Confirm that an error message is shown
    cy.get('[data-cy=error-message]')
      .should('contain', 'No results found. Please try a different search query.')
  })

  it('Search when the user has already reached the rate limit', async () => {
    cy.task('addSearches')

    // Open the search bar
    cy.get('[data-cy=restaurant-add-trigger]').click()
    cy.get('[data-cy=restaurant-search]').should('be.visible')

    // Fill out the search form
    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald')
    cy.focused().type('{enter}')
    cy.url({ timeout: 10000 }).should('include', '?query=McDonald')

    // Confirm that an error message is shown
    cy.get('[data-cy=error-message]')
      .should('contain', 'You have exceeded your search rate limit. Please try again later.')
  })
})
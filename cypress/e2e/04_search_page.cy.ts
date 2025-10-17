before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the search page
  cy.visit('/search');
})

describe('Search page', () => {
  it('Test keyboard accessibility', () => {
    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald')

    // Submit the form via the 'enter' button on the keyboard
    cy.focused().type('{enter}');
    cy.url({ timeout: 10000 }).should('include', '?query=McDonald')
    cy.get('[data-cy=search-results]').should('be.visible')
  })

  it('Search for a restaurant and add it to a list', () => {
    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should('include', '?query=McDonald')
    cy.get('[data-cy=search-results]').should('be.visible')

    // Add the restaurant to a list
    cy.get('[data-cy=search-result-place]').eq(0).click()
    cy.get('[data-cy=search-result-list]').click()
    cy.get('[role="alert"]').should('contain', 'The restaurant has been added to the list')
    cy.get('[data-cy=search-result-confirmation]').click()

    // Confirm the restaurant has been added to a list
    cy.visit('/lists');
    cy.get('[data-cy=list]').click()
    cy.get('[data-cy=restaurant]').should('contain', 'McDonald')
  })

  it('Search with a nonsense query', () => {
    // Fill out the search form
    cy.get('input[name="search-query"]').type('asdfasdfasdfasdf')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should('include', '?query=asdfasdfasdfasdf')
    cy.get('[data-cy=error-message]')
      .should('contain', 'No results found. Please try a different search query.')
  })

  it('Search when the user has already reached the rate limit', async () => {
    cy.task('addSearches')

    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald')

    // Submit the form
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should('include', '?query=McDonald')
    cy.get('[data-cy=error-message]')
      .should('contain', 'You have exceeded your search rate limit. Please try again later.')
  })
})
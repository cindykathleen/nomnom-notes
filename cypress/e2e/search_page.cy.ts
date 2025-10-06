before(() => {
  cy.signIn('test@test.com', 'password123');
  cy.task('clearData');
  cy.task('db:seed');
})

describe('Search page', () => {
  it('Search for a restaurant', () => {
    // Start at the search page
    cy.visit('/search');

    // Fill out the search form
    cy.get('input[name="search-query"]').type('McDonald');

    // Submit the form
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '?query=McDonald');
    cy.get('[data-cy=search-results]').should('be.visible');

    // Add the place to list
    cy.get('[data-cy=search-result-place]').eq(0).click();
    cy.get('[data-cy=search-result-list]').click();
    cy.get('[role="alert"]').should('contain', 'The restaurant has been added to the list');
    cy.get('[data-cy=search-result-confirmation]').click();
  })
})
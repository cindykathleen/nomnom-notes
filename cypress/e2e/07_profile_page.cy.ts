before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')

  // Start at the lists page, click into the profile page
  cy.visit('/')
  cy.get('[data-cy=profile-button]').click()
  cy.get('[data-cy=view-profile-button]').click()
})

describe('Profile page', () => {
  it('Confirm profile privacy', () => {
    cy.task('addPrivateUser').then((privateUserId) => {
      cy.visit(`/profile/${privateUserId}`)
      cy.get('h1').should('contain.text', 'Private User')
      cy.get('[data-cy=profile-location]').should('not.exist')
      cy.get('[data-cy=follow-button]').should('be.visible')
      cy.get('[data-cy=profile-privacy-message]').should(
        'contain.text',
        'This user turned on their profile privacy. Please contact them for access.'
      )
      cy.get('[data-cy=profile-lists-count]').should('not.exist')
    })
  })

  it('Follow and unfollow private user', () => {
    cy.task('addPrivateUser').then((privateUserId) => {
      cy.visit(`/profile/${privateUserId}`)

      cy.get('[data-cy=follow-button]').click()
      cy.get('[data-cy=profile-location]').should('contain.text', 'San Jose, CA')
      cy.get('[data-cy=unfollow-button]').should('be.visible')
      cy.get('[data-cy=profile-privacy-message]').should('not.exist')

      cy.get('[data-cy=unfollow-button]').click()
      cy.get('[data-cy=follow-button]').should('be.visible')
      cy.get('[data-cy=profile-location]').should('not.exist')
      cy.get('[data-cy=profile-privacy-message]').should('be.visible')
    })
  })

  it('Confirm non-existent user', () => {
    cy.visit('/profile/does-not-exist')
    cy.get('h1').should('contain.text', 'Uh oh!')
    cy.get('p').should('contain.text', 'We are not able to find the user you are looking for. Please double-check the user ID and try again.')
  })
  
  it('Confirm profile page', () => {
    cy.get('h1').should('contain.text', 'Test User')
    cy.get('[data-cy=profile-lists-count]').should('contain.text', '1')
    cy.get('[data-cy=profile-restaurants-count]').should('contain.text', '1')
  })

  it('Edit profile', () => {
    cy.get('[data-cy=edit-profile-button]').click()
    cy.url().should('include', '/settings#profile')

    // Fill out the profile form
    cy.get('input[name="user-location"]').type('San Jose, CA')

    // Submit the form
    cy.get('button[data-cy="edit-profile-submit"]').click()

    // Confirm that the profile has been updated
    cy.get('[data-cy=profile-button]').click()
    cy.get('[data-cy=view-profile-button]').click()
    cy.get('[data-cy=profile-location]').should('contain.text', 'San Jose, CA')

    // Reset the user's location
    cy.get('[data-cy=edit-profile-button]').click()
    cy.get('input[name="user-location"]').clear()
    cy.get('button[data-cy="edit-profile-submit"]').click()
  })

  it('Edit email and password', () => {
    cy.get('[data-cy=edit-profile-button]').click()

    // Go to the email tab
    cy.get('[data-cy="tab-email"]').click()
    cy.url().should('include', '/settings#email')

    // Fill out the email form
    cy.get('input[name="user-email"]').type('edit@test.com')

    // Submit the form
    cy.get('button[data-cy="edit-email-submit"]').click()

    // Go to the password tab
    cy.get('[data-cy="tab-password"]').click()
    cy.url().should('include', '/settings#password')

    // Fill out the password form
    cy.get('input[name="current-password"]').type('password123')
    cy.get('input[name="new-password"]').type('edited123')
    cy.get('input[name="password-confirmation"]').type('edited123')

    // Submit the form
    cy.get('button[data-cy="edit-password-submit"]').click()

    // Sign out and sign in with the new credentials
    cy.get('[data-cy=profile-button]').click()
    cy.get('[data-cy=sign-out-button]').click()
    cy.signIn('edit@test.com', 'edited123')

    // Reset the user's email and password
    cy.visit('/')
    cy.get('[data-cy=profile-button]').click()
    cy.get('[data-cy=settings-button]').click()
    cy.get('[data-cy="tab-email"]').click()
    cy.get('input[name="user-email"]').type('test@test.com')
    cy.get('button[data-cy="edit-email-submit"]').click()
    cy.get('[data-cy="tab-password"]').click()
    cy.get('input[name="current-password"]').type('edited123')
    cy.get('input[name="new-password"]').type('password123')
    cy.get('input[name="password-confirmation"]').type('password123')
    cy.get('button[data-cy="edit-password-submit"]').click()
  })
})

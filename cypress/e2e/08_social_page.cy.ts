before(() => {
  cy.task('clearData')
  cy.task('db:seed')
})

beforeEach(() => {
  cy.signIn('test@test.com', 'password123')
  cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
    cy.task('resetUserSocial', testUserId)
  })
})

describe('Nav follower requests', () => {
  it('shows follower request and approve adds to followers', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/')
        cy.get('[data-cy=follow-requests-badge]').should('contain.text', '1')
        cy.get('[data-cy=follow-requests-nav-button]').click()
        cy.get('[data-cy=follow-requests-modal]').should('be.visible')
        cy.get(`[data-cy=follow-requests-modal] [data-cy=social-user-${requesterId}]`).should(
          'contain.text',
          'Private User'
        )
        cy.get('[data-cy=follow-requests-modal] [data-cy=approve-follow-request]').click()
        cy.get('[data-cy=follow-requests-modal] [data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=follow-requests-badge]').should('not.exist')

        cy.visit(`/profile/${testUserId}/social`)
        cy.get('[data-cy=followers-list]').should('contain.text', 'Private User')

        cy.task('removePrivateUser', requesterId)
      })
    })
  })

  it('deny removes follower request', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((requesterId) => {
        cy.task('requestFollow', { requesterId, followeeId: testUserId })

        cy.visit('/')
        cy.get('[data-cy=follow-requests-nav-button]').click()
        cy.get(`[data-cy=follow-requests-modal] [data-cy=social-user-${requesterId}]`).should(
          'be.visible'
        )
        cy.get('[data-cy=follow-requests-modal] [data-cy=deny-follow-request]').click()
        cy.get('[data-cy=follow-requests-modal] [data-cy=no-follow-requests]').should('be.visible')
        cy.get('[data-cy=follow-requests-badge]').should('not.exist')

        cy.visit(`/profile/${testUserId}/social`)
        cy.get('[data-cy=no-followers]').should('be.visible')

        cy.task('removePrivateUser', requesterId)
      })
    })
  })

  it('shows multiple requests in the modal newest first', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((firstRequesterId) => {
        cy.task('addFeedActor', { name: 'Second Requester' }).then((secondRequesterId) => {
          cy.task('requestFollow', { requesterId: firstRequesterId, followeeId: testUserId })
          cy.task('requestFollow', { requesterId: secondRequesterId, followeeId: testUserId })

          cy.visit('/')
          cy.get('[data-cy=follow-requests-badge]').should('contain.text', '2')
          cy.get('[data-cy=follow-requests-nav-button]').click()
          cy.get('[data-cy=follow-requests-list]').should('be.visible')

          // Newest request is listed first ($addToSet order — second added is newest)
          cy.get('[data-cy=follow-requests-list] > div').eq(0).should(
            'have.attr',
            'data-cy',
            `social-user-${secondRequesterId}`
          )
          cy.get('[data-cy=follow-requests-list] > div').eq(1).should(
            'have.attr',
            'data-cy',
            `social-user-${firstRequesterId}`
          )

          cy.get(`[data-cy=follow-requests-modal] [data-cy=social-user-${secondRequesterId}] [data-cy=approve-follow-request]`).click()
          cy.get('[data-cy=follow-requests-badge]').should('contain.text', '1')
          cy.get(`[data-cy=follow-requests-modal] [data-cy=social-user-${secondRequesterId}]`).should(
            'not.exist'
          )
          cy.get(`[data-cy=follow-requests-modal] [data-cy=social-user-${firstRequesterId}]`).should(
            'be.visible'
          )

          cy.get('[data-cy=follow-requests-modal] [data-cy=approve-follow-request]').click()
          cy.get('[data-cy=follow-requests-modal] [data-cy=no-follow-requests]').should('be.visible')
          cy.get('[data-cy=follow-requests-badge]').should('not.exist')

          cy.task('removePrivateUser', firstRequesterId)
          cy.task('removeFeedActor', secondRequesterId)
        })
      })
    })
  })
})

describe('Profile social pages', () => {
  it('links hero counts to social tabs', () => {
    cy.task('getUserIdByEmail', 'test@test.com').then((testUserId) => {
      cy.task('addPrivateUser').then((otherUserId) => {
        cy.task('requestFollow', { requesterId: otherUserId, followeeId: testUserId })
        cy.visit('/')
        cy.get('[data-cy=follow-requests-nav-button]').click()
        cy.get('[data-cy=follow-requests-modal] [data-cy=approve-follow-request]').click()
        cy.get('[data-cy=follow-requests-modal] [data-cy=no-follow-requests]').should('be.visible')

        cy.visit(`/profile/${testUserId}`)
        cy.get('[data-cy=profile-followers-link]').should('contain.text', '1 follower').click()
        cy.url().should('include', `/profile/${testUserId}/social`)
        cy.url().should('include', '#followers')
        cy.get('[data-cy=tab-followers]').should('have.class', 'active')
        cy.get('[data-cy=followers-list]').should('contain.text', 'Private User')

        cy.visit(`/profile/${testUserId}`)
        cy.get('[data-cy=profile-following-link]').click()
        cy.url().should('include', `/profile/${testUserId}/social`)
        cy.url().should('include', '#following')
        cy.get('[data-cy=tab-following]').should('have.class', 'active')

        cy.task('removePrivateUser', otherUserId)
      })
    })
  })
})

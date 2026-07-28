const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

before(() => {
  cy.task('clearData');
  cy.task('db:seed');
});

describe('Social feed — signed out', () => {
  it('shows the landing page with no feed', () => {
    cy.task('clearSessions');
    cy.clearCookies();
    cy.visit('/');
    cy.contains('Your Personal Restaurant Journal').should('be.visible');
    cy.get('[data-cy=feed-list]').should('not.exist');
    cy.get('[data-cy=empty-feed]').should('not.exist');
  });
});

describe('Social feed — signed in', () => {
  let viewerId: string;
  const createdActorIds: string[] = [];

  beforeEach(() => {
    cy.signIn('test@test.com', 'password123');
    cy.task('clearActivities');
    cy.task('getUserIdByEmail', 'test@test.com').then((id) => {
      viewerId = id as string;
      cy.task('resetUserSocial', viewerId);
    });
  });

  afterEach(() => {
    createdActorIds.splice(0).forEach((actorId) => {
      cy.task('removeFeedActor', actorId);
    });
  });

  function addTrackedActor(options?: { name?: string }) {
    return cy.task('addFeedActor', options || null).then((actorId) => {
      createdActorIds.push(actorId as string);
      return actorId as string;
    });
  }

  it('shows only activities from followed users', () => {
    addTrackedActor({ name: 'Followed Actor' }).then((followedId) => {
      addTrackedActor({ name: 'Other Actor' }).then((otherId) => {
        cy.task('seedListForUser', { userId: followedId, name: 'Followed List' }).then(
          (followedListId) => {
            cy.task('seedListForUser', { userId: otherId, name: 'Other List' }).then(
              (otherListId) => {
                const now = Date.now();
                cy.task('seedFollowEdge', {
                  followerId: viewerId,
                  followeeId: followedId,
                });
                cy.task('seedActivities', [
                  {
                    userId: followedId,
                    type: 'LIST_CREATED',
                    listId: followedListId,
                    createdAt: new Date(now - MINUTE_MS).toISOString(),
                  },
                  {
                    userId: otherId,
                    type: 'LIST_CREATED',
                    listId: otherListId,
                    createdAt: new Date(now).toISOString(),
                  },
                ]);

                cy.visit('/');
                cy.get('[data-cy=feed-list]').should('be.visible');
                cy.get('[data-cy=feed-activity-text]').should('have.length', 1);
                cy.get('[data-cy=feed-activity-text]').should('contain.text', 'Followed List');
                cy.get('[data-cy=feed-activity-text]').should('not.contain.text', 'Other List');
              }
            );
          }
        );
      });
    });
  });

  it('orders activities newest first', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Oldest List' }).then((oldestId) => {
        cy.task('seedListForUser', { userId: actorId, name: 'Middle List' }).then((middleId) => {
          cy.task('seedListForUser', { userId: actorId, name: 'Newest List' }).then((newestId) => {
            const now = Date.now();
            cy.task('seedActivities', [
              {
                userId: actorId,
                type: 'LIST_CREATED',
                listId: oldestId,
                createdAt: new Date(now - 3 * HOUR_MS).toISOString(),
              },
              {
                userId: actorId,
                type: 'LIST_CREATED',
                listId: middleId,
                createdAt: new Date(now - 2 * HOUR_MS).toISOString(),
              },
              {
                userId: actorId,
                type: 'LIST_CREATED',
                listId: newestId,
                createdAt: new Date(now - HOUR_MS).toISOString(),
              },
            ]);

            cy.visit('/');
            cy.get('[data-cy=feed-activity-text]').eq(0).should('contain.text', 'Newest List');
            cy.get('[data-cy=feed-activity-text]').eq(1).should('contain.text', 'Middle List');
            cy.get('[data-cy=feed-activity-text]').eq(2).should('contain.text', 'Oldest List');
          });
        });
      });
    });
  });

  it('loads ten items then loads more on scroll', () => {
    cy.viewport(1280, 500);
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Paged List' }).then((listId) => {
        const now = Date.now();
        const activities = Array.from({ length: 15 }, (_, index) => ({
          userId: actorId,
          type: 'LIST_CREATED',
          listId,
          createdAt: new Date(now - index * MINUTE_MS).toISOString(),
        }));

        cy.task('seedActivities', activities);
        cy.visit('/');
        cy.get('[data-cy=feed-list] .feed-item').should('have.length', 10);

        cy.get('[data-cy=feed-scroll-sentinel]').scrollIntoView();
        cy.get('[data-cy=feed-list] .feed-item', { timeout: 10000 }).should('have.length', 15);
      });
    });
  });

  it('shows empty feed when the viewer follows nobody', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedListForUser', { userId: actorId, name: 'Hidden List' }).then((listId) => {
        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: new Date().toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('[data-cy=empty-feed]').should('be.visible');
        cy.get('[data-cy=feed-list]').should('not.exist');
      });
    });
  });

  it('shows empty feed when followed users have no activities', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.visit('/');
      cy.get('[data-cy=empty-feed]').should('be.visible');
      cy.get('[data-cy=feed-list]').should('not.exist');
    });
  });

  it('renders a batched review as one feed row', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId }).then((listId) => {
        cy.task('seedRestaurantWithDishes', {
          listId,
          restaurantName: 'Heytea',
          dishNames: ['Milk Tea', 'Cheese Foam', 'Taro Fries'],
        }).then((result) => {
          const { restaurantId, dishIds } = result as {
            restaurantId: string;
            dishIds: string[];
          };
          const now = Date.now();

          cy.task('seedActivities', [
            {
              userId: actorId,
              type: 'REVIEWS_BATCHED',
              restaurantId,
              dishIds,
              includesRestaurantReview: true,
              createdAt: new Date(now).toISOString(),
              windowStartedAt: new Date(now - HOUR_MS).toISOString(),
            },
          ]);

          cy.visit('/');
          cy.get('[data-cy=feed-list] .feed-item').should('have.length', 1);
          cy.get('[data-cy=feed-activity-text]').should('contain.text', 'Heytea');
          cy.get('[data-cy=feed-activity-text]').should('contain.text', '3 dishes');
        });
      });
    });
  });

  it('formats same-day timestamps as minutes ago', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Recent List' }).then((listId) => {
        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: new Date(Date.now() - 5 * MINUTE_MS).toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('time').invoke('text').should('match', /^\d+ minutes? ago$/);
      });
    });
  });

  it('formats timestamps within a week as days ago', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Days List' }).then((listId) => {
        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: new Date(Date.now() - 3 * DAY_MS).toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('time').should('contain.text', '3 days ago');
      });
    });
  });

  it('formats timestamps older than a week as weeks ago', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Weeks List' }).then((listId) => {
        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: new Date(Date.now() - 3 * WEEK_MS).toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('time').should('contain.text', '3 weeks ago');
      });
    });
  });

  it('formats timestamps older than a year as an absolute date', () => {
    addTrackedActor().then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Old List' }).then((listId) => {
        const createdAt = new Date('2024-07-20T15:00:00.000Z');
        const expected = createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: createdAt.toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('time').should('contain.text', expected);
      });
    });
  });

  it('hides a followed user activities after unfollow', () => {
    addTrackedActor({ name: 'Unfollow Actor' }).then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId, name: 'Gone List' }).then((listId) => {
        cy.task('seedActivities', [
          {
            userId: actorId,
            type: 'LIST_CREATED',
            listId,
            createdAt: new Date().toISOString(),
          },
        ]);

        cy.visit('/');
        cy.get('[data-cy=feed-activity-text]').should('contain.text', 'Gone List');

        cy.visit(`/profile/${actorId}`);
        cy.get('[data-cy=unfollow-button]').click();
        cy.get('[data-cy=follow-button]').should('be.visible');

        cy.visit('/');
        cy.get('[data-cy=empty-feed]').should('be.visible');
        cy.get('[data-cy=feed-list]').should('not.exist');
      });
    });
  });

  it('creates feed activity when a followed user reviews a restaurant', () => {
    addTrackedActor({ name: 'Review Actor' }).then((actorId) => {
      cy.task('seedFollowEdge', { followerId: viewerId, followeeId: actorId });
      cy.task('seedListForUser', { userId: actorId }).then((listId) => {
        cy.task('seedRestaurantWithDishes', {
          listId,
          restaurantName: 'Smoke Cafe',
          dishNames: [],
        }).then((result) => {
          const { restaurantId } = result as { restaurantId: string };

          cy.task('createRestaurantReviewActivity', {
            userId: actorId,
            restaurantId,
            rating: 4.5,
            note: 'Loved it',
          });

          cy.visit('/');
          cy.get('[data-cy=feed-list] .feed-item').should('have.length', 1);
          cy.get('[data-cy=feed-activity-text]').should('contain.text', 'Smoke Cafe');
          cy.get('[data-cy=feed-activity-text]').should('contain.text', 'reviewed');
        });
      });
    });
  });
});

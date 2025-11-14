import getCurrentUser from '@/app/lib/getCurrentUser';
import { db } from '@/app/lib/database';
import { List, Place, SearchQueryResult } from '@/app/interfaces/interfaces';
import { searchQuery } from '@/app/actions/search';
import getRecommendations from '@/app/lib/getRecommendations';
import Nav from '@/app/components/Nav';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Recommendations from './Recommendations';

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const userId = await getCurrentUser(false);
  let listIds = await db.getListIds(userId);
  let lists: List[] = [];

  try {
    lists = await Promise.all(
      listIds.map(async (listId) => {
        const list = await db.getList(listId);

        if (!list) {
          throw new Error(`List with ID ${listId} not found`);
        }

        return list;
      })
    );
  } catch (err) {
    throw new Error(`Error fetching lists: ${err}`);
  }

  const searchParams = await props.searchParams;
  const query = searchParams.query;
  let results: SearchQueryResult | null = null;

  // Make sure the input is not null
  if (query) {
    results = await searchQuery(query, userId);
  }

  const recommendations = await getRecommendations(6);

  return (
    <div>
      <Nav />
      <div className="gated-page-layout">
        <div className="gated-page-layout-inner">
          { // Default search page
            !results && (
              <>
                <div className="max-w-3xl w-full mx-auto mb-8 space-y-4 md:mb-16 md:space-y-8">
                  <h1 className="text-2xl font-semibold text-center md:text-3xl lg:text-4xl">Search for a restaurant</h1>
                  <SearchForm />
                </div>
                <div className="md:space-y-12">
                  <h2 className="text-xl font-semibold text-center md:text-2xl md:text-left lg:text-3xl">Need some recommendations?</h2>
                  <Recommendations recommendations={recommendations} />
                </div>
              </>
            )
          }
          { // Search results page
            results && (
              <div className="flex flex-col space-y-8">
                <div className="max-w-3xl w-full mx-auto mb-8 xl:mb-16">
                  <SearchForm query={query} />
                </div>
                { // Display an error message if no results were found
                  // or if the user has exceeded their rate limit
                  results?.kind === 'error' && (
                    <p className="text-lg" data-cy="error-message">{results.message}</p>
                  )
                }
                { // Display search results
                  results?.kind === 'success' && (
                    <SearchResults lists={lists} places={results.places} />
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
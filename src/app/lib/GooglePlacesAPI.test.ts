import { describe, it, expect, vi } from 'vitest'
import { searchPlace } from './GooglePlacesAPI'
import * as fs from 'fs'

describe('Google Places API', async () => {
  const testData = JSON.parse(await fs.promises.readFile('src/app/lib/GooglePlacesAPITestData.json', 'utf8'));

  const expectedPlaces = testData.places.map((place: any) => {
    return {
      _id: place.id,
      name: place.displayName.text,
      type: place.primaryTypeDisplayName.text,
      address: place.formattedAddress,
      mapsUrl: place.googleMapsUri,
      photoId: place.photos?.[0]?.name || ""
    }
  });

  it('search place', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(testData), { status: 200 })
    )

    const result = await searchPlace('TP TEA')
    expect(result).toEqual(expectedPlaces)
  })
})
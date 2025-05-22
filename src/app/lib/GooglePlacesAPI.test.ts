import { describe, it, expect, vi } from 'vitest'
import { searchPlace } from './GooglePlacesAPI'
import * as fs from 'fs'

// Define a dummy localStorage for testing
global.localStorage = {
  store: {} as Record<string, string>,

  getItem(key: string) {
    return this.store[key] ?? null
  },

  setItem(key: string, value: string) {
    this.store[key] = value
  }
}

describe('Google Places API', async () => {
  const testData = JSON.parse(await fs.promises.readFile('src/app/lib/GooglePlacesAPITestData.json', 'utf8'));

  const expectedPlaces = testData.places.map((place: any) => {
    return {
      id: place.id,
      name: place.displayName.text,
      mapsUri: place.googleMapsUri,
      address: place.formattedAddress,
      photo: place.photos?.[0]?.name || "",
      type: place.primaryTypeDisplayName.text
    }
  });

  it('search place', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(testData), { status: 200 })
    )

    const result = await searchPlace('TP TEA')
    expect(result).toEqual(expectedPlaces)
    expect(JSON.parse(localStorage.getItem('places')!)).toEqual({ 'TP TEA': expectedPlaces })


    // Test if the second call uses the cached data
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('', { status: 200 })
    )

    const result2 = await searchPlace('TP TEA')
    expect(result2).toEqual(expectedPlaces)
    expect(JSON.parse(localStorage.getItem('places')!)).toEqual({ 'TP TEA': expectedPlaces })
  })
})
import { useCallback, useState } from 'react'

export type PointLocation = {
  type: 'Point'
  coordinates: [number, number]
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}

export function useGeolocation() {
  const [location, setLocation] = useState<PointLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getLocation = useCallback(() => {
    setLoading(true)
    setError(null)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => {
          const crd = pos.coords
          console.log(`✅ Geolocation success: ${crd}`)
          console.log(`Latitude : ${crd.latitude}`)
          console.log(`Longitude: ${crd.longitude}`)
          console.log(`Accuracy : ±${crd.accuracy} meters`)
          setLocation({
            type: 'Point',
            coordinates: [crd.longitude, crd.latitude],
          })
          setLoading(false)
        },
        (err: GeolocationPositionError) => {
          if (err.code === 1) {
            setError('Location access denied by user.')
          } else if (err.code === 2) {
            setError('Location unavailable.')
          } else if (err.code === 3) {
            setError('Location request timed out.')
          } else {
            setError('Unknown geolocation error.')
          }
          setLoading(false)
        },
        GEO_OPTIONS
      )
    } else {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
    }
  }, [])

  return { location, error, loading, getLocation }
}

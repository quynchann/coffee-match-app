import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Location = {
  lat: number
  lng: number
  address: string
}

type LocationState = {
  userLocation: Location | null
  isLocating: boolean
  requestUserLocation: () => void
  setUserLocation: (location: Location) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      userLocation: null,
      isLocating: false,

      setUserLocation: (location) => {
        set({ userLocation: location })
      },

      requestUserLocation: () => {
        set({ isLocating: true })

        const geoOptions = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            set({
              userLocation: {
                lat: latitude,
                lng: longitude,
                address: '現在地',
              },
              isLocating: false,
            })
          },
          (err) => {
            console.error('Lỗi lấy vị trí:', err)
            alert('位置情報へのアクセスを許可してください。')

            // chỉ set mặc định nếu chưa có location
            if (!get().userLocation) {
              set({
                userLocation: {
                  lat: 21.0285,
                  lng: 105.8542,
                  address: '現在地',
                },
              })
            }

            set({ isLocating: false })
          },
          geoOptions,
        )
      },
    }),
    {
      name: 'user-location-storage', // key localStorage
      partialize: (state) => ({
        userLocation: state.userLocation,
      }), // chỉ lưu location, không lưu isLocating
    },
  ),
)

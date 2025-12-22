import axios from './axios.customize'

const getAmenities = async () => {
  return await axios.get<IBackendRes<Array<string>>>('/search/amenities')
}

const getPurposes = async () => {
  return await axios.get<IBackendRes<Array<string>>>('/search/purposes')
}

const getAreas = async () => {
  return await axios.get<IBackendRes<Array<string>>>('/search/areas')
}

const getShopBySearch = async (params: ISearchShopParams) => {
  return await axios.get<IBackendRes<Array<IShop>>>('/search', { params })
}

const getShopById = async (id: string) => {
  return await axios.get<IBackendRes<IShop>>('/shops', {
    params: { id },
  })
}

export { getAmenities, getPurposes, getAreas, getShopBySearch, getShopById }

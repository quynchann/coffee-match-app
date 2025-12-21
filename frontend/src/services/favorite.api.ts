import axios from './axios.customize'

const getFavoriteByUserId = async () => {
  return await axios.get<IBackendRes<Array<IFavorite>>>(`/favorite`)
}

const postFavorite = async (shop_id: string) => {
  return await axios.post<IBackendRes<IFavorite>>(`/favorite`, {
    shop_id,
  })
}

const deleteFavorite = async (shopId: string) => {
  return axios.delete<IBackendRes<IFavorite>>(`/favorite/${shopId}`)
}

const getAllShopsFavorite = async (params: IFavoriteParams) => {
  return await axios.get<IBackendRes<Array<IShop>>>(`/favorite/shops`, {
    params,
  })
}

export {
  getFavoriteByUserId,
  postFavorite,
  deleteFavorite,
  getAllShopsFavorite,
}

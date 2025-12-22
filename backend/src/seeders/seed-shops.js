import Shop from '@/models/Shop.js'

const rawShops = [
  {
    id: 1,
    name: 'ハイランズコーヒー',
    rating: 4.5,
    hours: '7:00 ~ 23:00',
    address: '16 Le Thanh Nghi',
    area: 'hbt',
    purpose: 'study',
    lat: 21.0045,
    lng: 105.8412,
    description:
      '広くて開放的な空間で、グループ作業や勉強に最適です。Wi-Fiが強く、電源コンセントも多く設置されています。',
    phone: '090-1234-5678',
    priceRange: '300-600',
    amenities: ['wifi', 'parking', 'quiet', 'ac', 'outdoor'],
    features: [
      '高速無料Wi-Fi',
      'エアコン完備',
      '広い駐車スペース',
      '軽食あり',
      'カード決済対応'
    ],
    images: [
      'https://media.vneconomy.vn/1200x630/images/upload/2021/04/20/highland-coffee-15641309357751048105759-crop-156413094980996963270.jpg',
      'https://dn.baophapluat.vn/images/upload/nhanpham/09082025/dsc00995-750x468.jpg',
      'https://aeonmall-hadong.com.vn/wp-content/uploads/2019/08/dsc00991-750x468.jpg'
    ],
    menu: [
      {
        name: 'フィン・スア・ダー',
        price: '180円',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUKtlhRUNzksfbbzUGBkelT0MxrnhjU-sExw&s'
      },
      {
        name: 'トラ・セン・ヴァン',
        price: '270円',
        image:
          'https://www.highlandscoffee.com.vn/vnt_upload/product/06_2023/HLC_New_logo_5.1_Products__TSV.jpg'
      },
      {
        name: '抹茶フリーズ',
        price: '330円',
        image:
          'https://noithatcaphe.vn/images/2022/07/14/freeze-tra-xanh-highlands-coffee-%201.jpg'
      },
      {
        name: 'フィンディ マッチャ ストロベリー',
        price: '420円',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3vyOozc6PQCP2JT76rSvHZ05NkRYeKzXHQ&s'
      },
      {
        name: 'フィンコーヒー（ブラックアイス）',
        price: '180円',
        image:
          'https://bizweb.dktcdn.net/100/487/455/products/phin-den-da-1698982738181.jpg?v=1724205162483'
      },
      {
        name: 'ライチゼリーティー',
        price: '300円',
        image:
          'https://www.highlandscoffee.com.vn/vnt_upload/product/HLCPOSTOFFICE_DRAFT/PNG_FINAL/3_MENU_NGUYEN_BAN/Tra_Thach_Vai.jpg'
      },
      {
        name: 'チョコレートフリーズ',
        price: '330円',
        image:
          'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/New_product/HLC_New_logo_5.1_Products__FREEZE_CHOCO.jpg'
      }
    ]
  },
  {
    id: 2,
    name: 'ザ・コーヒーハウス',
    rating: 4.8,
    hours: '8:00 ~ 22:30',
    address: '23 Ba Trieu',
    area: 'hk',
    purpose: 'work',
    lat: 21.0227,
    lng: 105.8513,
    description:
      'モダンで若々しいデザイン。オフィスワーカーやフリーランサーに最適な場所です。',
    phone: '024-3939-3939',
    priceRange: '180-420',
    features: [
      '静かな空間',
      '非常に強いWi-Fi',
      '快適なソファ席',
      '中心地に近い'
    ],
    images: [
      'https://file.hstatic.net/1000075078/article/2_c7d67b2212114f29a2db4e0b6643825e.jpg',
      'https://tripping.jp/wp-content/uploads/2019/08/DSC02176-700x466.jpg',
      'https://dn.baophapluat.vn/images/upload/hongtuyet/09202024/cfh.jpeg'
    ],
    menu: [
      {
        name: 'カフェスアダー',
        price: '210円',
        image:
          'https://file.hstatic.net/1000075078/file/blog_adda9e9ccb2a495fb063ec50f0af8cda_grande.jpg'
      },
      {
        name: 'ピーチオレンジ・レモングラスティー',
        price: '300円',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_CWCFnEM4SZQzXLSomUMx8M0t8wwNj53yUQ&s'
      },
      {
        name: '蓮の実ウーロン茶',
        price: '320円',
        image:
          'https://winci.com.vn/wp-content/uploads/2024/02/Tra-Long-Nhan-Hat-Sen.webp'
      }
    ],
    reviews: []
  },
  {
    id: 3,
    name: 'スターバックス',
    rating: 4.9,
    hours: '7:30 ~ 22:00',
    address: '241 Xuan Thuy',
    area: 'cg',
    purpose: 'work',
    lat: 21.0405,
    lng: 105.7989,
    description:
      '世界的ブランドでプロフェッショナルなサービス基準。高級感のある空間です。',
    phone: '024-7777-8888',
    priceRange: '600-1200',
    amenities: ['wifi', 'ac', 'quiet', 'power'],
    features: ['国際ブランド', '高級感ある空間', '多様なドリンクメニュー'],
    images: [
      'https://vcdn1-kinhdoanh.vnecdn.net/2025/11/04/starbucks-china-1762230665-9707-1762230777.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=T6ScN8umeQxPYtISEatCeQ',
      'https://dol.ismcdn.jp/mwimgs/6/e/-/img_6eea15cf97d4705854acf4cd7f17633f487416.jpg',
      'https://www.gransta.jp/gr_cswp/wp-content/uploads/2022/04/%E3%82%B9%E3%82%BF%E3%83%90.jpg'
    ],
    menu: [
      {
        name: 'カフェラテ',
        price: '360円',
        image:
          'https://aeonmall-review-rikkei.cdn.vccloud.vn/public/wp/15/editors/WnI89i8FBAWrzx3PRXFXo25GAPzQqDdYe2NIOGnt.jpg'
      },
      {
        name: 'カフェアメリカーノ',
        price: '420円',
        image:
          'https://aeonmall-review-rikkei.cdn.vccloud.vn/public/wp/15/editors/KL3JpFuZvQfUdoTvCGteC6F6u1vnFF5OM3LQemMO.jpg'
      }
    ],
    reviews: []
  },
  {
    id: 4,
    name: 'オールデイコーヒー',
    rating: 4.6,
    hours: '8:00 ~ 23:00',
    address: '37 Quang Trung',
    area: 'hk',
    purpose: 'date',
    lat: 21.0178,
    lng: 105.8469,
    description: '温かくロマンチックな空間で、デートにぴったりのカフェです。',
    phone: '098-765-4321',
    priceRange: '420-900',
    amenities: ['wifi', 'ac', 'music', 'outdoor'],
    features: ['ロマンチックな雰囲気', '穏やかな音楽', '美しい装飾'],
    images: [
      'https://takeout-coffee.com/img/photo/all-day-coffee03.jpg',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
      'https://osakakita-journal.com/wp-content/uploads/2019/09/DSC01228-e1568011590139.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 5,
    name: 'トランキルブックス',
    rating: 5.0,
    hours: '8:00 ~ 22:00',
    address: '5 Nguyen Quang Bich',
    area: 'hk',
    purpose: 'study',
    lat: 21.0311,
    lng: 105.8516,
    description: '静かなブックカフェで、本の世界に没頭できる空間です。',
    phone: '091-234-5678',
    priceRange: '240-480',
    amenities: ['wifi', 'quiet', 'power', 'books'],
    features: ['豊富な本', '完全な静けさ', 'レトロな雰囲気'],
    images: [
      'https://lh3.ggpht.com/p/AF1QipOI9BZ-p-tyVuS1xneEfQ3o5gWz8OL8MBrZJRWS=s800',
      'https://cdn.xanhsm.com/2025/01/ace7a67d-tranquil-books-coffee-1.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/71/92/ca/tranquil-18-b-nguy-n.jpg?w=900&h=500&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/89/d8/bc/afternoon.jpg?w=1100&h=1100&s=1'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 6,
    name: 'コン・カフェ',
    rating: 4.4,
    hours: '7:00 ~ 23:30',
    address: '116 Cau Go',
    area: 'hk',
    purpose: 'relax',
    lat: 21.0298,
    lng: 105.8536,
    description: '独特なレトロスタイルで、古きハノイを感じられる空間です。',
    phone: '024-3333-4444',
    priceRange: '180-360',
    amenities: ['wifi', 'outdoor', 'vintage'],
    features: [
      'レトロスタイル',
      'ココナッツクリームの特製ドリンク',
      '眺めの良い席'
    ],
    images: [
      'https://cong-news.appwifi.com/wp-content/uploads/2020/07/Website-Our-Story-TVV.jpg',
      'https://cong-news.appwifi.com/wp-content/uploads/2023/05/IMG_4045.jpg',
      'https://skynext.vn/wp-content/uploads/2021/09/DSC9877.jpg',
      'https://noithatkendesign.vn/storage/app/media/uploaded-files/thiet-ke-cong-ca-phe.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 7,
    name: 'ラ・ヴィエットコーヒー',
    rating: 4.7,
    hours: '7:00 ~ 22:00',
    address: '3 Ngo Quyen',
    area: 'hk',
    purpose: 'work',
    lat: 21.0267,
    lng: 105.8523,
    description: 'ダラット産の高品質コーヒー、インダストリアル空間が魅力。',
    phone: '090-999-8888',
    priceRange: '300-600',
    amenities: ['wifi', 'power', 'ac', 'quiet'],
    features: ['純粋なコーヒー', '開放的な空間', '仕事向け'],
    images: [
      'https://vietair.com.vn/Media/Images/la-viet-coffee-menu.jpg?w=1200&h=630&c=true',
      'https://viet-tsu.com/wp-content/uploads/2023/12/6B78944F-AD69-4A2F-B461-A6C3416CC102.jpg',
      'https://vietnamag.com/wp-content/uploads/2021/11/254575161_2989394578044005_1870753101041857689_n-1024x722.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 8,
    name: 'フックロン',
    rating: 4.2,
    hours: '8:00 ~ 22:00',
    address: '82 Hang Dieu',
    area: 'hk',
    purpose: 'relax',
    lat: 21.0334,
    lng: 105.8512,
    description: '伝統的な味わいの茶とコーヒーが有名です。',
    phone: '1800-6779',
    priceRange: '240-540',
    amenities: ['wifi', 'ac', 'parking'],
    features: ['深い味の紅茶', '迅速なサービス', '便利な立地'],
    images: [
      'https://statics.vincom.com.vn/vincom-ho/gioi-thieu-1657095406.jpg',
      'https://jp.gurutto-vietnam.com/db_img/site_img/images/37c90973c1facc271338f41351b503d0.jpg',
      'https://hataraku-mama.info/wp-content/uploads/2022/09/2022-09-20-10-37-22-026-1.jpg',
      'https://gucci-vietnam.com/wp-content/uploads/2018/03/o0775051612924891995.jpg',
      'https://gucci-vietnam.com/wp-content/uploads/2018/03/o0800060013482040711.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 9,
    name: 'メゾン・ド・ブラン',
    rating: 4.8,
    hours: '9:00 ~ 21:00',
    address: '5 Tay Ho',
    area: 'bd',
    purpose: 'date',
    lat: 21.0545,
    lng: 105.8234,
    description: 'ヨーロッパ風の白い邸宅で、広い庭付きの高級カフェです。',
    phone: '024-6666-7777',
    priceRange: '900-1800',
    amenities: ['wifi', 'outdoor', 'ac', 'parking', 'luxury'],
    features: ['フランス建築', '庭園スペース', '美味しいスイーツ'],
    images: [
      'https://oms.hotdeal.vn/images/editors/sources/000367901728/367901-367901-Maison-de-Blanc-Set-Au-Happy-New-Year-Cho-2-Nguoi-body-chung(8).jpg',
      'https://yp.vn/wp-content/uploads/2021/01/20171120225856417.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 10,
    name: 'ツイッタービーンズ',
    rating: 4.3,
    hours: '7:00 ~ 22:00',
    address: '56 Vu Trong Phung',
    area: 'cg',
    purpose: 'study',
    lat: 21.0021,
    lng: 105.8156,
    description: '学生に人気の便利なカフェスタイル。',
    phone: '1900-1234',
    priceRange: '120-300',
    amenities: ['wifi', 'power', 'ac', 'spacious'],
    features: ['手頃な価格', '安定したWi-Fi', '座席数が多い'],
    images: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/1e/ca/88/twitter-beans-coffee.jpg?w=500&h=-1&s=1',
      'https://upload.urbox.vn/strapi/Twitter_beans_coffee_005_a467f07906.jpg',
      'https://gamudagardens.vn/wp-content/uploads/2016/05/Twitter-Beans-coffee-gamuda-garden.jpg'
    ],
    menu: [],
    reviews: []
  },
  {
    id: 11,
    name: 'カファカフェ',
    rating: 4.1,
    hours: '7:00 ~ 23:00',
    address: '101 Ba Trieu',
    area: 'hbt',
    purpose: 'relax',
    lat: 21.0189,
    lng: 105.8501,
    description:
      'ハノイらしいストリートコーヒーで、街並みを眺めながら楽しめます。',
    phone: '098-888-8888',
    priceRange: '90-240',
    amenities: ['outdoor', 'street'],
    features: ['ストリートコーヒー', '歩道席あり', '涼しい空間'],
    images: [
      'https://cdn.4travel.jp/img/thumbnails/imk/tips_pict/16/49/28/650x450_16492852.jpg?updated_at=1558584219',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/66/cb/8e/caption.jpg?w=1100&h=1100&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/d3/5f/b7/getlstd-property-photo.jpg?w=800&h=400&s=1'
    ],
    menu: [],
    reviews: []
  }
]

// Hàm chuyển đổi giá từ string "180円" -> number 180
const parsePrice = (priceStr) => {
  if (!priceStr) return 0
  return Number(priceStr.replace(/[^\d]/g, ''))
}

// Hàm chuyển đổi giờ "7:00 ~ 23:00" -> object
const parseHours = (hoursStr) => {
  if (!hoursStr) return { open: '', close: '' }
  const [open, close] = hoursStr.split(' ~ ')
  return { open: open || '', close: close || '' }
}

// Hàm chuyển đổi khoảng giá "300-600" -> object
const parsePriceRange = (rangeStr) => {
  if (!rangeStr) return { min: 0, max: 0 }
  const [min, max] = rangeStr.split('-')
  return { min: Number(min), max: Number(max) }
}

const seedShops = async () => {
  try {
    await Shop.deleteMany()
    console.log('Shops cleared')

    const shops = rawShops.map((shop) => ({
      name: shop.name,
      purpose: [shop.purpose], // Model yêu cầu mảng
      amenities: shop.amenities || [],
      features: shop.features || [],
      hours: parseHours(shop.hours),
      location: {
        type: 'Point',
        coordinates: [shop.lng, shop.lat] // GeoJSON yêu cầu [Longitude, Latitude]
      },
      address: shop.address,
      area: shop.area,
      priceRange: parsePriceRange(shop.priceRange),
      description: shop.description,
      phone: shop.phone,
      images: shop.images || [],
      menu: (shop.menu || []).map((item) => ({
        name: item.name,
        price: parsePrice(item.price),
        image: item.image
      })),
      rating: shop.rating, // Giữ rating ban đầu từ JSON
      totalReviews: shop.reviews ? shop.reviews.length : 0
    }))

    await Shop.insertMany(shops)
    console.log('Shops added')
  } catch (error) {
    console.error(`Error seeding shops: ${error}`)
    throw error
  }
}

export default seedShops

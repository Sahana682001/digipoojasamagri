import './HomeScreen.css'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

// Components
import Product from '../components/Product'
import BannerCarousel from '../components/BannerCarousel'
import CategorySlider from '../components/CategorySlider' // New component we'll create

//Actions
import {getProducts as listProducts} from '../redux/actions/productActions'
import {setUserDeatils} from '../redux/actions/userAction'

const banners = [
    {
       imageUrl: 'https://static.vecteezy.com/system/resources/previews/030/741/888/non_2x/navratri-and-durga-puja-celebration-card-background-and-banner-vector.jpg',
     
      altText: 'First banner',
      caption: {
        title: 'Elevate Every Ritual with Divine Essentials',
        description: '"Shop premium pooja items, from brass diyas to fragrant agarbattis — bring sacred energy to your home.',
      }
    },
    {
      imageUrl: 'https://www.shutterstock.com/image-vector/golden-kalash-temple-bell-on-260nw-2445778231.jpg',
      altText: 'Second banner',
      caption: {
        title: 'Your One-Stop Shop for Spiritual Offerings',
        description: 'Discover traditional pooja accessories curated to complete every ceremony with devotion and grace.'
      }
    }
];

const HomeScreen = () => {
  const dispatch = useDispatch()
  const getProducts = useSelector(state => state.getProducts)
  const {products, loading, error} = getProducts

  useEffect(() => {
    dispatch(listProducts())
    dispatch(setUserDeatils())
  }, [dispatch])

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="home-container">
      <BannerCarousel 
        banners={banners} 
        autoPlay={true}
        interval={3000}
        showControls={true}
        showIndicators={true}
      />
      


      {/* All products section */}
      <div className="homescreen">

              {/* Category-wise sliders */}
      {Object.keys(productsByCategory).map(category => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <CategorySlider products={productsByCategory[category]} />
        </div>
      ))}

        <h2 className="homescreen__title">Latest Products</h2>
        <div className="homescreen__products">
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : (
            products.map(product => (
              <Product
                key={product._id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                productId={product._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
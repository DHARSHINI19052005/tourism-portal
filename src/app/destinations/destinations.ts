import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  price: string;
  image: string;
}

interface Destination {
  name: string;
  state: string;
  category: string;
  description: string;
  image: string;
  type: string; // Beach, Hill Station, City, Adventure, Spiritual
  rating: number; // 1-5 stars
  price: number; // Price in USD per person per day (e.g., 50-500)
  popularity: number; // Popularity score 1-100
  location: string; // Region/City group
  fullDescription?: string;
  specialities?: string[];
  restaurants?: Restaurant[];
}

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destinations.html',
  styleUrls: ['./destinations.css']
})
export class Destinations {
  searchQuery = '';
  selectedCategory = 'all';
  selectedType = 'all'; // Filter by destination type
  selectedPopularity = 'all'; // Filter by popularity
  selectedRating = 'all'; // Filter by rating (4plus, toprated)
  selectedPriceRange = 'all'; // Filter by price range
  selectedLocation = 'all'; // Filter by location
  sortBy = 'none'; // Sort options: none, rating, price-low, price-high, popularity
  selectedDestination: Destination | null = null;
  showModal = false;
  activeFiltersCount = 0;

  destinations: Destination[] = [
    { 
      name: 'Goa', 
      state: 'West India', 
      category: 'beach',
      type: 'Beach',
      rating: 5,
      price: 60,
      popularity: 95,
      location: 'West',
      description: 'Pristine beaches and nightlife', 
      image: 'https://wallpapers.com/images/hd/goa-beach-pictures-nky6f6agn0qeb4h8.jpg', 
      fullDescription: 'Goa is famous for its stunning beaches, vibrant nightlife, and Portuguese colonial architecture. Experience the golden sands, water sports, and delicious seafood cuisine.',
      specialities: ['Seafood Curries', 'Feni Drinks', 'Beach Huts', 'Water Sports', 'Portuguese Architecture'],
      restaurants: [
        { name: 'Fisherman\'s Wharf', cuisine: 'Seafood', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Thalassa', cuisine: 'Greek', rating: 4.5, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Martin\'s Corner', cuisine: 'Goan', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Viva Panjim', cuisine: 'Portuguese', rating: 4.4, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Kerala', 
      state: 'South India', 
      category: 'nature',
      type: 'Spiritual',
      rating: 5,
      price: 55,
      popularity: 92,
      location: 'South',
      description: 'Backwaters and greenery', 
      image: 'https://tse4.mm.bing.net/th/id/OIP.SlVS1M3xDNRRzIADCAmPSAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3', 
      fullDescription: 'Kerala, the "God\'s own country", is renowned for its lush backwaters, spice plantations, and serene landscapes. Enjoy houseboat rides and ayurvedic treatments.',
      specialities: ['Backwater Cruises', 'Kerala Cuisine', 'Spice Markets', 'Ayurveda', 'Houseboat Stays'],
      restaurants: [
        { name: 'Tejas', cuisine: 'Kerala', rating: 4.8, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Kashi Art Gallery', cuisine: 'Indian Fusion', rating: 4.5, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Beit Al Bahar', cuisine: 'Middle Eastern', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Dal Chikhalwali', cuisine: 'Kerala Traditional', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Manali', 
      state: 'North India', 
      category: 'hill',
      type: 'Adventure',
      rating: 4,
      price: 70,
      popularity: 88,
      location: 'North',
      description: 'Snow mountains & adventure', 
      image: 'https://i.redd.it/lbbeb4dhtqx01.jpg', 
      fullDescription: 'Manali is a paradise for adventure enthusiasts with snow-capped mountains, trekking trails, and adrenaline-pumping activities like paragliding and skiing.',
      specialities: ['Trekking', 'Paragliding', 'Skiing', 'Adventure Sports', 'Mountain Views'],
      restaurants: [
        { name: 'Chopsticks', cuisine: 'Chinese', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Drifter\'s Cafe', cuisine: 'Continental', rating: 4.4, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Shobha', cuisine: 'Himachali', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Johnson\'s Cafe', cuisine: 'Italian', rating: 4.3, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Jaipur', 
      state: 'Rajasthan', 
      category: 'heritage',
      type: 'City',
      rating: 4,
      price: 45,
      popularity: 85,
      location: 'North',
      description: 'Royal palaces', 
      image: 'https://wallpapers.com/images/hd/jal-mahal-water-palace-jaipur-nighttime-uhki0tnbfn2lgovf.jpg', 
      fullDescription: 'Jaipur, the Pink City, is a cultural hub with magnificent palaces, forts, and bazaars. Explore the City Palace and Jantar Mantar, UNESCO World Heritage sites.',
      specialities: ['City Palace', 'Jantar Mantar', 'Rajasthani Crafts', 'Havelis', 'Desert Safari'],
      restaurants: [
        { name: 'Niro\'s', cuisine: 'North Indian', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Chandni', cuisine: 'Rajasthani', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Peacock Rooftop', cuisine: 'Multi-Cuisine', rating: 4.5, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Surya Niwas', cuisine: 'Indian', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Ooty', 
      state: 'Tamil Nadu', 
      category: 'hill',
      type: 'Hill Station',
      rating: 4,
      price: 50,
      popularity: 80,
      location: 'South',
      description: 'Tea gardens', 
      image: 'https://th.bing.com/th/id/R.4b511892af03f25af38d7632a4eafe54?rik=84rDE1yeogG4VQ&riu=http%3a%2f%2f3.bp.blogspot.com%2f-cz8zCR5RpSU%2fVOAtC7AVnUI%2fAAAAAAAAARY%2fAqLCT2gximg%2fs1600%2fOoty.jpg&ehk=U2gz9Vni3l%2bfmbfRnMe%2bQuujoxDERvuWbgkusZiQPMY%3d&risl=&pid=ImgRaw&r=0', 
      fullDescription: 'Ooty is a picturesque hill station surrounded by tea gardens and eucalyptus forests. Enjoy the toy train ride, botanical gardens, and pleasant weather year-round.',
      specialities: ['Tea Gardens', 'Toy Train', 'Botanical Gardens', 'Mountain Views', 'Tea Tasting'],
      restaurants: [
        { name: 'Stonehouse', cuisine: 'Continental', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Nahar', cuisine: 'South Indian', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'The Tea Factory', cuisine: 'Cafe', rating: 4.7, price: '$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Sidewalk Cafe', cuisine: 'Snacks', rating: 4.3, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Mysore', 
      state: 'Karnataka', 
      category: 'heritage',
      type: 'City',
      rating: 4,
      price: 48,
      popularity: 78,
      location: 'South',
      description: 'Mysore Palace', 
      image: 'https://tse3.mm.bing.net/th/id/OIP.mgOAzAKlQYUsyVeLSFghXwHaE7?w=293&h=195&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3', 
      fullDescription: 'Mysore Palace is an architectural marvel showcasing Indo-Saracenic style. Visit during the Dussehra festival when the palace is illuminated with thousand lights.',
      specialities: ['Mysore Palace', 'Silk Industry', 'Dussehra Festival', 'Heritage Tours', 'Sandalwood'],
      restaurants: [
        { name: 'RRR Restaurant', cuisine: 'Mysore Cuisine', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Olive Garden', cuisine: 'Continental', rating: 4.5, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Indra Bhavan', cuisine: 'South Indian', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'The MTR', cuisine: 'Cafe', rating: 4.4, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Darjeeling', 
      state: 'West Bengal', 
      category: 'hill',
      type: 'Hill Station',
      rating: 5,
      price: 65,
      popularity: 90,
      location: 'East',
      description: 'Tea estates', 
      image: 'https://ttg.com.bd/uploads/tours/plans/87_9579893jpg.jpg', 
      fullDescription: 'Darjeeling is famous for its world-class tea estates and the scenic Darjeeling Himalayan Railway. Witness sunrise from Tiger Hill and explore the misty mountains.',
      specialities: ['Tea Estates', 'Himalayan Railway', 'Tiger Hill Sunrise', 'Kanyakumari Viewpoint', 'Monasteries'],
      restaurants: [
        { name: 'Soups', cuisine: 'Tibetan', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Hasty Tasty', cuisine: 'Chinese', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Nathmull\'s Tea Room', cuisine: 'Cafe', rating: 4.7, price: '$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Park Restaurant', cuisine: 'Continental', rating: 4.4, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Andaman', 
      state: 'Island', 
      category: 'beach',
      type: 'Beach',
      rating: 5,
      price: 85,
      popularity: 93,
      location: 'East',
      description: 'Crystal clear beaches', 
      image: 'https://www.tourmyindia.com/blog/wp-content/uploads/2014/11/best-places-to-visit-andaman-nicobar-islands.png', 
      fullDescription: 'Andaman and Nicobar Islands offer crystal-clear waters, white-sand beaches, and coral reefs. Perfect for scuba diving, snorkeling, and water sports.',
      specialities: ['Scuba Diving', 'Snorkeling', 'Coral Reefs', 'Beach Activities', 'Marine Life'],
      restaurants: [
        { name: 'Reef Restaurant', cuisine: 'Seafood', rating: 4.7, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Blue Water Beach Shack', cuisine: 'Multi-Cuisine', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Ananda Dhaba', cuisine: 'Indian', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Dum Pukht', cuisine: 'Mughlai', rating: 4.4, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Rishikesh', 
      state: 'Uttarakhand', 
      category: 'nature',
      type: 'Spiritual',
      rating: 4,
      price: 40,
      popularity: 82,
      location: 'North',
      description: 'Yoga capital', 
      image: 'https://tse3.mm.bing.net/th/id/OIP.RNFEWBCfUxVA5c6jR4xnnAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', 
      fullDescription: 'Rishikesh, the yoga capital of the world, is nestled on the banks of the Ganges River. Experience yoga retreats, ashrams, and adventure rafting.',
      specialities: ['Yoga Retreats', 'Ashram Stays', 'River Rafting', 'Ghat Meditation', 'Spiritual Tours'],
      restaurants: [
        { name: 'Ganga Kinare', cuisine: 'Vegetarian', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Little Buddha Cafe', cuisine: 'Fusion', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Sacred Chai Cafe', cuisine: 'Organic', rating: 4.7, price: '$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Devraj Cafe', cuisine: 'Indian', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Udaipur', 
      state: 'Rajasthan', 
      category: 'heritage',
      type: 'City',
      rating: 4,
      price: 52,
      popularity: 84,
      location: 'North',
      description: 'City of lakes', 
      image: 'https://wallpapercave.com/wp/wp6736680.jpg', 
      fullDescription: 'Udaipur, the City of Lakes, showcases Rajasthani royalty with stunning palaces and lakeside beauty. Enjoy boat rides on Lake Pichola and explore ancient forts.',
      specialities: ['Lake Pichola Ride', 'City Palace', 'Jagmandir Island', 'Havelis', 'Sunset Views'],
      restaurants: [
        { name: 'Ambrai', cuisine: 'Multi-Cuisine', rating: 4.7, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Upre By 1559 AD', cuisine: 'Indian Fusion', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Shashlik Haveli', cuisine: 'Rajasthani', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Jaiwana Haveli', cuisine: 'Vegetarian', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Shimla', 
      state: 'Himachal Pradesh', 
      category: 'hill',
      type: 'Hill Station',
      rating: 5,
      price: 58,
      popularity: 87,
      location: 'North',
      description: 'Queen of hill stations', 
      image: 'https://img.freepik.com/premium-photo/shimla-cityscape-aerial-view-scenic-hill-station-himalayas-himachal-pradesh_617018-400.jpg?w=2000', 
      fullDescription: 'Shimla, the "Queen of Hill Stations", offers stunning views of snow-capped mountains, colonial architecture, and charming toy train rides through misty valleys.',
      specialities: ['Toy Train Ride', 'Christ Church', 'Kali Bari Temple', 'Ridge Walk', 'Snow Views'],
      restaurants: [
        { name: 'Scandal Point', cuisine: 'Continental', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'The Himalayan Kitchen', cuisine: 'Himachali', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Cafe Sol', cuisine: 'Cafe', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Ashiana', cuisine: 'North Indian', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Gokarna', 
      state: 'Karnataka', 
      category: 'beach',
      type: 'Beach',
      rating: 4,
      price: 50,
      popularity: 81,
      location: 'South',
      description: 'Peaceful beach paradise', 
      image: 'https://www.tripsavvy.com/thmb/Hdpjrxt19rVrb-v6j2N4xzMEvg0=/2000x1500/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-541506666-5c30068246e0fb00018647ce.jpg', 
      fullDescription: 'Gokarna is a hidden gem destination known for its pristine beaches, spiritual significance, and peaceful atmosphre away from crowded tourist spots. Perfect for beach lovers and backpackers.',
      specialities: ['Om Beach', 'Kudle Beach', 'Beach Trekking', 'Yoga Retreats', 'Hindu Temple'],
      restaurants: [
        { name: 'German Bakery', cuisine: 'Continental', rating: 4.5, price: '$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Gokarna Cafe', cuisine: 'Multi-Cuisine', rating: 4.4, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Beach Shack', cuisine: 'Seafood', rating: 4.3, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Namaste Cafe', cuisine: 'Vegetarian', rating: 4.6, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Nainital', 
      state: 'Uttarakhand', 
      category: 'hill',
      type: 'Hill Station',
      rating: 4,
      price: 48,
      popularity: 79,
      location: 'North',
      description: 'Lake surrounded mountains', 
      image: 'https://www.mapsofindia.com/ci-moi-images/my-india/nainital.jpg', 
      fullDescription: 'Nainital is a scenic hill station centered around a pristine lake surrounded by snow-capped mountains. Known for water sports, trekking, and beautiful landscape photography.',
      specialities: ['Naini Lake', 'Cable Car Ride', 'Naina Peak Trekking', 'Boating', 'Nature Walks'],
      restaurants: [
        { name: 'H.P. Bhaat House', cuisine: 'North Indian', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Sakley The Mountain Cafe', cuisine: 'Continental', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Pot Pourri', cuisine: 'Cafe', rating: 4.3, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'The Kumaon Kitchen', cuisine: 'Kumaoni', rating: 4.7, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Jodhpur', 
      state: 'Rajasthan', 
      category: 'heritage',
      type: 'City',
      rating: 5,
      price: 46,
      popularity: 86,
      location: 'North',
      description: 'Blue City of Rajasthan', 
      image: 'https://th.bing.com/th/id/R.b9ddf0164c9244f723ecc212f2c09ed6?rik=PS%2bw9s8wDrZAAA&riu=http%3a%2f%2fsun-surfer.com%2fphotos%2f2015%2f02%2fMehrangarh-Fort-Jodhpur-India.jpg&ehk=uCB1rOqhgdgEUVWAdAZSLjNBSZ2DXJSuzbfApoLOcU8%3d&risl=&pid=ImgRaw&r=0', 
      fullDescription: 'Jodhpur, the "Blue City", is famous for its stunning blue-washed buildings, imposing Mehrangarh Fort, and vibrant markets. Experience royal heritage and traditional desert culture.',
      specialities: ['Mehrangarh Fort', 'Blue City Streets', 'Clock Tower Market', 'Desert Fairs', 'Royal Palaces'],
      restaurants: [
        { name: 'On The Rocks', cuisine: 'Multi-Cuisine', rating: 4.7, price: '$$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Indique', cuisine: 'Indian', rating: 4.6, price: '$$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Chokelao Rajasthani Restaurant', cuisine: 'Rajasthani', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Jharana Dhani', cuisine: 'Traditional', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Hampi', 
      state: 'Karnataka', 
      category: 'heritage',
      type: 'City',
      rating: 5,
      price: 40,
      popularity: 88,
      location: 'South',
      description: 'Ancient temple ruins', 
      image: 'https://karnatakatourism.org/wp-content/uploads/2020/06/Stone-Chariot-Hampi-heritage-land.jpg', 
      fullDescription: 'Hampi is an ancient village with stunning archaeological ruins of the Vijayanagara Empire. Famous for its unique boulder formations, ancient temples, and riverside scenery.',
      specialities: ['Virupaksha Temple', 'Stone Chariot', 'Bazaar Street', 'Tungabhadra River', 'Ancient Monuments'],
      restaurants: [
        { name: 'Mango Tree', cuisine: 'Multi-Cuisine', rating: 4.5, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Ravi\'s Rose Garden Cafe', cuisine: 'Continental', rating: 4.4, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Gobhi Garden', cuisine: 'Vegetarian', rating: 4.6, price: '$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Funky Stones', cuisine: 'Fusion', rating: 4.3, price: '$$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    },
    { 
      name: 'Varanasi', 
      state: 'Uttar Pradesh', 
      category: 'nature',
      type: 'Spiritual',
      rating: 5,
      price: 35,
      popularity: 91,
      location: 'North',
      description: 'Holiest city on Ganges', 
      image: 'https://wallpaperaccess.com/full/2714880.jpg',
      fullDescription: 'Varanasi, one of the world\'s oldest cities and Hinduism\'s holiest site, is located on the banks of the sacred Ganges River. Experience spiritual ceremonies, ancient temples, and vibrant ghats.',
      specialities: ['Ghat Rituals', 'Ganges River Cruise', 'Kashi Vishwanath Temple', 'Aarti Ceremony', 'Ancient Temples'],
      restaurants: [
        { name: 'Pizzeria Vaatika Cafe', cuisine: 'Italian', rating: 4.6, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Blue Lassi', cuisine: 'Lassi & Sweets', rating: 4.7, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' },
        { name: 'Ganges Cafe', cuisine: 'Multi-Cuisine', rating: 4.4, price: '$$', image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg' },
        { name: 'Assi Ghat Food Court', cuisine: 'Street Food', rating: 4.5, price: '$', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg' }
      ]
    }
  ];

  get filteredDestinations() {
    let results = this.destinations.filter(d => {
      // Filter by search query (name or state)
      const searchMatch = 
        d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Filter by category
      const categoryMatch = this.selectedCategory === 'all' || d.category === this.selectedCategory;

      // Filter by destination type
      const typeMatch = this.selectedType === 'all' || d.type === this.selectedType;

      // Filter by rating/popularity
      let ratingMatch = true;
      if (this.selectedRating === '4plus') {
        ratingMatch = d.rating >= 4;
      } else if (this.selectedRating === 'toprated') {
        ratingMatch = d.rating === 5;
      }

      // Filter by popularity score
      let popularityMatch = true;
      if (this.selectedPopularity === 'high') {
        popularityMatch = d.popularity >= 85;
      } else if (this.selectedPopularity === 'medium') {
        popularityMatch = d.popularity >= 70 && d.popularity < 85;
      } else if (this.selectedPopularity === 'low') {
        popularityMatch = d.popularity < 70;
      }

      // Filter by INR price range (assuming d.price is in USD, convert to INR)
      let priceMatch = true;
      const usdToInr = 83; // 1 USD ≈ 83 INR (as of 2026)
      const priceInInr = d.price * usdToInr;
      if (this.selectedPriceRange === 'below5k') {
        priceMatch = priceInInr < 5000;
      } else if (this.selectedPriceRange === 'below10k') {
        priceMatch = priceInInr < 10000;
      } else if (this.selectedPriceRange === 'below20k') {
        priceMatch = priceInInr < 20000;
      }

      // Filter by location
      const locationMatch = this.selectedLocation === 'all' || d.location === this.selectedLocation;

      // Apply AND logic: all filters must match simultaneously
      return searchMatch && categoryMatch && typeMatch && ratingMatch && 
             popularityMatch && priceMatch && locationMatch;
    });
    
    // Apply sorting
    if (this.sortBy !== 'none') {
      results = this.applySorting(results);
    }
    
    // Update active filters count
    this.updateActiveFiltersCount();
    
    return results;
  }

  applySorting(destinations: Destination[]): Destination[] {
    const sorted = [...destinations];
    
    switch (this.sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popularity':
        return sorted.sort((a, b) => b.popularity - a.popularity);
      default:
        return sorted;
    }
  }

  updateActiveFiltersCount(): void {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.selectedCategory !== 'all') count++;
    if (this.selectedType !== 'all') count++;
    if (this.selectedRating !== 'all') count++;
    if (this.selectedPopularity !== 'all') count++;
    if (this.selectedPriceRange !== 'all') count++;
    if (this.selectedLocation !== 'all') count++;
    if (this.sortBy !== 'none') count++;
    this.activeFiltersCount = count;
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
  }

  setType(type: string): void {
    this.selectedType = type;
  }

  setRating(rating: string): void {
    this.selectedRating = rating;
  }

  setPopularity(popularity: string): void {
    this.selectedPopularity = popularity;
  }

  setPriceRange(priceRange: string): void {
    this.selectedPriceRange = priceRange;
  }

  setLocation(location: string): void {
    this.selectedLocation = location;
  }

  setSortBy(sortBy: string): void {
    this.sortBy = sortBy;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.selectedRating = 'all';
    this.selectedPopularity = 'all';
    this.selectedPriceRange = 'all';
    this.selectedLocation = 'all';
    this.sortBy = 'none';
    this.activeFiltersCount = 0;
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    return '⭐'.repeat(fullStars);
  }

  selectDestination(destination: Destination): void {
    this.selectedDestination = destination;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDestination = null;
    document.body.style.overflow = 'auto'; // Re-enable body scroll
  }

  bookRestaurant(restaurant: Restaurant): void {
    alert(`🎉 Great choice! Booking confirmation for ${restaurant.name} has been sent to your email. Your table is reserved!`);
  }
}

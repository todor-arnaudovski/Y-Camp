const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// extract a random element (sample) from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: '5f9d92ef55b88b27347f6da6',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      // get random elements from the arrays we got by deconstructing the seedHelpers file
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, unde obcaecati. Architecto accusantium sit, similique nesciunt cum explicabo molestias odio sed nobis, cupiditate quas, quasi necessitatibus error laborum. Sunt incidunt laborum ratione, fuga accusantium earum nobis. Corporis voluptate porro dolores asperiores officia neque et quisquam placeat.',
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dkemja8ij/image/upload/v1604310480/YelpCamp/tl1tfv2zfd5jrmpy1h3n.jpg',
          filename: 'YelpCamp/tl1tfv2zfd5jrmpy1h3n'
        },
        {
          url: 'https://res.cloudinary.com/dkemja8ij/image/upload/v1604310480/YelpCamp/lxfzt0dke2eu2u3ufmfg.jpg',
          filename: 'YelpCamp/lxfzt0dke2eu2u3ufmfg'
        },
        {
          url: 'https://res.cloudinary.com/dkemja8ij/image/upload/v1604310480/YelpCamp/p6lvb8kwnc5gbjnps7rn.jpg',
          filename: 'YelpCamp/p6lvb8kwnc5gbjnps7rn'
        }
      ]
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
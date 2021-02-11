const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200'); // replaces only first match
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // location.type must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number], // array of numbers (lng, lat)
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId, // object id
      ref: 'Review' // from the review model
    }
  ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
  // 'this' refers to the particular campground instance
});

// mongoose middleware to delete all reviews related to a campground
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  // the doc is the current deleting document
  if (doc) {
    await Review.deleteMany({ //delete all reviews where their id is in the reviews key of the document
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
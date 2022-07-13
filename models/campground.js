const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// schema for each image
// we have schema for image so we can add thumbnail below
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//to get virtuals when we convert document to JSON
const opts = { toJSON: { virtuals: true } };

// thumbnail
// we use virtual so we do not store it in our model or Database
// becuase it is derived from the infomation we already storing
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // connect a review to a campground
    // one to many
    //arrays of objectId's
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

//virtual function to help with the popup on the cluster map
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return (
    "<strong> <a href='/campgrounds/" +
    this._id +
    "'>" +
    this.title +
    "</a> </strong> <img src='" +
    this.images[0].thumbnail +
    "' alt''>"
  );
});

//middleware to help delete the reviews that are in the deleted campground document
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);

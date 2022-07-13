const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//get a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    //there are 1000 cities in the array cities
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //abood's ObjectId: 62c109f4c4b072cfa4712f45
      author: "62c109f4c4b072cfa4712f45",
      location: cities[random1000].city + ", " + cities[random1000].state,
      title: sample(descriptors) + " " + sample(places),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas dolores neque, nisi inventore iusto excepturi magni at dicta qui dolorum, doloremque quod quisquam tempore! Accusantium necessitatibus saepe distinctio molestiae recusandae.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dgeck3m7i/image/upload/v1657156632/YelpCamp/fkmwu9z97l0a6e0qmfjj.jpg",
          filename: "YelpCamp/fkmwu9z97l0a6e0qmfjj",
        },
        {
          url: "https://res.cloudinary.com/dgeck3m7i/image/upload/v1657156632/YelpCamp/yjbhxyoiue9b1wezdiya.jpg",
          filename: "YelpCamp/yjbhxyoiue9b1wezdiya",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

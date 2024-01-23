const mongoose = require('mongoose');
const { City } = require('./models/city.model');
const { State } = require('./models/state.model');
const { Country } = require('./models/country.model');
const jsonData = require('./seederData.json');

mongoose.connect('mongodb://localhost:27017/demo-project');

const seedData = async () => {
  try {
    const existingCountries = await Country.find();
    if (existingCountries.length > 0) {
      console.log('Countries already exist. Skipping seeding.');
      return;
    }

    const countries = jsonData.countries.map(country => new Country({ name: country.name }));

    // Save countries first
    const savedCountries = await Promise.all(countries.map(country => country.save()));

    // Generate and save states for each country
    const savedStates = [];
    for (let i = 0; i < savedCountries.length; i++) {
      const country = savedCountries[i];
      const statesData = jsonData.countries[i].states;
      const states = statesData.map(state => new State({ name: state.name, country: country._id }));

      const savedStatesForCountry = await State.insertMany(states);
      savedStates.push(savedStatesForCountry);

      // Generate and save cities for each state
      for (let k = 0; k < savedStatesForCountry.length; k++) {
        const state = savedStatesForCountry[k];
        const citiesData = statesData[k].cities;
        const cities = citiesData.map(city => new City({ name: city, state: state._id }));
        await City.insertMany(cities);

        // Assign cities to the state
        state.cities = cities.map(city => city._id);
        await state.save();
      }

      // Assign states to the country
      country.states = savedStatesForCountry.map(state => state._id);
      await country.save();
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();

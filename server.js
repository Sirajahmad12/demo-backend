const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const {User} = require('./models/user.model')
const { Country } = require('./models/country.model');
const { State } = require('./models/state.model');
const { City } = require('./models/city.model');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/demo-project');




app.post('/save-contact-us-data', async (req, res) => {
    try {
      const formData = req.body;
      const validationRules = {
        first_name: {
          message: 'Please enter a valid First Name (alphabets only)',
          validate: (value) => /^[A-Za-z]+$/.test(value),
          required: true,
        },
        last_name: {
          message: 'Please enter a valid Last Name (alphabets only)',
          validate: (value) => /^[A-Za-z]+$/.test(value),
          required: true,
        },
        email: {
          message: 'Please enter a valid Email address',
          validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          required: true,
        },
        country: {
          message: 'Please select a Country',
          validate: (value) => value !== 'Select Country',
          required: true,
        },
        state: {
          message: 'Please select a State',
          validate: (value) => value !== 'Select State',
          required: true,
        },
        city: {
          message: 'Please select a City',
          validate: (value) => value !== 'Select City',
          required: true,
        },
        gender: {
          message: 'Please select a Gender',
          validate: (value) => value === 'male' || value === 'female',
          required: true,
        },
        dob: {
          message: 'Please enter a valid Date of Birth min 14, max 99',
          validate: (value) => {
            const dobDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();
            return age >= 14 && age <= 99;
          },
          required: true,
        },
       
      };
      const validationErrors = [];
  
      for (const fieldName in validationRules) {
        const rule = validationRules[fieldName];
        const value = formData[fieldName];
  
        if (rule.required && !value) {
          validationErrors.push(`Please fill ${fieldName} required fields.`);
        } else if (rule.required && !rule.validate(value)) {
          validationErrors.push(`${rule.message}`);
        }
  
        if (!rule.required && !rule.validate(value)) {
          validationErrors.push(rule.message);
        }
      }
  
      if (validationErrors.length > 0) {
        // If there are validation errors, return a response with the errors
        return res.status(400).json({ errors: validationErrors });
      }
  
      // If validation passes, save the data
      const UserEntry = new User(formData);
        await UserEntry.save();
        const country = await Country.findById(req.body.country).select('name').exec();
        const state = await State.findById(req.body.state).select('name').exec();
        const city = await City.findById(req.body.city).select('name').exec();
        let formattedData = {
            ...formData,
            country:country.name,
            state:state.name,
            city:city.name,
        }
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error saving contact us data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/countries', async(req, res) => {
    try {
        console.log('req: ', Country);
        const country = await Country.find().select('name _id');
    
        if (!country) {
          return res.status(404).json({ error: 'Country not found' });
        }
    
        res.status(200).json(country);

      } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.get('/states/:countryId', async(req, res) => {
    try {
        const countryId = req.params.countryId;
        const country = await Country.findById(countryId).select('states')
        .populate({
          path: 'states'
        }).exec();
    
        if (!country) {
          return res.status(404).json({ error: 'Country not found' });
        }
    
        res.status(200).json(country);

      } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.get('/cities/:stateId', async(req, res) => {
    try {
        const stateId = req.params.stateId;
        const city = await State.findById(stateId).select('cities')
        .populate({
          path: 'cities'
        }).exec();
    
        if (!city) {
          return res.status(404).json({ error: 'city not found' });
        }
    
        res.status(200).json(city);

      } catch (error) {
        console.error('Error fetching city:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

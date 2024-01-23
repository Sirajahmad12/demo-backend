const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { City } = require('./city.model');


const stateSchema = new mongoose.Schema({
    name: String,
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
});

const State = mongoose.model('State', stateSchema);

module.exports = {
    State
};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { State } = require('./state.model');
const countrySchema = new mongoose.Schema({
    name: String,
    states: [{ type: Schema.Types.ObjectId, ref: 'State' }],
});

const Country = mongoose.model('Country', countrySchema);

module.exports = {
    Country
};
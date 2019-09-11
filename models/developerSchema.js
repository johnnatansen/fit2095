let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({

    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        validate: {
            validator: function (levelValue) {
                return levelValue == 'BEGINNER' || levelValue == 'EXPERT'
            },
            message: 'must be either BEGINNER or EXPERT'
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }


});

module.exports = mongoose.model('DeveloperCollection', developerSchema);
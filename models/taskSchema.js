let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({

    taskName: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeveloperCollection'
    },
    dueDate: {
        type: Date,

    },
    taskStatus: {
        type: String,
        required: true,
        validate: {
            validator: function (status) {
                return status == 'InProgress' || status == 'Complete'
            },
            message: 'must be either InProgress or Complete'
        }
    },
    taskDescription: String


});

module.exports = mongoose.model('taskCollection', taskSchema);


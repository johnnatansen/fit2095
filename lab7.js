//========================================require=============================================================
let express = require("express")
let app = express()

let bodyParser = require("body-parser")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static('img'));
app.use(express.static('static'));


// parse application/json
app.use(bodyParser.json())


//make engine for table(webpage rendering)
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');


// =-=-=- mongoose -=-=-=-=-
let mongoose = require('mongoose');

let Task = require('./models/taskSchema')
let Developer = require('./models/developerSchema')

let url = "mongodb://localhost:27017/week7Trial"



//============================================================================================================

mongoose.connect(url, function (err) {
    if (err) console.log(err);
    else {

        console.log("======== CONNECTED ========") 

    }
});


 


app.get('/', function (request, response) {
    response.sendFile(__dirname + '/static/index.html');
    
});

app.get('/newtask', function (request, response) {
    response.sendFile(__dirname + '/static/newTask.html');
});

app.post('/data', function (request, response) {
    
    Developer.where({_id: request.body.assignTo}).exec(function (err, docs) {

        let temp = new Task({ 
            taskName: request.body.taskName,
            assignTo: docs[0]._id,
            dueDate: new Date(request.body.taskDue), 
            taskStatus: "InProgress",
            taskDescription: request.body.taskDesc
            });
        
        temp.save(function (err) {
            if (err) console.log(err)
            else{
                console.log('new task added')

                Task.where({}).exec(function (err, docs) {
                    response.render('listTask.html', {taskDb: docs});
                })
            }
        })  
    })        
});

app.get('/listtasks', function (request, response) {

    Task.where({}).exec(function (err, docs) {

            response.render('listTask.html', {taskDb: docs});
    })

});

app.get('/newDev', function (request, response) {
    response.sendFile(__dirname + '/static/newDev.html');
});

app.post('/newDevPOST', function (request, response) {
    
    let temp = new Developer({ 
        name: {
            firstName: request.body.devFirstName,
            lastName: request.body.devLastName
        },
        level: request.body.devLevel,
        address: {
            state: request.body.newState,
            suburb: request.body.newSuburb,
            street: request.body.newStreet,
            unit: request.body.newUnit
            }
        });
    
    
    temp.save(function (err) {
        if (err) console.log(err)
        else{
            console.log('new dev added')

            Developer.where({}).exec(function (err, docs) {
                response.render('listDevs.html', {devDb: docs});
            })
        }
    })
    
});

app.get('/listDev', function (request, response) {

    Developer.where({}).exec(function (err, docs) {
        response.render('listDevs.html', {devDb: docs});
    })

});

app.get('/deleteTask', function (request, response) {
    response.sendFile(__dirname + '/static/deleteTask.html');
})

app.post('/delete', function (request, response) {
    
    Task.deleteOne({ _id: request.body.deleteID }, function (err, doc) {
        console.log(doc);

        // Task.where({}).exec(function (err, docs) {
        //     response.render('listTask.html', {taskDb: docs});
        // })
        response.redirect('listtasks')

      });        
});

app.get('/deleteAll', function (request, response) {
    Task.deleteMany({taskStatus: "Complete"}, function (err, doc) {
        console.log(doc);

        Task.where({}).exec(function (err, docs) {
            response.render('listTask.html', {taskDb: docs});
        })

    });
})

app.get('/updateTask', function (request, response) {
    response.sendFile(__dirname + '/static/updateTask.html');
})

app.post('/update', function (request, response) {
    
    Task.updateOne({ _id: request.body.updateID }, { $set: { taskStatus: request.body.stat } }, { upsert: false }, function (err, doc) {
    
        Task.where({}).exec(function (err, docs) {
            response.render('listTask.html', {taskDb: docs});
        })

    }); 
});

app.get('/extraTask', function (request, response) {

    Task.where({'taskStatus': 'Complete'}).sort({'taskName': -1}).limit(3).exec(function (err, docs) {
        response.render('extraTask.html', {taskDb: docs});
    })
})

app.listen(8080);
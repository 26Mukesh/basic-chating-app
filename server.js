var mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets
var mongoURI ="mongodb+srv://mukesh:<password>@cluster0-05i2g.mongodb.net/test?retryWrites=true&w=majority/chatingapp"

mongo.connect(mongoURI, function(err, db) {
    if (err) throw err;
    console.log("Database created!");

    client.on('connection', function(socket){
        let chat = db.collection('chats');
        
        //create function to send status
        sendStatus = function(s) {
            socket.emit('status',s)
        }
        //get chat from mongodb
        chat.find().limit(100).sort({_id}).toArray(function(err, res){
            if(err) throw err;
            //emit message
            socket.emit('output',res)
        })
        //handle input events
        socket.on('input',function(data){
            let name = data.name;
            let msg = data.message

            if(name =='' || message == ''){
                sendStatus('please enter a name and message')
            } else {
                chat.insert({name: name, message: msg}, function(){
                    client.emit('output', [data])
                    sendStatus({
                        message: 'message sent',
                        clear: true
                    })
                })
            }
        })

        //handle clear
        socket.on('clear', function(){
            chat.remove({},function(){
                socket.emit('cleared')
            })
        })

    })

});
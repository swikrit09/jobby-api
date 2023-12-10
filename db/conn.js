const mongoose=require("mongoose")

mongoose.connect('mongodb+srv://swikki2003:1234test@cluster0.nmojhej.mongodb.net/?retryWrites=true&w=majority',{
    // useNewUrlParser:true,
    // useUnifiedTopology: true
}).then(()=> {
    console.log('connection successful');
}).catch((error) =>{
    console.log('something went wrong',error);
})
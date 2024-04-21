const express = require ('express');
const mongoose =  require('mongoose');
const cors =  require('cors');
require('dotenv').config();

const OnlineForm = require('./modals/OnlineEntry.modal');

const app = express(); 

const url = process.env.ATLAS_URL;

mongoose.set('strictQuery',false);
mongoose.connect(url);


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());


/* username: rajaimayabharathi password: WHHxDjjKM2QVzm9b */


// CRUD Operation API'S
// Create data || save data in mongoDB

 app.post('/createMethod1',(req,res)=>{
  const {currentDate,amount,gst,subTotal,bankAccount,paymentStatus,entryType,paymentMethod,busNo}= req.body;

  const EntryData= new OnlineForm({currentDate,amount,gst,subTotal,bankAccount,paymentStatus,entryType,paymentMethod,busNo})

  EntryData.save()
    .then(savedData => {
      console.log('Data saved to database:', savedData);
      res.status(200).send({success: true, messege: "Data saves in database Successfully"});
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving data to database');
    });
});

app.post("/create",async(req,res)=>{
  console.log(req.body)
  const data = new OnlineForm(req.body)
  await data.save()
  res.send({success :true,message:"data saved successfully"}) 
}) 



//Read data from the mongo DB
app.get("/",async(req,res)=>{
  const data= await OnlineForm.find()
  res.json({success: true, data: data})
})


app.get('/getOnlineEntry',async(req,res) =>{
  try {
    const entries = await OnlineForm.find({ entryType: 'Online Booking' });
    res.json(entries);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
})


app.get('/getAgencyEntries',async(req,res) =>{
  OnlineForm.find({entryType:'Agency Booking'})
  .then(entries =>res.json(entries))
  .catch(err => res.json(err))
})

app.get('/getOwnBookingEntries',async(req,res) =>{
  OnlineForm.find({entryType:'Own Booking'})
  .then(entries =>res.json(entries))
  .catch(err => res.json(err))
})

app.get('/getCargoEntries',async(req,res) =>{
  OnlineForm.find({entryType:'Cargo'})
  .then(entries =>res.json(entries))
  .catch(err => res.json(err))
})


// Update the data
app.put("/update",async(req,res)=>{
  console.log(req.body)
  const {id,...rest}=req.body
  console.log(rest)
  const data = await OnlineForm.updateOne({_id: id},rest)
  res.send({success: true, message:" data updated successfully", data : data})

    /* const id = req.params.id;
  const updateData = req.body;
  try {
    // Find the document by ID and update it
    const updatedDocument = await OnlineForm.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ success: true, message: 'Data updated successfully', data: updatedDocument });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } */
})



//delete Api
app.delete("/delete/:id",async(req,res)=>{
  const id =req.params.id
  const data =await OnlineForm.deleteOne({_id : id})
  res.send({success: true, message:" data deleted successfully", data:data})
})

app.listen(5000,()=>{console.log("server Started on port 5000")})



// Dashboard API's

// calulating Profit and Total Booking
app.get('/profit',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({});
    const result = await OnlineForm.aggregate([
      {
        $match: {}
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)): 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// calulating Expense and Total Booking
app.get('/expense',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({});
    const result = await OnlineForm.aggregate([
      {
        $match: {}
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)): 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// calulating Sum of Total amount and count of online booking
app.get('/onlineDashboard',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({ entryType: 'Online Booking' });
    const result = await OnlineForm.aggregate([
      {
        $match: { entryType: 'Online Booking' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)): 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// calulating Sum of Total amount and count of Agency booking
app.get('/agenyDashboard',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({ entryType: 'Agency Booking' });
    const result = await OnlineForm.aggregate([
      {
        $match: { entryType: 'Agency Booking' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)) : 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// calulating Sum of Total amount and count of Own booking
app.get('/ownbookingDashboard',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({ entryType: 'Own Booking' });
    const result = await OnlineForm.aggregate([
      {
        $match: { entryType: 'Own Booking' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)) : 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// calulating Sum of Total amount and count of cargo/ parcel booking
app.get('/cargoDashboard',async(req,res)=>{
  try {

    const count = await OnlineForm.countDocuments({entryType:'Cargo'});
    const result = await OnlineForm.aggregate([
      {
        $match: {entryType:'Cargo'}
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$subTotal' }
        }
      }
    ]);
    const sum = result.length > 0 ? parseFloat(result[0].totalAmount.toFixed(2)) : 0;
    res.json({ count, sum });
  } catch (error) {
    console.error('Error fetching agency entries stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



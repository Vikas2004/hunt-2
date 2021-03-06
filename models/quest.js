/**
 * quest Model
 */

const mongoose = require('mongoose');
autoInc = require('mongoose-auto-increment');
 var con = mongoose.createConnection("mongodb+srv://hunt-2:hunt@webcluster.65org.mongodb.net/hunt?retryWrites=true&w=majority");
autoInc.initialize(con)


const QuestSchema = new mongoose.Schema({

    questId:{
        type: Number,
        required: true,
        unique: true
    },
    questName: {
        type: String,
        required: true,
        unique: true,
        
    },
    
    questStartLocationLatitude: {
        type: Number,
        required: true,
        allowNull: true,
        validate: { min: -90, max: 90 }
      },
      questStartLocationLongitude: {
        type: Number,
        allowNull: true,
        validate: { min: -180, max: 180 }
      },
    });

QuestSchema.plugin(autoInc.plugin,{
  model: 'quest',
  field: 'questId',
  startAt: 111,
  incrementBy: 1
});

// Export model
module.exports = mongoose.model('Quest',QuestSchema)
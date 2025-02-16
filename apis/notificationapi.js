

const Notification = require('../models/Notification');


const admin = require('firebase-admin');
const bodyParser = require('body-parser');

module.exports = (app) => {

    app.post('/api/sendNotification', (req, res) => {
      const message = {
        notification: {
          title: req.body.title,
          body: req.body.body,
        },
        topic: 'allUsers',
      };
    
      // إرسال الإشعار
      admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
    
          // تخزين الإشعار في قاعدة البيانات
          const notification = new Notification({
            title: req.body.title,
            body: req.body.body,
          });
    
          notification.save()
            .then(() => {
              res.status(200).send('Notification sent and stored successfully!');
            })
            .catch((error) => {
              console.error('Error storing notification:', error);
              res.status(500).send('Failed to store notification');
            });
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          res.status(500).send('Failed to send notification');
        });
    });
    


    app.get('/api/getNotifications', (req, res) => {
        Notification.find().sort({ createdAt: -1 })
          .then((notifications) => {
            res.status(200).json(notifications);
          })
          .catch((error) => {
            console.error('Error fetching notifications:', error);
            res.status(500).send('Failed to fetch notifications');
          });
      });
      

      app.delete('/api/deleteNotification/:id', async (req, res) => {
        try {
          const { id } = req.params;
          
          // البحث عن الإشعار وحذفه
          const deletedNotification = await Notification.findByIdAndDelete(id);
      
          if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
          }
      
          res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
          console.error('Error deleting notification:', error);
          res.status(500).json({ message: 'Failed to delete notification' });
        }
      });
      

};
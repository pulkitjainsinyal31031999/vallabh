/* const express = require('express');
const router = express.Router();
var token = 'fLWrY2P_QZin1_b8Ofoe7A:APA91bHWk1UH5OwiX2nbJlPkMZ1ThTSA-3ExUpjlunb4hDKkQl-kCkjlyCqJ81wOjFy_Gwc288sSxbqWMKI_LgCmvMAPILT4EViFDg-TA2EZZB1PUblaUVP1a5KQquYlhkf9n_FSFQ8V';
const serviceAccount = require('../../shagun-ae5f1-firebase-adminsdk-mgxva-d2af4d6369.json');
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

router.post('/', (req, res, next) => {
    console.log('hi');
    console.log(req.body);
    token = req.body.data;
    res.status(200).json({
        message: 'success'
    });
});


router.post('/sendNotification', (req, res, next) => {
    const message1 = {
        token: token,
        notification: {
            title: 'hi',
            body: 'hi'
        },
        data: {
            title: 'hello',
            body: 'world'
        }
    };
    admin.messaging().send(message1).then((response) => {
        console.log('success');
        res.status(200).json({
            response
        });
    }).catch(err => res.status(500).json({result}));

});

module.exports = router;

 */
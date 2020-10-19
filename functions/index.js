const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const https = require('https');

// Server configuration
const token = 'SECRET KEY';
 
// IDScan.net configuration
const percents = {
    faceValidationPercent: 60,
    docValidationPercent: 70,
    spoof:70
};

const app = express();

app.use(express.json());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

function isAcceptableType (type) {
    return [1, 2].indexOf(type) !== -1
};

app.post('/ValidationRequests/complete', function (req, res) {
    let data = JSON.stringify({})
    
    const options = {
        host: 'dvs2.idware.net',
        port: 443,
        path: '/api/Verify/'+ req.body.requestId,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json-patch+json',
            'Content-Length': data.length,
            'Authorization': 'Bearer ' + token
        }
    };

    let chunks = '';
    const httpreq = https.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            chunks = chunks + chunk
        });
        response.on('end', function() {
            let data = JSON.parse(chunks)

            if (data.faceVerificationResult &&
                data.faceVerificationResult.confidence >= percents.faceValidationPercent
                && data.faceVerificationResult.antiSpoofing >= percents.spoof
            ) {
                data.isFaceSuccess = true
            } else {
                data.isFaceSuccess = false
            }
            let responseStatus = false
            if (isAcceptableType(data.documentType)) {
                if (data.documentVerificationResult &&
                    data.documentVerificationResult.totalConfidence &&
                    (data.documentVerificationResult.totalConfidence >= percents.docValidationPercent)
                ) {
                    data.isDocumentSuccess = true
                } else {
                    data.isDocumentSuccess = false
                }
            } else {
                if (data.documentVerificationResult &&
                    data.documentVerificationResult.totalConfidence &&
                    (data.documentVerificationResult.totalConfidence >= 95)
                ) {
                    data.isDocumentSuccess = true
                } else {
                    data.isDocumentSuccess = false
                }
            }

            if (data &&
                data.isFaceSuccess &&
                data.isDocumentSuccess) {
                responseStatus = true
            } else {
                responseStatus = false
            }
            res.json({
                payload: data,
                status: responseStatus
            })

        })
    });
    httpreq.write(data);
    httpreq.end();
});

exports.api = functions.https.onRequest(app);

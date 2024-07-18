const filter = require('./visionAI/filter');

const visionAI = async (req, res, next) => {
    const imageFile = req.files.file.data
    // console.log(req.files.file.mimetype)
    // return
    const encodedImage = Buffer.from(imageFile).toString('base64');
    let requestType
    const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
    const request = {
        requests: [
          {
            // inputConfig: {content: encodedImage, mimeType: "application/pdf"},
            // image: {content: encodedImage},
            features: features
          }
        ]
    }
    if (req.files.file.mimetype === "application/pdf") {
        request.requests[0].inputConfig =  {"content": encodedImage, "mimeType": "application/pdf"}
        requestType = "files"
    }
    if (req.files.file.mimetype.slice(0,5) === "image") {
        request.requests[0].image = {content: encodedImage}
        requestType = "images"
    }
    
    const apiRequest = await fetch(`https://vision.googleapis.com/v1/${requestType}:annotate?key=AIzaSyDPyRgXAJe2Vo7UPnQfnOUgFDAmTlh-ONY`,
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request)
    })
    .then(response => response.json())

    // if (requestType === "files") {
    // res.send(apiRequest.responses[0].responses[0].fullTextAnnotation.text.split("\n")[4]).end()
    // }
    // if (requestType === "images") {
    // res.send(apiRequest.responses[0].fullTextAnnotation.text.split("\n")).end()
    // }

    filterApiRequest = filter(apiRequest, requestType)
    res.send(filterApiRequest).end()
    // res.send(JSON.stringify(encodedImage)).end()
}

module.exports = visionAI;
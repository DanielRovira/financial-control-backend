const filter = require('./visionAI/filter');
    
const visionAI = async (req, res, next) => {
    const fileData = req.files?.file.data
    const encodedImage = Buffer.from(fileData).toString('base64');
    let requestType
    const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
    const request = {
        requests: [
          {
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
    
    const apiRequest = await fetch(`https://vision.googleapis.com/v1/${requestType}:annotate?key=${process.env.GOOGLE_API_KEY}`,
    {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request)
    })
    .then(response => response.json())

    filterApiRequest = filter(apiRequest, requestType)
    res.send(filterApiRequest).end()
}

module.exports = visionAI;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const location = 'us'; // Format is 'us' or 'eu'
    const processorId = process.env.GOOGLE_PROCESSOR_ID; // Create processor in Cloud Console
    // const filePath = '/path/to/local/pdf';
    

    const {DocumentProcessorServiceClient} = require('@google-cloud/documentai').v1;

    const client = new DocumentProcessorServiceClient();
    const documentAI = async (req, res, next) => {
        console.log("Google AI Started")
        const imageFile = req.files.file.data
 
        const name = client.processorPath(projectId, location, processorId);

        const encodedImage = Buffer.from(imageFile).toString('base64');

        const request = {
          name,
          rawDocument: {
            content: encodedImage,
            mimeType: 'application/pdf',
          },
        };

        const [result] = await client.processDocument(request);
        const {document} = result;
        const {text} = document;

        const getText = textAnchor => {
          if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return '';
          }

          const startIndex = textAnchor.textSegments[0].startIndex || 0;
          const endIndex = textAnchor.textSegments[0].endIndex;

          return text.substring(startIndex, endIndex);
        };

        const [page1] = document.pages;
        const {paragraphs} = page1;

        for (const paragraph of paragraphs) {
          const paragraphText = getText(paragraph.layout.textAnchor);
          console.log(`Paragraph text:\n${paragraphText}`);
        }
        return res.send(page1).end()
    }

module.exports = documentAI;
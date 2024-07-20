const util = require('util');
const filter = (apiRequest, requestType) => {
    if (!apiRequest.responses) { return apiRequest }

    let request
    if (requestType === "files") {
        request = apiRequest.responses[0].responses[0].fullTextAnnotation.text
    }
    if (requestType === "images") {
        request = apiRequest.responses[0].fullTextAnnotation.text
    }
    
    //universal for first $ symbol
    let response = {
        text: request,
        fields: request.split("\n"),
        amount: request.slice(request.search(/\$/)).slice(2).split("\n")[0]
    }
 
    if (request.search("infinitepay") !== -1) {
        let data = request.split("\n")
        function identify(data) {
            function isValidDate(date) {
                test = new Date(date)
                return test instanceof Date && !isNaN(test);
              }
            let date = data[2].slice(0,11)
            response = {...response,
                // amount: data[7].slice(3),
                date: isValidDate(date) ? new Date(date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
                destiny: data[9],
                cnpj: data[11],
            }
        }
        if (data[1] === "O infinitepay") {
            let newData = data.slice(1)
            identify(newData)
        }
        if (data[0] === "O infinitepay") {
            identify(data)
        }

    }

    if (request.search("Instituição do pagador: BANCO COOPERATIVO SICREDI S.A.") !== -1) {
        let date = request.split("\n")[2].slice(14,24)
        response = {...response,
            amount: request.split("\n")[1].slice(10),
            date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
            destiny: request.split("\n")[5].slice(22),
            cnpj: request.split("\n")[6].slice(22),
        }
    }

    return response
}

module.exports = filter;
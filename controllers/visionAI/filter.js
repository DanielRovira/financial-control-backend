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
        response = {...response,
            amount: request.split("\n")[7].slice(3),
            date: new Date(request.split("\n")[2].slice(0,11)).toISOString().slice(0,10),
            destiny: request.split("\n")[9],
            cnpj: request.split("\n")[11],
        }
    }
    if (request.search("Comprovante de Pagamento PIX") !== -1) {
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
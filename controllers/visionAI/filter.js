const filter = (apiRequest, requestType) => {
    let request
    if (requestType === "files") {
        request = apiRequest.responses[0].responses[0].fullTextAnnotation.text
    }
    if (requestType === "images") {
        request = apiRequest.responses[0].fullTextAnnotation.text
    }

    let response

    if (request.search("infinitepay") !== -1) {
        response = {
            amount: request.split("\n")[7].slice(3),
            date: request.split("\n")[2].slice(0,11),
            destiny: request.split("\n")[9],
            cnpj: request.split("\n")[11],
        }
    }
    if (request.search("Comprovante de Pagamento PIX") !== -1) {
        response = {
            amount: request.split("\n")[1].slice(10),
            date: request.split("\n")[2].slice(14,24),
            destiny: request.split("\n")[5].slice(22),
            cnpj: request.split("\n")[6].slice(22),
        }
    }
    // if (origin.search("")) {

    // }

    // universal for first $ symbol
    // amount = request.slice(request.search(/\$/)).slice(2).split("\n")[0]
    
    // let response = {
    //     amount: amount

    // }
    return response
}

module.exports = filter;
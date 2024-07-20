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
    let data = request.split("\n")
    //universal for first $ symbol
    let response = {
        text: request,
        fields: data,
        amount: request.slice(request.search(/\$/)).slice(2).split("\n")[0]
    }
 
    if (request.search("O infinitepay") !== -1) {
        let index = data.findIndex(item => item === "O infinitepay");
        let newData = data.slice(index)
        function isValidDate(date) {
            test = new Date(date)
            return test instanceof Date && !isNaN(test);
          }
        let date = newData[2].slice(0,11)
        response = {...response,
            // amount: data[7].slice(3),
            date: isValidDate(date) ? new Date(date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
            destiny: newData[9],
            cnpj: newData[11],
        }
    }

    if (request.search("Instituição do pagador: BANCO COOPERATIVO SICREDI S.A.") !== -1) {
        let date = data[2].slice(14,24)
        response = {...response,
            amount: data[1].slice(10),
            date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
            destiny: data[5].slice(22),
            cnpj: data[6].slice(22),
        }
    }

    if (request.search("Boleto") !== -1) {
        if (data[0] === "Sicredi" && data[4] === "Boletos"){
            let date = data[17].slice(19)
            response = {...response,
                amount: data[20].slice(22),
                date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
                destiny: data[9].slice(27),
                cnpj: data[13].slice(18),
            }
        }
    }

    if (request.search("Pagamento com Pix") !== -1) {
        let index = data.findIndex(item => item === "Pagamento com Pix");
        let newData = data.slice(index)
        let date = newData[6].slice(0,10)
        response = {...response,
            amount: newData[4].slice(3),
            date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
            destiny: newData[8].slice(6),
            cnpj: newData[9].slice(6),
        }
    }

    return response
}

module.exports = filter;
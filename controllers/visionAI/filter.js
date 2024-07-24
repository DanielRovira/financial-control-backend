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
        // amount: request.slice(request.search(/\$/)+1).replace(':', '').split("\n")[0].trim()
        amount: request.search(/\$/) !== -1 ? request.slice(request.search(/\$/)+1).replace(':', '').split("\n")[0].trim() : ''
    }

    // Infinitepay
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

    // SICREDI
    if (request.search("Instituição do pagador: BANCO COOPERATIVO SICREDI S.A.") !== -1 &&
        request.search("Comprovante de Pagamento PIX") !== -1) {
        let index = data.findIndex(item => item.slice(0,6) === "Valor:");
        let newData = data.slice(index)
        let date = newData[1].slice(14,24)
        response = {...response,
            amount: newData[0].slice(10),
            date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
            destiny: newData[4].slice(22),
            cnpj: newData[5].slice(22),
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

    // Banco do Brasil
    if (request.search("BANCO DO BRASIL") !== -1) {
        if (request.search("COMPROVANTE DE TED") !== -1) {
            if (data[2] === "BANCO DO BRASIL") {
                let date = data[0]
                response = {...response,
                    amount: data[31],
                    date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
                    destiny: data[6].slice(9),
                    cnpj: "",
                }
            }
        }
        if (request.search("Comprovante Pix") !== -1) {
            if (data[8] === "Comprovante Pix") {
                let date = data[2]
                response = {...response,
                    amount: data[19].slice(2),
                    date: `${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`,
                    destiny: data[9].slice(9),
                    cnpj: data[18],
                }
            }
        }

    }

    return response
}

module.exports = filter;
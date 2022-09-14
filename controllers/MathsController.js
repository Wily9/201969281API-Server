// William Marien-Harvey
// J'ai rajouter des validations pour chaque paire de paramètres, 
// le x et le y doit être les deux des nombres et non null, et chaqu'un deux est une erreur séparée.
// J'ai également fait la function findInvalidParameters qui regarde si la query string à quelque chose d'invalide
const path = require('path');
const fs = require('fs');

function factorial(n){
    if(n===0||n===1){
      return 1;
    }
    return n*factorial(n-1);
}
function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}
function findPrime(n){
    let primeNumer = 0;
    for ( let i=0; i < n; i++){
        primeNumer++;
        while (!isPrime(primeNumer)){
            primeNumer++;
        }
    }
    return primeNumer;
}

function findInvalidParameters(qString){
    return /[^xypon[\]|+\-*\/%!.&\\0-9?=]/.test(qString);
}

module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
        }
        get() {
            if(this.HttpContext.path.queryString == '?'){
                // Send helpPage
                let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathsServiceHelp.html");
                let content = fs.readFileSync(helpPagePath);
                this.HttpContext.response.content("text/html", content);
            }
            else{
                let qString = this.HttpContext.path.queryString;
                if (findInvalidParameters(qString))
                {
                    this.HttpContext.path.params.error = "Invalid parameters";
                    this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
                else if(this.HttpContext.path.params.op){
                            // If x and y are not null
                            if(this.HttpContext.path.params.x && this.HttpContext.path.params.y){ 
                                // If x and y are both numbers
                                if(!isNaN(this.HttpContext.path.params.x) && !isNaN(this.HttpContext.path.params.y)){ 
                                    // Add the numbers together and put them in a new parameter called value
                                    if(this.HttpContext.path.params.op == " "){
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) + Number(this.HttpContext.path.params.y);
                                    }
                                    else if(this.HttpContext.path.params.op == "-"){
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) - Number(this.HttpContext.path.params.y);
                                    }
                                    else if(this.HttpContext.path.params.op == "*"){
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) * Number(this.HttpContext.path.params.y);
                                    }
                                    else if(this.HttpContext.path.params.op == "/"){
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) / Number(this.HttpContext.path.params.y);
                                    }
                                    else if(this.HttpContext.path.params.op == "%"){
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) % Number(this.HttpContext.path.params.y);
                                    } 
                                    else{
                                        this.HttpContext.path.params.error = "This operator is either not supported or does not use x and y values";
                                    }
                                }
                                // If both of them are not numbers, look if x is a number
                                else if(isNaN(this.HttpContext.path.params.x)){
                                    // X is not a number, look if y is not a number
                                    if(isNaN(this.HttpContext.path.params.y)){
                                        this.HttpContext.path.params.error = "Parameters 'x' and 'y' are not numbers";
                                    }
                                    else{ this.HttpContext.path.params.error = "Parameter 'x' is not a number"; }
                                }
                                else{ this.HttpContext.path.params.error = "Parameter 'y' is not a number"; }
                            }
                            // If both of them are not null, look if x is null (to figure out which one is null)
                            else if(!this.HttpContext.path.params.x){
                                // x is null, look if y is null
                                if(!this.HttpContext.path.params.y){
                                    // y is null also, look if n is null
                                    if(!this.HttpContext.path.params.n){
                                        // if x, y and n are null, the values of the parameters are missing
                                        this.HttpContext.path.params.error = "None of the necessary parameters have values";
                                    }
                                    else{
                                        // If n is not null, look if n is a number
                                        if(!isNaN(this.HttpContext.path.params.n)){
                                            if(this.HttpContext.path.params.n % 1 == 0){
                                                if(this.HttpContext.path.params.op == "!"){
                                                    this.HttpContext.path.params.value = factorial(this.HttpContext.path.params.n);
                                                } 
                                                else if(this.HttpContext.path.params.op == "p"){
                                                    this.HttpContext.path.params.value = isPrime(this.HttpContext.path.params.n);
                                                }
                                                else if(this.HttpContext.path.params.op == "np"){
                                                    this.HttpContext.path.params.value = findPrime(this.HttpContext.path.params.n);
                                                }
                                            }
                                            else{
                                                this.HttpContext.path.params.error = "Parameter n is not an whole number";
                                            }  
                                        }
                                        else{
                                            this.HttpContext.path.params.error = "Parameter n is not a number";
                                        }
                                    }
                                    
                                }
                                // Y is not null, look if y is a number
                                else if(isNaN(this.HttpContext.path.params.y)){
                                    this.HttpContext.path.params.error = "Parameter 'x' is missing and 'y' is not a number";
                                }
                                else{ this.HttpContext.path.params.error = "Parameter 'x' is missing"; }
                            }
                            // X is not null, look if x is a number
                            else if(isNaN(this.HttpContext.path.params.x)){
                                this.HttpContext.path.params.error = "Parameter 'x' is not a number and 'y' is missing";
                            }
                            // X is a number but y is still missing
                            else{ 
                                this.HttpContext.path.params.error = "Parameter 'y' is missing"; 
                            }
                            // Send response
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                        }
                        else {
                        this.HttpContext.path.params.error = "Parameter 'op' is missing";
                        this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
            }
        }
    }
const path = require('path');
const fs = require('fs');
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
                if(this.HttpContext.path.params.op){
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
                                        //this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) % Number(this.HttpContext.path.params.y);
                                        this.HttpContext.path.params.value = Number(this.HttpContext.path.params.x) / Number(this.HttpContext.path.params.y) * 100 + " %";
                                    }  
                                }
                                // If both of them are not numbers, look if x is a number
                                else if(isNaN(this.HttpContext.path.params.x)){
                                    // X is not a number, look if y is not a number
                                    if(isNaN(this.HttpContext.path.params.y)){
                                        this.HttpContext.path.params.error = "Parameter 'x' and 'y' are not numbers";
                                    }
                                    else{ this.HttpContext.path.params.error = "Parameter 'x' is not a number"; }
                                }
                                else{ this.HttpContext.path.params.error = "Parameter 'y' is not a number"; }
                            }
                            // If both of them are not null, look if x is null
                            else if(!this.HttpContext.path.params.x){
                                // x is null, look if y is null
                                if(!this.HttpContext.path.params.y){
                                    this.HttpContext.path.params.error = "Parameter 'x' and 'y' are missing";
                                }
                                else if(isNaN(this.HttpContext.path.params.y)){
                                    this.HttpContext.path.params.error = "Parameter 'x' is missing and 'y' is not a number";
                                }
                                else{ this.HttpContext.path.params.error = "Parameter 'x' is missing"; }
                            }
                            else if(isNaN(this.HttpContext.path.params.x)){
                                this.HttpContext.path.params.error = "Parameter 'x' is not a number and 'y' is missing";
                            }
                            else{ this.HttpContext.path.params.error = "Parameter 'y' is missing"; }
                            // Send response
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                } else {
                    this.HttpContext.path.params.error = "Parameter 'op' is missing";
                    this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
            }
        }
    }
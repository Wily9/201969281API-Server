const MathModel = require('../models/math');
const Repository = require('../models/repository');
module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
            this.repository = new Repository(new MathModel());
        }
        get(id) {
            if (this.repository != null) {
                if (!isNaN(id)) {
                    let data = this.repository.get(id);
                    if (data != null)
                        this.HttpContext.response.JSON(data);
                    else
                        this.HttpContext.response.notFound();
                }
                else
                    this.HttpContext.response.JSON(this.repository.getAll());
            }
            else
                this.HttpContext.response.notImplemented();
        }
    }
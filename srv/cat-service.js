const cds = require('@sap/cds')

module.exports = class CatalogService extends cds.ApplicationService{
    
    async init(){
        const {Books} = cds.entities
        
        this.before('CREATE','Orders',async(req) =>{
            //console.log(req);
            const order = req.data

            if(!order.amount || order.amount <=0) return req.error (400, 'Order at least 1 book')

            const tx = cds.transaction(req)
            const affectedRows = await tx.run(
                UPDATE(Books)
                .set   ({ stock: {'-=': order.amount}})
                .where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
            )
            if (affectedRows === 0)  req.error (409, "Sold out, sorry")
        })

        return super.init()
    }

}
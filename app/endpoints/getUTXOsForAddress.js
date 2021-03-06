const Web3 = require('web3');
const ethUtil = require('ethereumjs-util'); 
const assert = require('assert')

module.exports = function(app, levelDB, web3) {
    const getUTXOforAddress = require('../helpers/getAllUTXOsForAddress')(levelDB);
    app.get('/utxos/:address', 'getUtxosByAddress', async function(req, res, next) {
        try{ 
            addressString = req.params.address
            assert(ethUtil.isValidAddress(addressString))
            addressString = ethUtil.addHexPrefix(addressString)
            getUTXOforAddress(addressString, function(err, utxos) {
                if (err){
                    console.log(err)
                    res.json({error: true, reason: "invalid address"});
                    next()
                }
                res.json({error: false, address: addressString, utxos})
                next()
                return
            })
        }
        catch(error) {
            res.json({error: true, reason: "invalid address"});
            next()
        }
    });
}
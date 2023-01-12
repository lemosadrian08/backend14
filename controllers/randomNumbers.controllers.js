const path = require('path')
const { fork } = require('child_process')
const { successResponse } = require('../utils/api.utils')

class RandomNumbersController {
  getRandoms(req, res, next) {
    try {
        const { qty } = req.query
        const calculateRandomNumbers = fork(path.resolve(__dirname, '../utils/randomNumbers.utils.js'))
        calculateRandomNumbers.send (qty || 1000000)
        calculateRandomNumbers.on('message', (data) => {
        const response = successResponse(data)
        console.log(data);
        res.json(response)
        })

    } catch (err) {
      next(err)
    }
  }
}

module.exports = new RandomNumbersController()
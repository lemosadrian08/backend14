const { getProcessInfo } = require('../utils/processInfo')




class ProcessInfoController {
    processInfoC(req, res, next) {
/*       console.log("THIS IS A TEST"); */
      try {
        const processInfo= getProcessInfo()
        res.json(processInfo)
      } catch (err) {
        next(err)
      }
    }
  }

  module.exports= new ProcessInfoController()
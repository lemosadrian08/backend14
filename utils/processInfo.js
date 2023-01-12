const processInfo={
    processId: process.pid,
    nodeVersion: process.version,
    operatingSystemPlatform: process.platform,
    currentWorkingDirectory: process.cwd(),
    nodeExecutablePathname: process.execPath,
    arguments: process.argv,
    memoryUsage: process.memoryUsage.rss()
}

const getProcessInfo = ()=>{
    return processInfo
}

module.exports= {getProcessInfo}

var m = function timeout() { 
    return new Promise(function(resolve) { 
        console.log("123")
        resolve();
    });
  }
  
  // Note: This code uses arrow function syntax
  m ().then(() => { 
    console.log("done!");
  })
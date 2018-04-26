var sampleUrl       = "http://www.google.com",
    sampleUrlS      = "https://www.google.com",
    sampleCode      = "528",
    sampleGarbage   = "fri/f[84";
    
var filterCode   = new RegExp('^[0-9]');
var filterUrls   = /(?=.*https|http)(?=.*\w(?=\.))/;

// var reg = filterCode;
var reg = filterUrls;


// console.log(sampleUrl.match(reg));
// console.log(sampleUrlS.match(reg));
// console.log(sampleCode.match(reg));
// console.log(sampleGarbage.match(reg));

console.log(reg.test(sampleUrl));
console.log(reg.test(sampleUrlS));
console.log(reg.test(sampleCode));
console.log(reg.test(sampleGarbage));

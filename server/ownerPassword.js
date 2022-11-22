var argon2 = require('argon2')
argon2.hash('12345').then(a=>console.log(a))
// $argon2i$v=19$m=4096,t=3,p=1$oulcIvT8rCJdz7VbipyZuw$7TOwbwMrSOAGSXBKO0TtRMW63+xTVuCxmuZORVB7En4
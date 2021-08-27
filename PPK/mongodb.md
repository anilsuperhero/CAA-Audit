1.  mongodump -h 192.168.1.119 -d exchange -o C:\Users\anils\Desktop\database

2.  mongorestore -u mongoadmin -h 65.0.135.70 --authenticationDatabase admin --port 27089 -d exchange /var/www/html/database/exchange

3.  DB_URL=mongodb://admin:admin123@65.0.135.70:27089/exchange?authSource=admin

4.  mongo -host '65.0.135.70' --port '27089' -u 'admin' -p 'admin123'

5.  db.createUser({ user: "mongoadmin" , pwd: "mongoadmin", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})

user :db.createUser({user:"admin", pwd:"admin123", roles:[{role:"root", db:"admin"}]})
host: 65.0.135.70
databse port:27089

db.getCollection('recents').aggregate([{$match:{"user_id" : ObjectId("60519b099bc3c640e8ae8f45")}},{
$lookup:
{
from: 'products',
localField: "product_id",
foreignField: "_id",
as: "productData"
}
},{$unwind:"$productData"},{$match:{"productData.gender":"men"}},{$project:{'productData':"$productData.name"}}])

db.getCollection('products').updateMany({}, {"$set":{"trending": true}});

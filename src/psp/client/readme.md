## Client Subdomain

Here we have the subdomain of our client entity. 

#### Domain
Each client has a uuid id, a name, an account field and a status. I'm assuming that we cannot delete clients, just deactivate them. The Client class has every validation we need to let a client be registered to the database and it depends on its value objects. To simplify, the account data is just a field, although it could be an entity with way more fields for itself. 

### Services
Since I'm not using the 'use cases' principles, I chose to mantain services as the functional part of the domain. Soon I'll be changing it to not depend on typeorm repository directly since it's not a good pratice. 

### Adapters
At the adapters, the client entity makes contact with external resources, such as controllers and ORMs. 
- [Installation](#installation)
- [Introduction](#introduction)
  - [Generating Resources](#generating-resources)
  - [Resource Collections](#resource-collections)
- [Concept Overview](#concept-overview)
  - [Resource Collections](#resource-collections-1)
  - [Customizing the Underlying Resource Class](#customizing-the-underlying-resource-class)
- [Writing Resources](#writing-resources)
  - [Relationships](#relationships)
  - [Conditional Attributes](#conditional-attributes)


# Installation
```bash
node ace add adonis-api-resource
```

# Introduction
When building an API, you may need a transformation layer that sits between your models and the JSON responses that are actually returned to your application's users. For example, you may wish to display certain properties for a subset of users and not others, or you may wish to always include certain relationships in the JSON representation of your models. Resource classes allow you to expressively and easily transform your models and model collections into JSON.

Of course, you may always convert models or collections to JSON using their **serialize()** methods; however, Api Resources provide more granular and robust control over the JSON serialization of your models and their relationships.

# Generating Resources
To generate a resource class, you may use the **make:resource** ace command. By default, resources will be placed in the **app/http/resources** directory of your application. Resources extend the **JsonResource** class:

```bash
node ace make:resource user_resource
```
## Resource Collections
In addition to generating resources that transform individual models, you may generate resources that are responsible for transforming collections of models. This allows your JSON responses to include links and other meta information that is relevant to an entire collection of a given resource.

To create a resource collection, you should use the --collection flag when creating the resource. Collection resources extend the **ResourceCollection** class:

```bash
node ace make:resource user_collection --collection
```

# Concept Overview
Before diving into all of the options available to you when writing resources, let's first take a high-level look at how resources are used. A resource class represents a single model that needs to be transformed into a JSON structure. For example, here is a simple **UserResource** resource class:
```typescript
import { JsonResource } from 'adonis-api-resource'
import User from '#models/user'

export default class UserResource extends JsonResource<User> {
  public serialize() {
    //we can access model from this.resource
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email
    }
  }
}
```
Every resource class defines a **serialize** method which returns the object of properties that should be converted to JSON when the resource is returned as a response from a route or controller method.
Once a resource has been defined, it may be returned directly from a route or controller:
```typescript
router.get('users/:id', async ({ params }) => {
  const user = await User.find(params.id)
  return new UserResource(user)
})
```

## Resource Collections
If you are returning a array of resources you can just do a **map**
```typescript
router.get('users', async () => {
  const users = await User.all()
  return users.map(user => new UserResource(user))
})
```

However when returning a paginated response, you should always use **ResourceCollection** collection's **for** method 
```typescript
import { ResourceCollection } from 'adonis-api-resource'

router.get('users', async () => {
  const users = await User.query().paginate()
  return ResourceCollection.for(UserResource).make(users)
})
```
Note that this does not allow any addition of custom meta data that may need to be returned with your collection. If you would like to customize the resource collection response, you may create a dedicated resource to represent the collection:
```bash
node ace make:resource user_collection --collection
```
Once the resource collection class has been generated, you may easily define any meta data that should be included with the response:
```typescript
import { ResourceCollection } from 'adonis-api-resource'

export default class UserCollection extends ResourceCollection {
  public serialize() {
    return {
      data: this.collection,
      links: {
        self: 'link-value'
      }
    }
  }
}
```
After defining your resource collection, it may be returned from a route or controller:
```typescript
router.get('users', async () => {
  const users = await User.all()
  return new UserCollection(users)
})
```

## Customizing the Underlying Resource Class
Typically, the **this.collection** property of a resource collection is populated with the result of mapping each item of the collection to its singular **JsonResource** class. that means **this.collection** is array of **JsonResource**
To customize the resource class to be used, you may override the **collects** property of your resource collection:
```typescript
import { ResourceCollection } from 'adonis-api-resource'
import UserResource from '#resources/user_resource'

export default class UserCollection extends ResourceCollection<typeof UserResource> {
  /**
   * The resource that this resource collects.
   *
   * @var string
   */
  public collects = UserResource;
}
```


# Writing Resources
Resources only need to transform a given model into an object. So, each resource contains a **serialize** method which translates your model's properties into an API friendly object that can be returned from your application's routes or controllers:

```typescript
import { JsonResource } from 'adonis-api-resource'
import User from '#models/user'

export default class UserResource extends JsonResource<User> {
  public serialize() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email
    }
  }
}
```
Once a resource has been defined, it may be returned directly from a route or controller:
```typescript
router.get('users/:id', async ({ params }) => {
  const user = await User.find(params.id)
  return new UserResource(user)
})
```


## Relationships

If you would like to include related resources in your response, you may add them to the object returned by your resource's **serialize** method. In this example, we will use **ResourceCollection** collection's **for** method and **PostResource** to add the user's blog posts to the resource response
```typescript
import { ResourceCollection } from 'adonis-api-resource'
import PostResource from '#resources/post_resource'


public serialize() {
  return {
    id: this.resource.id,
    name: this.resource.name,
    email: this.resource.email
    posts: ResourceCollection.for(PostResource).make(this.resource.posts)
  }
}
```

## Conditional Attributes
Sometimes you may wish to only include an property in a resource response if a given condition is met. For example, you may wish to only include bio if the user has bio. The **when** method may be used to conditionally add an property to a resource response:
```typescript
public serialize() {
  return {
    id: this.resource.id,
    name: this.resource.name,
    email: this.resource.email,
    bio: this.when(this.resource.bio, this.resource.bio.substring(0, 15) + '...')
  }
}
```
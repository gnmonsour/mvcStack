# mvcStack

This is a study of implementing a full stack application in javascript with node, express, mongodb and mongoose.

See a deployment at: https://full-stack-mvc.herokuapp.com/

### What you'll need
For development mode add a .env file with a line assigning **DATABASE_URL** to a mongodb source (local or network).

ie. 

````text
DATABASE_URL='mongodb://localhost/mvc-stack'
````

For production mode you should use a MongoDB Atlas connection string in your chosen platform's configuration field.

A good resource on installing MongoDB on Ubuntu is [linuxise](https://linuxize.com/post/how-to-install-mongodb-on-ubuntu-18-04/)

### Things I learned
- I found the filepond plug-in really interesting to use.
- The use of the `defer` directive in the script tag is really helpful in loading js libraries.
- The EJS template language is simple and capable.
- The `populate` method for relational data is real smart.
- I've got to start "ReadMe's" earlier.

### To Do
- Implement testing
- Add application access control
- Understand MongoDB access control and add how-to this document
- Use the 'Projects' tools of github going forward

### Platforms
- Windows 10
- Ubuntu 18.04 (via VM)

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).

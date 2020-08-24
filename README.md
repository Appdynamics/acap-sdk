# acap-sdk
SDK for Custom App Program Components

## Installation
In your package.json add the following line to your list of dependencies
```
"acap-sdk": "https://github.com/Appdynamics/acap-sdk.git#v1.0.10"
```

## Usage
Include "node_modules/acap-sdk/dist/app.js" in your website. 

See ... to see documentation on examples.

## Version Updates
Note: Commit your changes first. No need to push.
Running 
```
npm version patch -m "Upgrade to %s for reasons"
```
Will update to a new patch version.  

Major versions can be created by manually using the git tag.  After commiting all the changes and updating the package.json with the correct version, run 
```
git tag -a v{Major}.{Minor}.{Patch} -m "Description"
```
Then run 
```
git push && git push --tags
```
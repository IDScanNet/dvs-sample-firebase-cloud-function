# Project setup
1. Install project dependencies
```
npm install
```

# Deploy to Firebase

1. Install the Firebase CLI

```
npm install -g firebase-tools
```

2. Login in to Firebase
```
firebase login
```

3. Setup the firebase project we are deploying to
```
firebase init functions
```
- Select `Yes` you are ready to proceed
- Create a new project in your firebase account for this deployment
- Select `Javascript` when asked what language would you like to use to write your Cloud Function
- Select `No` when asked if you want to use ESLint to catch probable bugs and enforce style
- Select `No` when asked to overwrite the `package.json`, `index.js` and the `.gitignore` files
- Select `Yes` when asked if you want to install dependencies with npm now

4. Deploy the project to firebase

```
firebase deploy
```


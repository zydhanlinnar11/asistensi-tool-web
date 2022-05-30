import admin from 'firebase-admin'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(`${process.env.FIREBASE_KEY}`)
      ),
    })
  } catch (error) {
    console.log('Firebase admin initialization error', error)
  }
}
export default admin.firestore()

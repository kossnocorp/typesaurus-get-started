import './initFirebase'
import {
  add,
  get,
  set,
  update,
  collection,
  field,
  Ref,
  value
} from 'typesaurus'

async function main() {
  // ⭐️ Create your schema in two steps:

  // 1. Define the models

  interface Note {
    text: string
  }

  interface Share {
    note: Ref<Note>
    tags: string[]
    sharedAt: Date
    comment?: string
    meta: {
      views: number
      likes: number
    }
  }

  // 2. Create the collections

  const notes = collection<Note>('notes')
  const shares = collection<Share>('shares')

  // Now, you're ready to work with your database!

  // ⭐️ Add data

  // Create a document with random id
  const adddedNote = await add(notes, { text: 'Hello, cruel world!' })

  console.log('The document structure:')
  console.log(JSON.stringify(adddedNote, null, 2))
  //=> {
  //=>   __type__: 'doc',
  //=>   ref: {
  //=>     __type__: 'ref',
  //=>     collection: {
  //=>       __type__: 'collection',
  //=>       path: 'notes'
  //=>     },
  //=>     id: 'R9L38yZ0BYWNYjvJ9odK'
  //=>   },
  //=>   data: {
  //=>     text: 'Hello, cruel world!'
  //=>   }
  //=> }

  // Set document with given id
  const settedNote = await set(notes, 'test', { text: 'Test note' })

  const addedShare = await add(shares, {
    note: adddedNote.ref,
    tags: ['test', 'demo', 'docs'],
    sharedAt: value('serverDate'),
    meta: {
      views: 0,
      likes: 0
    }
  })

  // Demo of the add/set errors:
  if (0) {
    // ❌ Wrong value type
    // Type 'number' is not assignable to type 'string'.
    // The expected type comes from property 'text' which is declared here on type 'Note'
    add(notes, { text: 420 })

    // ❌ Wrong field name
    // Argument of type '{ tex: string; }' is not assignable to parameter of type 'Note'.
    // Object literal may only specify known properties, but 'tex' does not exist in type 'Note'.
    // Did you mean to write 'text'?
    set(notes, 'test', { tex: 'Test' })
  }

  // ⭐️ Update data

  // Update field fields
  update(addedShare.ref, {
    comment: 'Hi, check this out!',
    // Union or remove elements from arrays
    tags: value('arrayUnion' /* or 'arrayRemove' */, ['docs', 'documentation'])
  })

  // Update using field paths
  update(addedShare.ref.collection, addedShare.ref.id, [
    field(['meta', 'views'], value('increment', 100500))
  ])

  // ⭐️ Read data

  // Get single document from the DB by ref
  const shareFromDB = await get(addedShare.ref)

  // Or using collection-id pair
  await get(shares, addedShare.ref.id)

  console.log('The updated & retrieved document:')
  console.log(JSON.stringify(shareFromDB, null, 2))
  //=> {
  //=>   __type__: 'doc',
  //=>   ref: {
  //=>     __type__: 'ref',
  //=>     collection: {
  //=>       __type__: 'collection',
  //=>       path: 'shares'
  //=>     },
  //=>     id: 'JG7KD8KhaHD9I3i9ubrT'
  //=>   },
  //=>   data: {
  //=>     note: {
  //=>       __type__: 'ref',
  //=>       collection: {
  //=>         __type__: 'collection',
  //=>         path: 'notes'
  //=>       },
  //=>       id: 'R9L38yZ0BYWNYjvJ9odK'
  //=>     },
  //=>     sharedAt: '2019-08-15T12:30:25.895Z',
  //=>     tags: ['test', 'demo', 'docs'],
  //=>     meta: {
  //=>       views: 0,
  //=>       likes: 0
  //=>     }
  //=>   }
  //=> }
}

main()

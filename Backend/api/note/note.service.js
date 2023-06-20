const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '', pin: false }) {
    try {
        const criteria = {}
        if (filterBy.txt) {
            criteria.content = { $regex: filterBy.txt, $options: 'i' }
        }
        if (filterBy.pin) criteria.isPinned = filterBy.pin
        criteria.createdBy = filterBy.userId
        const collection = await dbService.getCollection('note')
        console.log('criteria:', criteria)
        const notes = await collection.find(criteria).toArray()
        notes.reverse()
        const sortedNotes = notes.reduce((acc, note) => {
            if (note.isPinned) acc.unshift(note)
            else acc.push(note)
            return acc
        }, [])
        return sortedNotes
    } catch (err) {
        logger.error('cannot find notes', err)
        throw err
    }
}

async function getById(noteId) {
    try {
        const collection = await dbService.getCollection('note')
        const note = collection.findOne({ _id: ObjectId(noteId) })
        return note
    } catch (err) {
        logger.error(`while finding note ${noteId}`, err)
        throw err
    }
}

async function remove(noteId) {
    try {
        const collection = await dbService.getCollection('note')
        await collection.deleteOne({ _id: ObjectId(noteId) })
        return noteId
    } catch (err) {
        logger.error(`cannot remove note ${noteId}`, err)
        throw err
    }
}

async function add(note) {
    try {
        console.log('adding', note)
        const collection = await dbService.getCollection('note')
        await collection.insertOne(note)
        return note
    } catch (err) {
        logger.error('cannot insert note', err)
        throw err
    }
}

async function update(note) {
    try {
        const noteToSave = {
            txt: note.txt,
            color: note.color,
            isPinned: note.isPinned,
            title: note.title,
            todos: note.todos,
            content: note.txt + note.title + note.todos.join(''),
            createdBy: note.createdBy,
            url: note.url
        }
        const collection = await dbService.getCollection('note')
        await collection.updateOne({ _id: ObjectId(note._id) }, { $set: noteToSave })
        return noteToSave
    } catch (err) {
        logger.error(`cannot update note ${note._id}`, err)
        throw err
    }
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update
}

const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {txt : '' , pin: false}) {
    try {
        const criteria = {}
        if (filterBy.txt) {
            criteria.title = { $regex: filterBy.txt, $options: 'i' }
            criteria.txt = { $regex: filterBy.txt, $options: 'i' }
            criteria.content = { $regex: filterBy.txt, $options: 'i' }
        }
        if(filterBy.pin) criteria.isPinned = filterBy.pin
        const collection = await dbService.getCollection('note')
        var notes = await collection.find(criteria).toArray()
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
            title: note.title
        }
        const collection = await dbService.getCollection('note')
        await collection.updateOne({ _id: ObjectId(note._id) }, { $set: noteToSave })
        return note
    } catch (err) {
        logger.error(`cannot update note ${noteId}`, err)
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

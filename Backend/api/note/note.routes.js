const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getNotes, getNoteById, addNote, updateNote, removeNote, addNoteMsg, removeNoteMsg } = require('./note.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getNotes)
router.get('/:id', getNoteById)
router.post('/', requireAuth, addNote)
router.put('/:id', requireAuth, updateNote)
router.delete('/:id', requireAuth, removeNote)
// router.delete('/:id', requireAuth, requireAdmin, removeNote)

router.post('/:id/msg', requireAuth, addNoteMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeNoteMsg)

module.exports = router
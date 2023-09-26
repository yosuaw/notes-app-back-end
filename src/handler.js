const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = { title, tags, body, id, updatedAt };
    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        return h
        .response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        })
        .code(201);
        // .header('Access-Control-Allow-Origin', '*');
    }

    return h
    .response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    })
    .code(500);
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
      notes,
    },
  });

const getNotebyIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id)[0];
    if (note) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    } else {
        return h.response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        }).code(404);
    }
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const idx = notes.findIndex((note) => note.id === id);
    if (idx !== -1) {
        notes[idx] = {
            ...notes[idx],
            title, tags, body, updatedAt,
        };

        return h.response({
            status: 'success',
            message: 'catatan berhasil diperbarui',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const idx = notes.findIndex((note) => note.id === id);

    if (idx !== -1) {
        notes.splice(idx, 1);
        return h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = { addNoteHandler, getAllNotesHandler, getNotebyIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};

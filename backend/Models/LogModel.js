import dbLocal from 'db-local';
const { Schema } = new dbLocal({ path: "../databases" });

// Define el esquema para los logs de eliminaciones
const DeletionLog = Schema("DeletionLog", {
    _id: { type: Number, required: true },
    appointmentId: { type: Number, required: true },
    deletedAt: { type: String, required: true },
    deletedData: { type: Object, required: true }
});

export { DeletionLog };
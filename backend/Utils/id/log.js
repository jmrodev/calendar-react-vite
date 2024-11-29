
export const newLogId = () => {
    const allLogs = DeletionLog.find();
    if (allLogs.length === 0) return 1; 
    return Math.max(...allLogs.map(log => log._id)) + 1;
};
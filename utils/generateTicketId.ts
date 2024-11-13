// utils/generateTicketId.ts
export const generateTicketId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketId = '';
    for (let i = 0; i < 6; i++) {
        ticketId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log('Generated Ticket ID:', ticketId); // Log the generated ticket ID
    return ticketId;
};

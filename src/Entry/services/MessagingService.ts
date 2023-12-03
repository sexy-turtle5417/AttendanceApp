export interface MessagingService{
    sendMessage(phoneNumber: number): Promise<void>
}
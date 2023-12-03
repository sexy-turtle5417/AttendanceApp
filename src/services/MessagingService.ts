export interface MessagingService{
    sendMessage(phoneNumber: string): Promise<void>
}
import { MessagingService } from "./MessagingService";

export class MessagingServiceMockImpl implements MessagingService{
    async sendMessage(phoneNumber: string): Promise<void> {
        console.log(`Message sent to ${phoneNumber}`)
    }
}
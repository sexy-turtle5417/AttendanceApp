import { MessagingService } from "./MessagingService";

export class MessagingServiceMockImpl implements MessagingService{
    async sendMessage(phoneNumber: number): Promise<void> {
        console.log(`Message sent to ${phoneNumber}`)
    }
}
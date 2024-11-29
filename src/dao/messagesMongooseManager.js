import { MessageModel } from "./models/message.model.js";

export class MessagesMongooseManager {

  static async getMessages()  {
    return await MessageModel.find().lean().exec();
 }
 //Agregar mensaje
static async addMessage(message){
  let newMessage= await MessageModel.create(message)
   return newMessage.toJSON()

}
}

